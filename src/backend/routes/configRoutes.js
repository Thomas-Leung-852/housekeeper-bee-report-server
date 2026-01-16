import express from 'express';
import { renderReport, listTemplates } from '../services/templateLoader.js';
import { fetchData } from '../services/dataFetcher.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import multer from 'multer';
import checkForDangerousCode from '../utils/checkForDangerousCode.js'
import checkForDangerousCodeEx from '../utils/checkForDangerousCodeEx.js'
import bwipjs from 'bwip-js';
import NosqlDbTools from '../utils/nosqlDbTools.js'
import jwt from 'jsonwebtoken';

//******************************************** */
// Report Template management :: Begin
//******************************************** */

// Common file functions

// Determine __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

// Use environment variable or default to 'templates' folder
const UPLOAD_DIR = path.join(
  __dirname,
  process.env.HOUSEKEEPER_BEE_REPORT_TEMPLATE_FOLDER || 'templates'
);

// Create upload directory if not exists
fs.mkdir(UPLOAD_DIR, { recursive: true })
  .then(() => console.log(`Upload directory: ${UPLOAD_DIR}`))
  .catch(err => console.error('Error creating directory:', err));

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: async (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    let filename = file.originalname;
    let counter = 1;

    // Check if file exists and rename if needed
    while (await fileExists(path.join(UPLOAD_DIR, filename))) {
      filename = `${base}-${String(counter).padStart(2, '0')}${ext}`;
      counter++;
    }

    cb(null, filename);
  }
});

const readMarkdownFileAsync = async (filePath) => {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (err) {
    console.error('Error reading the Markdown file:', err);
  }
};

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) === '.jsx') {
      cb(null, true);
    } else {
      cb(new Error('Only .jsx files allowed'));
    }
  }
});

// Helper function
const fileExists = async (filepath) => {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
};


//******************************************** */
// Report Template management :: End
//******************************************** */

const router = express.Router();

// Session token verification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (token === null || token === 'Bearer') {
    return res.status(401).json({ error: 'Invalid Session Token.' });
  }

  next();
};

// Get housekeeper bee session token
// router.get('/housekeeper_bee/session_token', (req, res) => {
//   return {'session_token': 'aa-bb-cc-dd'};
// });

//*************************************************** */
// Get Cliam from session token 
// if run on client side jsonwebtoken cause error
//*************************************************** */
router.get('/decode/:sessionToken', (req, res) => {
  const { sessionToken } = req.params
  const decoded = jwt.decode(sessionToken);
  res.json({userCode: `${decoded?.userCode || '' }`, userDisplayName: `${decoded?.userDisplayName || ''}`});
});



// Safe config endpoint - only non-sensitive data
router.get('/config', (req, res) => {
  res.json({
    HOUSEKEEPER_BEE_RETURN_URL: process.env.HOUSEKEEPER_BEE_RETURN_URL
  });
});

