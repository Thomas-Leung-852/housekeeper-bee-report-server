// ─── POST /api/invert-template ────────────────────────────────────────────────
// Reads a JSX report template, runs a two-stage AI chain, and returns
// { title, description, reconstructed_prompt } in plain business English.
//
// Stage 1 (thinking model): Analyse the stripped JSX to understand what the
//          report shows — fields displayed, groupings, calculations, layout.
//          Skipped when a "User Prompt:" comment block is already present.
// Stage 2 (default model): Turn the Stage 1 analysis into a natural-language
//          prompt a business user would have typed (max 200 words, no jargon).
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { aiEngine } from '../services/ai-engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

const UPLOAD_DIR = path.join(
  __dirname,
  process.env.HOUSEKEEPER_BEE_REPORT_TEMPLATE_FOLDER || 'templates'
);

const router = express.Router();

// ── Session token guard (same as generate-report-template) ────────────────────
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || token === 'Bearer') {
    return res.status(401).json({ error: 'Invalid Session Token.' });
  }
  next();
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Extract the saved user prompt from the comment block at the top of the file.
 * Handles both formats found in existing templates:
 *   /*  * User Prompt: ...  * Generated: ... * /
 *   /** AI Assistant: ... * /   ← older style (no "User Prompt:" key)
 * Returns the prompt string, or null if not found.
 */
function extractSavedPrompt(jsxCode) {
  // Format 1: /* * User Prompt: <text> \n * Generated: ... */
  const match1 = jsxCode.match(/\/\*[\s\S]*?\*\s+User Prompt:\s*([\s\S]*?)(?:\n\s*\*\s+Generated:|\*\/)/);
  if (match1) {
    return match1[1].trim();
  }
  return null;
}

/**
 * Strip the JSX down to a skeleton that reveals intent without overwhelming
 * the AI with inline styles and DOM-manipulation scripts.
 * Keeps: component name, data field accesses, column headers, helper function
 *        names and bodies (item counting, status parsing), report title strings.
 * Strips: style={{ ... }} objects, dangerouslySetInnerHTML blocks, long
 *         React.createElement chains for chart rendering.
 */
function stripJsxForAnalysis(jsxCode) {
  let stripped = jsxCode;

  // Remove inline style objects — style={{ ... }}  (handles nested braces)
  // Replace with a placeholder so structure stays readable
  stripped = stripped.replace(/\bstyle=\{\{[\s\S]*?\}\}/g, 'style={{...}}');

  // Remove dangerouslySetInnerHTML blocks (sorting/filtering scripts)
  stripped = stripped.replace(/dangerouslySetInnerHTML=\{\{[\s\S]*?\}\}/g, '/* [interactive script removed] */');

  // Remove long React.createElement chains (chart face elements) — keep first 40 chars of each call
  // We identify chains by counting repeated createElement calls for 'front','top','right' faces
  stripped = stripped.replace(
    /React\.createElement\('div',\s*\{\s*key:\s*'(front|top|right|bar)'[\s\S]*?\}\)/g,
    "/* [chart face element removed] */"
  );

  // Collapse consecutive blank lines
  stripped = stripped.replace(/\n{3,}/g, '\n\n');

  // Hard cap: if still over 6000 chars, truncate with a note
  if (stripped.length > 6000) {
    stripped = stripped.substring(0, 6000) + '\n\n/* ... [truncated for analysis] */';
  }

  return stripped;
}

// ── Route ─────────────────────────────────────────────────────────────────────

