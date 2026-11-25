# Why Does the Same Prompt Give Different Results? — Optimization Guide

← [Back to README](./README.md)

This guide explains why the same prompt produces different outputs when running `gpt-oss:20b` locally via Ollama versus using `gpt-oss:20b-cloud` on Ollama's official cloud — even though it is the **exact same underlying model**.

It also documents the optimization tactics discovered during real-world JSX report generation, so you can apply them to your own local AI setup.

<br>

# Root Causes of Output Differences

| # | Root Cause | 🖥️ Ollama Local (`gpt-oss:20b`) | ☁️ Ollama Cloud (`gpt-oss:20b-cloud`) | Impact on Output |
|---|---|---|---|---|
| **1** | **Quantization** | Compressed (Q4_K_M / Q5_K_M) — reduced numerical precision | Full precision (FP16 / BF16) | 🔴 High — different token probabilities, different word choices |
| **2** | **Context Window Truncation** | Default 2048–4096 tokens; long prompts are **silently cut** | Up to 128k tokens; full prompt preserved | 🔴 High — missing context = missing instructions = wrong output |
| **3** | **Sampling Parameters** | Defaults set in local Modelfile (`temperature`, `top_p`, `top_k`) | Defaults set by cloud provider — often different values | 🟡 Medium — affects creativity, randomness, and determinism |
| **4** | **Hidden System Prompt** | None by default (blank slate) | Cloud provider may inject a hidden system prompt | 🟡 Medium — changes model persona and behaviour |
| **5** | **Model Version / GGUF** | Depends on when you ran `ollama pull` — may be outdated | Provider always serves latest version | 🟡 Medium — minor weight differences across releases |
| **6** | **MoE Expert Routing** | Affected by quantization precision — experts selected slightly differently | Full precision routing | 🟠 Low–Medium — subtle but compounds with other factors |
| **7** | **Hardware / Compute** | CPU inference may accumulate floating-point rounding errors | Optimised GPU clusters (A100 / H100) | 🟠 Low — minor but non-zero effect |

<br>

# The Biggest Culprits Explained

### 1. 🗜️ Quantization — The #1 Cause
When you run `gpt-oss:20b` locally, Ollama downloads a **quantized (compressed) GGUF** version to fit in consumer RAM/VRAM. Quantization reduces each weight from 16-bit float to ~4-bit integer.

```
FP16 (cloud):   0.182374...   ← high precision
Q4_K_M (local): 0.1875        ← rounded, slightly different
```

Over billions of weights and tokens, these tiny rounding differences **compound** — the model samples a different token, which shifts the entire generation in a different direction. The model is the same, but the numbers running inside it are not.

### 2. ✂️ Context Window Truncation — The Silent Killer
Local Ollama default context is **2048 tokens**. If your prompt + history exceeds this, **the beginning is silently dropped** — no warning, no error.

```
Your prompt (3000 tokens):
[... first 952 tokens DROPPED ✂️ ...] ← local never sees this
"...please follow the rules above and respond in JSX format"  ← cloud sees all of it
```

This is especially critical for the report server prompts, which are long and contain important rules (see the `Docs` folder). If your local model ignores your JSX rules, context truncation is very likely the cause.

### 3. 🎲 Sampling Parameters — Hidden Defaults
Different `temperature`, `top_p`, `top_k` values produce different outputs even from identical weights:

| Parameter | Ollama Local Default | Report Server `.env` Recommended |
|---|---|---|
| `temperature` | 0.8 | **0.1** (very deterministic) |
| `top_p` | 0.9 | **0.95** |
| `top_k` | 40 | **20** (faster + more deterministic for code) |
| `seed` | random | **42** (fixed — reproducible) |
| `num_predict` | -1 (unlimited) | **4096** (prevents endless generation) |
| `repeat_penalty` | 1.1 | **1.05** (better for repetitive code patterns) |

The report server sets these in the `.env` — this makes output highly deterministic and consistent, which is ideal for structured JSX code generation.

