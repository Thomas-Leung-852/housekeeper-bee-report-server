// ─── AI Engine Adapter ────────────────────────────────────────────────────────
// Drop into:  services/ai-engine.js
//
// Supports three backends, selected by AI_ENGINE in .env:
//   ollama_cloud  – remote Ollama API (Bearer token)
//   ollama_local  – local Ollama on the same machine (no auth)
//   ai_processor  – remote AI Processor server (this project)
//
// All backends return: { response: string }
// so existing code that reads ollamaData.response needs zero changes.
// ─────────────────────────────────────────────────────────────────────────────

import dotenv from 'dotenv';
import { Agent, fetch } from 'undici';

dotenv.config();

// ── Custom undici agent with long timeouts ────────────────────────────────────
// Node's built-in fetch (undici) has a default headersTimeout of ~30 seconds.
// LLM inference can take several minutes, so we override it here.
// AI_REQUEST_TIMEOUT_MS in .env controls the ceiling (default 15 minutes).
const AI_TIMEOUT_MS = parseInt(process.env.AI_REQUEST_TIMEOUT_MS || String(15 * 60 * 1000), 10);

const longTimeoutAgent = new Agent({
  headersTimeout: AI_TIMEOUT_MS,  // wait this long for the server to send response headers
  bodyTimeout:    AI_TIMEOUT_MS,  // wait this long for the full response body
  connectTimeout: 10_000,         // 10 s to establish the TCP connection
  connect: { rejectUnauthorized: false },
});

const ENGINE = (process.env.AI_ENGINE || 'ollama_cloud_del').toLowerCase();

// ── helpers ──────────────────────────────────────────────────────────────────

function ollamaBase() {
  return (process.env.OLLAMA_API || 'http://localhost:11434').replace(/\/$/, '');
}

function processorBase() {
  return (process.env.AI_PROCESSOR_URL || 'http://localhost:3000').replace(/\/$/, '');
}

function ollamaHeaders() {
  const h = { 'Content-Type': 'application/json' };
  if (ENGINE === 'ollama_cloud' && process.env.OLLAMA_API_KEY) {
    h['Authorization'] = `Bearer ${process.env.OLLAMA_API_KEY}`;
  }
  return h;
}

function processorHeaders() {
  const h = { 'Content-Type': 'application/json', 'X-Client-Id': process.env.CLIENT_ID };
  if (process.env.AI_PROCESSOR_KEY) h['x-api-key'] = process.env.AI_PROCESSOR_KEY;
  return h;
}

// ── isConfigured() ───────────────────────────────────────────────────────────
// Replaces the OLLAMA_API_KEY guard in configRoutes.js.
// Returns true if the selected engine has the minimum env vars set.

function isConfigured() {
  console.log(`inside isConfigured: ${ENGINE}`)

  switch (ENGINE) {
    case 'ollama_cloud':
      return !!process.env.OLLAMA_API_KEY;
    case 'ollama_local':
      return true; // no key needed
    case 'ai_processor':
      return !!process.env.AI_PROCESSOR_URL;
    default:
      return false;
  }
}

// ── checkAvailability() ──────────────────────────────────────────────────────
// Replaces checkOllamaAvailability() in configRoutes.js.