router.post('/invert-template', verifyToken, async (req, res) => {
  // Language display names for injection into the Stage 2 prompt
  const LANGUAGE_NAMES = {
    'en':    'English',
    'zh-CN': 'Simplified Chinese (简体中文)',
    'zh-TW': 'Traditional Chinese (繁體中文)',
    'yue':   'Cantonese (廣東話)',
    'ja':    'Japanese (日本語)',
    'es':    'Spanish (Español)',
  };

  try {
    const { file_name, output_language } = req.body;

    // Resolve output language — default to English if not provided or unrecognised
    const resolvedLanguage = LANGUAGE_NAMES[output_language] || LANGUAGE_NAMES['en'];

    if (!file_name || typeof file_name !== 'string' || !file_name.endsWith('.jsx')) {
      return res.status(400).json({ error: 'A valid .jsx file name is required.' });
    }

    // Security: prevent path traversal
    const safeName = path.basename(file_name);
    const filePath = path.join(UPLOAD_DIR, safeName);

    let jsxCode;
    try {
      jsxCode = await fs.readFile(filePath, 'utf8');
    } catch {
      return res.status(404).json({ error: 'Report file not found.' });
    }

    if (!aiEngine.isConfigured()) {
      return res.status(500).json({ error: 'AI service is not set up. Please check the server configuration.' });
    }

    const isAvailable = await aiEngine.checkAvailability();
    if (!isAvailable) {
      return res.status(503).json({ error: 'AI service is currently unavailable. Please try again later.' });
    }

    // ── Shortcut: saved prompt already in comment block ───────────────────────
    const savedPrompt = extractSavedPrompt(jsxCode);

    let stage1Analysis;

    if (savedPrompt) {
      // Skip AI Stage 1 — use the saved prompt as the analysis input
      console.log('[invert-template] Found saved prompt comment — skipping Stage 1');
      stage1Analysis = `The original prompt used to create this report was:\n"${savedPrompt}"`;
    } else {
      // ── Stage 1: Thinking model analyses the stripped JSX ──────────────────
      console.log('[invert-template] No saved prompt — running Stage 1 analysis');

      const stripped = stripJsxForAnalysis(jsxCode);

      const stage1System = `You are an expert at reading React JSX report components and understanding their business purpose.
Analyse the provided JSX code and describe:
1. What data fields are displayed (use plain business names, not code variable names)
2. How the data is grouped or summarised (by location, by tag, totals, etc.)
3. What calculations or counts are performed
4. The overall layout (table, cards, chart, mixed)
5. The apparent business purpose of the report

Be concise. Use plain language a non-technical manager would understand.
Do NOT mention React, JSX, props, state, or any programming concepts.
Output a structured plain-English description only.`;

      const stage1User = `Analyse this report template and describe what it shows:\n\n${stripped}`;

      const AI_TIMEOUT = parseInt(process.env.AI_REQUEST_TIMEOUT_MS || String(15 * 60 * 1000), 10);
      const ctrl1 = new AbortController();
      const t1 = setTimeout(() => ctrl1.abort(), AI_TIMEOUT);

      let stage1Result;
      try {
        stage1Result = await aiEngine.generate({
          systemPrompt: stage1System,
          userPrompt: stage1User,
          signal: ctrl1.signal,
          processorMode: 'thinking',   // always use thinking model for analysis
        });
        clearTimeout(t1);
      } catch (err) {
        clearTimeout(t1);
        if (err.name === 'AbortError') {
          return res.status(504).json({ error: 'The request took too long. Please try again.' });
        }
        throw err;
      }

      stage1Analysis = stage1Result.response?.trim() || '';
      if (!stage1Analysis) {
        return res.status(500).json({ error: 'Could not read this report. Please try again.' });
      }
    }

    // ── Stage 2: Default model synthesises a natural-language prompt ──────────
    console.log('[invert-template] Running Stage 2 synthesis');

    const stage2System = `You are a helpful assistant that writes simple, clear instructions for business users.
Given a description of what a storage inventory report shows, write a prompt that a non-technical
business user could type to ask an AI to create that report.

Rules:
- Maximum 200 words
- Use plain everyday language — no programming terms, no field names like storageCode or withNFC
- Instead of field names, use plain descriptions: "storage box name", "location", "barcode", "NFC tag", "iBeacon"
- Write it as a natural request, as if the user is explaining what they want to see
- Do not mention React, JSX, components, or any technical concepts
- Do not include phrases like "Create a JSX component" — just describe the report content
- Output THREE sections separated by the exact labels below, nothing else:

TITLE:
<a short name for this report, 2-6 words>

DESCRIPTION:
<one or two sentences describing what this report is for, in plain English>

PROMPT:
<the natural-language prompt, max 200 words>

LANGUAGE INSTRUCTION (mandatory, overrides everything else):
- Write the ENTIRE response — TITLE, DESCRIPTION, and PROMPT — in ${resolvedLanguage}.
- Do not mix languages. Do not add any text outside the three sections above.`;

    const stage2User = `Based on the following analysis, write the TITLE, DESCRIPTION, and PROMPT:\n\n${stage1Analysis}`;

    const AI_TIMEOUT2 = parseInt(process.env.AI_REQUEST_TIMEOUT_MS || String(15 * 60 * 1000), 10);
    const ctrl2 = new AbortController();
    const t2 = setTimeout(() => ctrl2.abort(), AI_TIMEOUT2);

    let stage2Result;
    try {
      stage2Result = await aiEngine.generate({
        systemPrompt: stage2System,
        userPrompt: stage2User,
        signal: ctrl2.signal,
        processorMode: 'default',   // default model is enough for synthesis
      });
      clearTimeout(t2);
    } catch (err) {
      clearTimeout(t2);
      if (err.name === 'AbortError') {
        return res.status(504).json({ error: 'The request took too long. Please try again.' });
      }
      throw err;
    }

    const raw = stage2Result.response?.trim() || '';
    if (!raw) {
      return res.status(500).json({ error: 'Could not understand this report. Please try again.' });
    }

    // ── Parse the structured output ───────────────────────────────────────────
    const titleMatch   = raw.match(/TITLE:\s*([\s\S]*?)(?=DESCRIPTION:|$)/i);
    const descMatch    = raw.match(/DESCRIPTION:\s*([\s\S]*?)(?=PROMPT:|$)/i);
    const promptMatch  = raw.match(/PROMPT:\s*([\s\S]*?)(?=LANGUAGE INSTRUCTION:|$)/i);

    const title       = (titleMatch?.[1]  || '').trim() || safeName.replace(/\.jsx$/, '').replace(/-/g, ' ');
    const description = (descMatch?.[1]   || '').trim() || 'A storage inventory report.';
    const reconstructed_prompt = (promptMatch?.[1] || '').trim() || raw;

    console.log(`[invert-template] Done — title: "${title}"`);

    res.json({
      success: true,
      title,
      description,
      reconstructed_prompt,
      // Stage 1 analysis returned for demo/transparency — not used in report creation
      stage1_analysis: stage1Analysis,
    });

  } catch (error) {
    console.error('[invert-template] Error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

export default router;