### 4. 🕵️ Hidden System Prompt (Cloud)
Cloud providers often prepend a system prompt you never see:
```
"You are a helpful assistant. Be concise. Follow instructions carefully..."
```
This subtly shifts tone, verbosity, and instruction-following behaviour compared to your local instance, which starts with a completely blank slate.

<br>

# Sampling Parameters Explained

Understanding what each parameter does helps you tune for your specific task:

| Parameter | What it does | For JSX generation |
|---|---|---|
| `temperature` | Controls randomness. Lower = more predictable | **0.1** — consistent, deterministic code |
| `top_p` | Nucleus sampling — filters out unlikely tokens | **0.95** — balanced |
| `top_k` | Only pick from top K most likely tokens | **20** — reduces wandering, faster |
| `seed` | Fixed random seed for reproducible output | **42** — same prompt = same output |
| `num_predict` | Maximum output tokens (-1 = unlimited) | **4096** — stops model running endlessly |
| `repeat_penalty` | Penalises repeating tokens already generated | **1.05** — softer penalty, code repeats naturally (brackets, style objects) |

> 💡 **Tactic learned:** Setting `num_predict: 4096` instead of the default `-1` (unlimited) reduced average generation time by ~2 minutes on a 32GB RAM CPU-only setup. The model was generating past the end of valid JSX output because nothing told it to stop.

<br>

# How to Minimise the Differences

| Fix | What to Do |
|---|---|
| **Increase context window** | Set `num_ctx` to 16384 in your local Modelfile |
| **Match temperature** | Set `temperature 0.1` to match the report server `.env` default |
| **Match sampling params** | Set `top_p 0.95`, `top_k 20`, `seed 42`, `repeat_penalty 1.05` |
| **Limit output tokens** | Set `num_predict 4096` to prevent endless generation |
| **Enable Flash Attention** | Set `OLLAMA_FLASH_ATTENTION=1` env var — free CPU speed boost |
| **Use higher quantization** | Pull `Q8_0` if your hardware allows — closer to FP16 precision |
| **Add a system prompt locally** | Mirror the cloud provider's system prompt behaviour |
| **Pin model version** | Use a specific GGUF tag, don't rely on `latest` |
| **Use a coder model** | `qwen2.5-coder:14b` outperforms general models for JSX generation |

### Example: Modelfile for Closer-to-Cloud Behaviour

Create a custom `Modelfile` to standardise your local setup:

```
FROM qwen2.5-coder:14b

PARAMETER num_ctx       16384
PARAMETER temperature   0.1
PARAMETER top_p         0.95
PARAMETER top_k         20
PARAMETER seed          42
PARAMETER num_predict   4096
PARAMETER repeat_penalty 1.05

SYSTEM "You are a helpful assistant. Follow instructions carefully and generate valid JSX components in CommonJS format."
```

Then build and run:
```bash
ollama create qwen-coder-report -f Modelfile
ollama run qwen-coder-report
```

<br>

# LLM Chaining — Improving Prompt Quality

A key tactic for improving JSX report quality without changing the model is **LLM chaining** — using multiple model calls in sequence, where each pass refines the previous output.

```
Pass 1 (thinking model): Read JSX → extract business intent → generate plain English prompt
        ↓
Pass 2 (small fast model): Verify language → remove technical terms → clean up
        ↓
Final: High quality plain English prompt → fed to coder model → better JSX output
```

### Why this improves report creation time and UI/UX accuracy

| Without chaining | With chaining |
|---|---|
| User writes vague prompt | User gets pre-extracted precise prompt |
| Coder model guesses intent | Coder model follows clear instructions |
| More retries, more timeouts | First-time success rate improves |
| Inconsistent layout | Consistent sections and charts |

### Recommended chain configuration (32GB RAM, CPU only)

```json
{
  "reverseEngineer": {
    "generateModel": "thinking",
    "verifyModel":   "default",
    "distilModel":   "default",
    "refinePasses":  1
  }
}
```