// List available report templates
router.get('/reports/list', async (req, res) => {
  try {
    const templates = await listTemplates();

    var templatesProfile = templates.map((item) => ({
      name: item.templateName,
      title: formatTitle(item.templateName),
      url: `/api/reports/render/${item.templateName}`,
      file_hash: item.fileHash
    }));

    res.json({
      success: true,
      reports: templatesProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

//************************************************************************************************************************************************* */
// Favorite :: Begin
//************************************************************************************************************************************************* */

router.get('/reports/:userId/favorite', async (req, res) => {
  const { userId } = req.params;
  const nosqlDbTools = new NosqlDbTools();
  const docs = await nosqlDbTools.findDocuments() || {};

  var rst = {};

  if (Array.isArray(docs) && docs.length > 0) {
    rst = docs.filter(e => e.doc_type === 'favorite' && e.user === `${userId}`);
  }

  res.send(rst);
});

router.get('/reports/:userId/favorite/:rptHash', async (req, res) => {
  const { userId, rptHash } = req.params;
  const nosqlDbTools = new NosqlDbTools();
  const docs = await nosqlDbTools.findDocuments() || {};

  var rst = {};

  if (Array.isArray(docs) && docs.length > 0) {
    rst = docs.filter(e => e.doc_type === 'favorite' && e.user === `${userId}` && e.file_hash === `${rptHash}`);
  }

  res.send(rst);
});

router.post('/reports/:userId/favorite/:rptHash', verifyToken, async (req, res) => {
  const { userId, rptHash } = req.params;
  const nosqlDbTools = new NosqlDbTools();
  const dt = { doc_type: 'favorite', file_hash: `${rptHash}`, user: `${userId}` };

  nosqlDbTools.deleteDocument({ doc_type: 'favorite', file_hash: `${rptHash}`, user: `${userId}` });
  nosqlDbTools.insertDocument(dt);

  const rst = { result: 'success' }

  res.send(rst);
});

router.delete('/reports/:userId/favorite/:rptHash', verifyToken, async (req, res) => {
  const { userId, rptHash } = req.params;
  const nosqlDbTools = new NosqlDbTools();

  nosqlDbTools.deleteDocument({ doc_type: 'favorite', file_hash: `${rptHash}`, user: `${userId}` });

  const rst = { result: 'success' }

  res.send(rst);
});

//************************************************************************************************************************************************* */
// Favorite :: End
//************************************************************************************************************************************************* */


//Error handle page
router.get('/error/:errCode/:msg', async (req, res) => {
  const { errCode, msg } = req.params;
  res.send(`<html><body>Code:${errCode}<br>Error:${msg}</body></html>`);
});

// Missing sesson token 
router.get('/reports/render/:templateName/:cssStyle/', async (req, res) => {
  res.send(prepareErrPg('9000', 'Session Expired. Please login from Housekeeper Bee again.'));
});

// Render specific report
router.get('/reports/render/:templateName/:cssStyle/:sessionToken', async (req, res) => {
  try {
    const { templateName } = req.params;
    const { cssStyle } = req.params;
    const { sessionToken } = req.params;
    const { format = 'html' } = req.query;

    const apiUrl = process.env.HOUSEKEEPER_BEE_API_URL;
    const apiKey = process.env.HOUSEKEEPER_BEE_API_KEY;

    // Fetch data from API or use sample data
    let data;
    if (apiUrl) {
      data = await fetchData(`${apiUrl}/api/housekeeping/storage/service/findStorageBox/*/false`, apiKey, sessionToken);
    } else {
      data = getSampleData();
    }

    // Render report
    const html = await renderReport(templateName, cssStyle, data);

    if (format === 'json') {
      res.json({ success: true, html, data });
    } else {
      res.send(html);
    }
  } catch (error) {
    //console.error('Error rendering report:', error);
    if (error.message.includes('(Error Code:9999)')) {
      res.send(prepareErrPg('9060', 'No Records or session Expired.'));
    } else {
      res.send(prepareErrPg('9050', 'Session Expired. Please login from Housekeeper Bee again.' + error));
    }

  }
});

//Download prompt download - v1.1.0 added
router.get('/download-prompt-template', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'download', 'prompt-templates.zip');

  res.download(filePath, 'prompt-templates.zip', (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).send('Error downloading file');
    }
  });
});

//Download barcode for pdf - v1.1.0 added
router.get('/proxy-barcode', async (req, res) => {
  try {

    await new Promise(r => setTimeout(r, 500)); // delay 

    const barcodeUrl = req.query.url;
    const response = await fetch(barcodeUrl);
    const buffer = await response.arrayBuffer();

    res.set('Content-Type', response.headers.get('content-type'));
    res.set('Access-Control-Allow-Origin', '*');
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).send('Error fetching barcode');
  }
});

// Generate EAN13 barcode - v1.1.0
router.get('/barcode/ean13', async (req, res) => {
  try {
    const { data } = req.query;

    if (!data) {
      return res.status(400).json({ error: 'Barcode data is required' });
    }

    // Validate EAN13 format (12 or 13 digits)
    if (!/^\d{12,13}$/.test(data)) {
      return res.status(400).json({ error: 'EAN13 must be 12 or 13 digits' });
    }

    // Generate barcode
    const png = await bwipjs.toBuffer({
      bcid: 'ean13',           // Barcode type
      text: data,              // Data to encode
      scale: 3,                // 3x scaling factor
      height: 10,              // Bar height, in millimeters
      includetext: true,       // Show human-readable text
      textxalign: 'center',    // Center the text
    });

    res.setHeader('Content-Type', 'image/png');
    res.send(png);

  } catch (error) {
    console.error('Barcode generation error:', error);
    res.status(500).json({ error: 'Failed to generate barcode', message: error.message });
  }
});


