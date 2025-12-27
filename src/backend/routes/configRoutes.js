import express from 'express';
import { renderReport, listTemplates } from '../services/templateLoader.js';
import { fetchData } from  '../services/dataFetcher.js';
// import axios from 'axios';
// import https from 'https';
// import { ok } from 'assert';

const router = express.Router();

// Get housekeeper bee session token
// router.get('/housekeeper_bee/session_token', (req, res) => {
//   return {'session_token': 'aa-bb-cc-dd'};
// });

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
    res.json({ 
      success: true,
      reports: templates.map(name => ({
        name,
        title: formatTitle(name),
        url: `/api/reports/render/${name}`
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

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
    if(error.message.includes('(Error Code:9999)')){
      res.send(prepareErrPg('9060', 'No Records'));
    }else{
      res.send(prepareErrPg('9050', 'Session Expired. Please login from Housekeeper Bee again.' + error));
    }
 
  }
});

// Prepare Error message page and allow res.send to render the error page
function prepareErrPg(errCode, errMsg){
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

export default router;