| Pass | Model | Role | Typical time |
|---|---|---|---|
| Pass 1 | thinking (deepseek-r1:14b) | Deep analysis of JSX source | ~3 min |
| Pass 2 | default (llama3.2:3b) | Language cleanup, rule check | ~15 sec |
| Total | | | ~3 min |

> 💡 **Tactic learned:** Using `thinking` model only for Pass 1 (the hard analysis) and `default` model for Pass 2 (simple cleanup) gives 80% of the quality of a full 3-pass chain at 40% of the time cost.

### Pass configuration options

| `refinePasses` | Pipeline | Quality | Time |
|---|---|---|---|
| `0` | Generate only | Good | ~3 min |
| `1` | Generate → Verify | Better | ~3 min 15 sec ✅ recommended |
| `2` | Generate → Verify → Distil | Best | ~10 min |

<br>

# Hardware Reality Check — CPU-Only Setup

If you are running on CPU only (no GPU), here is what to expect:

| Model | RAM needed (Q4) | JSX generation time | Verdict |
|---|---|---|---|
| llama3.2:3b | ~2GB | ~1 min | Too small for complex JSX |
| qwen2.5-coder:14b | ~9GB | ~5–8 min | ✅ Best for CPU-only |
| deepseek-r1:14b | ~9GB | ~3 min | ✅ Best for analysis/thinking |
| qwen2.5-coder:32b | ~20GB | ~15–20 min | Fits 32GB RAM, slow on CPU |
| Any 70B model | ~40GB | ❌ | Does not fit 32GB RAM |

> 💡 **Honest assessment:** 20 minutes generation time on CPU-only is close to the hardware limit. All the tuning above (Flash Attention, `num_predict`, `top_k`, `repeat_penalty`, LLM chaining) can save 2–5 minutes total. The only step-change improvement is adding a GPU — even a used RTX 3060 12GB (~$250) reduces generation time from 20 minutes to under 1 minute.

<br>

# Quick Reference

| Factor | 🖥️ Ollama Local | ☁️ Ollama Cloud |
|---|---|---|
| **Model** | `qwen2.5-coder:14b` | `gpt-oss:20b-cloud` |
| **Weight precision** | Quantized (Q4/Q5) | Full precision (FP16) |
| **Context window** | 16384 (configured) | Up to 128k |
| **Sampling defaults** | Modelfile-defined | Provider-defined |
| **System prompt** | Configured via Modelfile | Often injected |
| **Model version** | Pinned to last `pull` | Always latest |
| **JSX code quality** | Good for simple templates | Better for complex templates |
| **Output determinism** | High (with seed=42) | Higher |
| **Cost** | ~$0 (electricity only) | Pay-as-you-go or subscription |

> 📝 **Note:** Ollama Cloud is no longer free as of November 2026. The free tier (including the Starter plan) has been removed and replaced with pay-as-you-go and subscription plans. Please review [Ollama's pricing page](https://ollama.com/pricing) before use.

<br>

# Recommendation for Report Server Use

For generating complex JSX report templates locally, we recommend:

1. Use **`qwen2.5-coder:14b`** as your coder model — purpose-built for code, outperforms general models
2. Always set **`num_ctx: 16384`** to avoid silent prompt truncation
3. Always set **`num_predict: 4096`** to prevent endless generation and save time
4. Set **`temperature: 0.1`**, **`top_k: 20`**, **`seed: 42`**, **`repeat_penalty: 1.05`**
5. Enable **`OLLAMA_FLASH_ATTENTION=1`** — free CPU speed improvement
6. Use **LLM chaining** (`refinePasses: 1`) to improve prompt quality before report generation
7. After generating locally, always review the [Known Issues](./README.md#known-issues) section — local quantized models are more likely to produce the common JSX formatting errors listed there

<br>

### Disclaimer
Benchmark figures and default parameter values listed in this guide are approximate and may vary depending on your hardware, Ollama version, and model GGUF release. Always test with your specific setup.