// Generate EAN13 barcode support svg - v1.1.0
router.get('/barcode/ean13/svg', async (req, res) => {
  try {
    const { data } = req.query;

    if (!data || !/^\d{12,13}$/.test(data)) {
      return res.status(400).json({ error: 'Invalid EAN13 data' });
    }

    const svg = bwipjs.toSVG({
      bcid: 'ean13',
      text: data,
      scale: 3,
      height: 10,
      includetext: true,
    });

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);

  } catch (error) {
    res.status(500).json({ error: 'Failed to generate barcode' });
  }
});

// Helper function to check if Ollama is available - v1.1.0
async function checkOllamaAvailability() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for health check
    const response = await fetch(`${process.env.OLLAMA_API}/tags`, {
      method: 'GET',
      headers: process.env.OLLAMA_API_KEY ? { 'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}` } : {},
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Ollama availability check failed:', error.message);
    return false;
  }
}

// Prompt Dialog - create report template
router.post('/generate-report-template', verifyToken, async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt' });
    }

    const wordCount = prompt.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 5000) {
      return res.status(400).json({ error: 'Prompt exceeds 5000 words limit' });
    }

    if (wordCount === 0) {
      return res.status(400).json({ error: 'Prompt cannot be empty' });
    }

    // Check if API key is configured
    if (!process.env.OLLAMA_API_KEY) {
      console.error('OLLAMA_API_KEY not configured');
      return res.status(500).json({
        error: 'Ollama API key not configured',
        message: 'Please configure OLLAMA_API_KEY in your environment variables'
      });
    }

    // Check Ollama availability
    console.log('Checking Ollama cloud availability...');
    const isAvailable = await checkOllamaAvailability();

    if (!isAvailable) {
      console.error('Ollama cloud is not available or not responding');
      return res.status(503).json({
        error: 'Ollama cloud service is not available',
        message: 'The AI service is currently unavailable. Please check your API key and try again later.'
      });
    }

    const filePathMD = path.join(__dirname, 'public', 'download', 'Prompt-General.md');
    const rptTemplate = await readMarkdownFileAsync(filePathMD);

    // Prepare system prompt for JSX generation
    const systemPrompt = `You are a React JSX template generator for a storage management system.

CRITICAL RULES - VIOLATION WILL RESULT IN REJECTION:
1. ONLY use CommonJS: require() and module.exports (NO ES6 import/export)
2. NEVER require Node.js dangerous modules: fs, child_process, os, process, vm, net, http, https, path
3. NEVER use: eval(), new Function(), dangerouslySetInnerHTML
4. NEVER use: localStorage, sessionStorage, indexedDB
5. Start with: const React = require('react');
6. End with: module.exports = ComponentName;
7. Use inline styles with style objects
8. All API calls must be relative: fetch('/api/...')

ALLOWED REQUIRES:
✅ const React = require('react');
✅ const { useState } = require('react');

FORBIDDEN REQUIRES:
❌ require('fs') or require('fs/promises')
❌ require('child_process')
❌ require('os') or require('path')
❌ require('vm') or require('net')

OUTPUT FORMAT:
- Pure CommonJS JSX code only
- No markdown code blocks
- No explanatory comments
- Start with require() statements
- End with module.exports

Generate a complete, working React component using CommonJS now.`;

    const userPrompt = `${prompt}

${rptTemplate}
Remember: Output ONLY the JSX code, nothing else.`;

    // Call Ollama Cloud API
    console.log(`Calling Ollama cloud with model: ${process.env.OLLAMA_MODEL}...`);

    // Timeout for Ollama requests (60 seconds)
    const OLLAMA_TIMEOUT = 5 * 60 * 1000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT);

    let ollamaResponse;
    try {
       ollamaResponse = await fetch(`${process.env.OLLAMA_API}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL,
          prompt: `${systemPrompt}\n\nUser Request:\n${userPrompt}`,
          stream: false,
          options: {
            temperature: 0.5,
            top_p: 0.9,
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        console.error('Ollama request timed out');
        return res.status(504).json({
          error: 'Request timed out',
          message: 'The AI service took too long to respond. Please try with a simpler prompt.'
        });
      }

      throw fetchError;
    }

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error('Ollama API error:', ollamaResponse.status, errorText);

      if (ollamaResponse.status === 401) {
        return res.status(401).json({
          error: 'Invalid API key',
          message: 'Your Ollama API key is invalid or expired. Please check your configuration.'
        });
      }

      if (ollamaResponse.status === 404) {
        return res.status(404).json({
          error: 'Model not found',
          message: `The model "${process.env.OLLAMA_MODEL}" is not available. Please check your model configuration.`
        });
      }

      return res.status(ollamaResponse.status).json({
        error: 'Ollama API request failed',
        message: `Failed to generate template: ${errorText.substring(0, 200)}`
      });
    }

    const ollamaData = await ollamaResponse.json();

    if (!ollamaData.response) {
      console.error('Invalid Ollama response:', ollamaData);
      return res.status(500).json({
        error: 'Invalid response from AI',
        message: 'The AI service returned an unexpected response format.'
      });
    }

    let jsxCode = ollamaData.response;

    // Clean up the response - remove markdown code blocks if present
    jsxCode = jsxCode
      .replace(/```jsx?\n?/g, '')
      .replace(/```\n?$/g, '')
      .replace(/```/g, '')
      .trim();

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedPrompt = prompt
      .substring(0, 30)
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();

    const filename = `ai-${sanitizedPrompt}-${timestamp}.jsx`;
    const templatesDir = path.join(__dirname, 'templates');
    const filePath = path.join(templatesDir, filename);

    // Ensure templates directory exists
    await fs.mkdir(templatesDir, { recursive: true });

    // Save the file
    await fs.writeFile(filePath, jsxCode, 'utf8');


    //Checking : begin
    // 2nd layer checking
    console.log('Running security check...');

    const fileContent = await fs.readFile(filePath, 'utf8');
    const dangerousPatterns = checkForDangerousCode(fileContent);
    const securityCheck2 = checkForDangerousCodeEx(fileContent);

    //console.log(dangerousPatterns, securityCheck2, dangerousPatterns.length, securityCheck2.length);

    if (dangerousPatterns.length > 0 || securityCheck2.length > 0) {
      // Delete the uploaded file
      await fs.unlink(filePath);

      // Flatten the examples from all findings into a single list for the details array
      const allExamples = dangerousPatterns.flatMap(p => p.examples);

      return res.status(400).json({
        error: 'Generated code contains dangerous patterns',
        message: 'The AI generated code that doesn\'t meet security requirements. Please try a different prompt.',
        details: dangerousPatterns.map(p => `${p.name} [${p.severity}]: ${p.examples[0]}`).slice(0, 5)
      });
    }
    //Checking :: end

    console.log(`✅ Template saved successfully: ${filename}`);

    res.json({
      success: true,
      filename,
      path: filePath,
      message: 'Template generated and saved successfully'
    });

  } catch (error) {
    console.error('❌ Error generating template:', error);

    // Handle specific error types
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Cannot connect to Ollama cloud',
        message: 'Unable to reach the AI service. Please check your internet connection and API configuration.'
      });
    }

    if (error.code === 'ENOTFOUND') {
      return res.status(503).json({
        error: 'Ollama cloud host not found',
        message: 'Cannot resolve the Ollama cloud service. Please check your OLLAMA_API configuration.'
      });
    }

    res.status(500).json({
      error: 'Failed to generate template',
      message: error.message || 'An unexpected error occurred. Please try again.'
    });
  }
});