async function checkAvailability() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    console.log(`${processorBase()}/health`);

    let res;
    if (ENGINE === 'ai_processor') {
      res = await fetch(`${processorBase()}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: processorHeaders(),
        dispatcher: longTimeoutAgent,
      });
    } else {
      // ollama_cloud or ollama_local — both use /api/tags
      res = await fetch(`${ollamaBase()}/api/tags`, {
        method: 'GET',
        headers: ollamaHeaders(),
        signal: controller.signal,
      });
    }

    console.log(`inside checkAvailability (ok): ${res.ok}, url: ${ollamaBase()}/api/tags`);

    clearTimeout(timeoutId);
    return res.ok;
  } catch (err) {
    
    console.log(`inside checkAvailability (error): ${err.message}, url: ${ollamaBase()}/api/tags `);

    console.error(`[ai-engine] availability check failed (${ENGINE}):`, err.message);
    return false;
  }
}

// ── generate() ───────────────────────────────────────────────────────────────
// Replaces the fetch block + ollamaResponse.ok check + .json() in configRoutes.js.
//
// @param {object} opts
//   systemPrompt  {string}
//   userPrompt    {string}
//   signal        {AbortSignal}  – pass controller.signal for timeout support
//   options       {object}       – model params (temperature, top_p …)
//
// @returns {Promise<{ response: string }>}
// @throws  Error with descriptive message on HTTP errors (401, 404, 5xx …)

async function generate({ systemPrompt = '', userPrompt = '', signal, options = {} }) {
  switch (ENGINE) {
    case 'ollama_cloud':
    case 'ollama_local':
      return _generateOllama({ systemPrompt, userPrompt, signal, options });
    case 'ai_processor':
      return _generateProcessor({ systemPrompt, userPrompt, signal, options });
    default:
      throw new Error(`Unknown AI_ENGINE value: "${ENGINE}". Use ollama_cloud, ollama_local, or ai_processor.`);
  }
}

// ── Ollama backend (cloud + local share the same /api/generate endpoint) ─────

async function _generateOllama({ systemPrompt, userPrompt, signal, options }) {
  const url = `${ollamaBase()}/api/generate`;
  const model = process.env.OLLAMA_MODEL || 'llama3.2';

  const res = await fetch(url, {
    method: 'POST',
    headers: ollamaHeaders(),
    signal,
    dispatcher: longTimeoutAgent,
    body: JSON.stringify({
      model,
      prompt: `${systemPrompt}\n\nUser Request:\n${userPrompt}`,
      stream: false,
      options: {
        temperature: parseFloat(process.env.AI_TEMPERATURE ?? '0.1'),
        top_p:       parseFloat(process.env.AI_TOP_P      ?? '0.95'),
        seed:        parseInt(process.env.AI_SEED         ?? '42', 10),
        ...options,
      },
    }),
  });

  // Mirror the same HTTP error handling that was in configRoutes.js
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[ai-engine] Ollama error ${res.status}:`, errorText);

    if (res.status === 401) {
      const err = new Error('Your Ollama API key is invalid or expired. Please check your configuration.');
      err.status = 401;
      throw err;
    }
    if (res.status === 404) {
      const err = new Error(`The model "${model}" is not available. Please check your model configuration.`);
      err.status = 404;
      throw err;
    }
    const err = new Error(`Failed to generate template: ${errorText.substring(0, 200)}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();

  // Return in the same shape the existing code expects
  return { response: data.response ?? '' };
}

// ── AI Processor backend ──────────────────────────────────────────────────────

async function _generateProcessor({ systemPrompt, userPrompt, signal, options }) {
  const url = `${processorBase()}/process/batch`;
  const mode = process.env.AI_PROCESSOR_MODE || 'coder'; // coder is best for JSX

  const res = await fetch(url, {
    method: 'POST',
    headers: processorHeaders(),
    signal,
    dispatcher: longTimeoutAgent,
    body: JSON.stringify({
      mode,
      systemPrompt,
      userPrompt,
      options: {
        temperature: parseFloat(process.env.AI_TEMPERATURE ?? '0.1'),           // low randomness, consistent output
        top_p:       parseFloat(process.env.AI_TOP_P      ?? '0.95'),           // nucleus sampling, filters unlikely tokens
        top_k:       parseInt(process.env.AI_TOP_K      ?? '40', 10),           // model only picks from top 10-20 most likely tokens = more deterministic, faster, less "creative" wandering
        seed:        parseInt(process.env.AI_SEED         ?? '42', 10),         // reproducible output across runs
        num_ctx:     parseInt(process.env.AI_CONTEXT_WINDOW ?? '4096', 10),     //16GB system RAN can try 16384
        num_predict: parseInt(process.env.AI_NUM_PREDICT ?? '-1', 10),          // output token limit. JSX report rarely needs more than 3,000 output tokens. Ollama default 1.1
        repeat_penalty: parseFloat(process.env.AI_REPEAT_PENALTY ?? '1.1'),     // softer penalty, better for repetitive code patterns. default 1.1
        ...options,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[ai-engine] AI Processor error ${res.status}:`, errorText);

    if (res.status === 401) {
      const err = new Error('AI Processor API key is invalid. Please check AI_PROCESSOR_KEY.');
      err.status = 401;
      throw err;
    }
    const err = new Error(`AI Processor request failed: ${errorText.substring(0, 200)}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();

  // Processor returns { jobId, result } — normalise to { response }
  return { response: data.result ?? '' };
}

// ── exports ───────────────────────────────────────────────────────────────────

export const aiEngine = { isConfigured, checkAvailability, generate };