// Optional: Health check endpoint
router.get('/ollama/health', async (req, res) => {
  try {
    const isAvailable = await checkOllamaAvailability();

    res.json({
      available: isAvailable,
      api: process.env.OLLAMA_API,
      model: process.env.OLLAMA_MODEL,
      hasApiKey: !!process.env.OLLAMA_API_KEY
    });
  } catch (error) {
    res.status(500).json({
      available: false,
      error: error.message
    });
  }
});

// Prepare Error message page and allow res.send to render the error page
function prepareErrPg(errCode, errMsg) {
  return `<html><body><script>window.location.href='/api/error/${errCode}/${errMsg}';</script></body></html>`;
}

// Helper function to format template name to title
function formatTitle(name) {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Sample data for testing
function getSampleData() {
  return {
    boxes: [
      { name: 'Hugo冬天衫 (1)', utilization: 100, status: 'Check-In, full', location: 'Hugo bedroom (衣櫃頂)' },
      { name: 'Thomas冬天睡衣', utilization: 100, status: 'Check-In, full', location: 'Hugo bedroom (衣櫃頂)' },
      { name: '花花壓縮袋Thomas冬天衫', utilization: 50, status: 'Check-In, 50% occupied', location: '主人房床下底' },
      { name: 'Blue Bag', utilization: 25, status: 'Check-In, 25% occupied', location: '廳白色長形存物架' }
    ],
    summary: {
      total: 51,
      full: 40,
      partial: 10,
      avgUtilization: 89.7
    }
  };
}

/*********************************************************************************************************************** 
* report template file management 
********************************************************************************************************************** */

// File list
router.get('/files', verifyToken, async (req, res) => {
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    const fileDetails = await Promise.all(
      files
        .filter(f => f.endsWith('.jsx'))
        .map(async (file) => {
          const filepath = path.join(UPLOAD_DIR, file);
          const stats = await fs.stat(filepath);
          return {
            name: file,
            size: stats.size,
            date: stats.mtime
          };
        })
    );
    res.json(fileDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Upload file 
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  // if (!req.file) {
  //   return res.status(400).json({ error: 'No file uploaded' });
  // }
  // res.json({ 
  //   message: 'File uploaded successfully',
  //   filename: req.file.filename 
  // });

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filepath = path.join(UPLOAD_DIR, req.file.filename);

    // Read file content and check for dangerous code
    const fileContent = await fs.readFile(filepath, 'utf8');
    const dangerousPatterns = checkForDangerousCode(fileContent);

    if (dangerousPatterns.length > 0) {
      // Delete the uploaded file
      await fs.unlink(filepath);

      // Flatten the examples from all findings into a single list for the details array
      const allExamples = dangerousPatterns.flatMap(p => p.examples);

      return res.status(400).json({
        error: 'File contains potentially dangerous code and has been rejected (From backend)',
        // Update: Map through findings to show the Name and the Severity
        details: dangerousPatterns.map(p => `${p.name} [${p.severity}]: ${p.examples[0]}`).slice(0, 5)
      });
    }

    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename
    });
  } catch (err) {
    // Try to clean up file if it exists
    if (req.file) {
      try {
        await fs.unlink(path.join(UPLOAD_DIR, req.file.filename));
      } catch { }
    }
    res.status(500).json({ error: err.message });
  }
});

// Delete file 
router.delete('/files', verifyToken, async (req, res) => {
  try {
    const { files } = req.body;
    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    await Promise.all(
      files.map(file =>
        fs.unlink(path.join(UPLOAD_DIR, file))
      )
    );

    res.json({ message: 'Files deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rename file
router.put('/rename', verifyToken, async (req, res) => {
  try {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
      return res.status(400).json({ error: 'Old name and new name are required' });
    }

    if (!newName.endsWith('.jsx')) {
      return res.status(400).json({ error: 'File must have .jsx extension' });
    }

    const oldPath = path.join(UPLOAD_DIR, oldName);
    const newPath = path.join(UPLOAD_DIR, newName);

    // Check if old file exists
    if (!await fileExists(oldPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if new name already exists
    if (await fileExists(newPath)) {
      return res.status(409).json({ error: 'A file with this name already exists' });
    }

    await fs.rename(oldPath, newPath);
    res.json({ message: 'File renamed successfully', newName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Download file
router.get('/download/:filename', verifyToken, async (req, res) => {
  try {
    const filename = req.params.filename;

    if (!filename.endsWith('.jsx')) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    const filepath = path.join(UPLOAD_DIR, filename);

    // Check if file exists
    if (!await fileExists(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/javascript');

    // Send file
    res.sendFile(filepath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

