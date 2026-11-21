# Why Does the Same Prompt Give Different Results? — Optimization Guide

← [Back to README](./README.md)

This guide explains why the same prompt produces different outputs when running `gpt-oss:20b` locally via Ollama versus using `gpt-oss:20b-cloud` on Ollama's official cloud — even though it is the **exact same underlying model**.

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

| Parameter | Ollama Local Default | Report Server `.env` Default |
|---|---|---|
| `temperature` | 0.8 | **0.1** (very deterministic) |
| `top_p` | 0.9 | **0.95** |
| `top_k` | 40 | not set |
| `seed` | random | **42** (fixed — reproducible) |

The report server sets `AI_TEMPERATURE=0.1` and `AI_SEED=42` in the `.env` — this makes output highly deterministic and consistent, which is ideal for structured JSX code generation. Running Ollama locally without these settings will produce noticeably more random and variable output.

### 4. 🕵️ Hidden System Prompt (Cloud)
Cloud providers often prepend a system prompt you never see:
```
"You are a helpful assistant. Be concise. Follow instructions carefully..."
```
This subtly shifts tone, verbosity, and instruction-following behaviour compared to your local instance, which starts with a completely blank slate.

<br>

# How to Minimise the Differences

| Fix | What to Do |
|---|---|
| **Increase context window** | Set `num_ctx` to 8192 or higher in your local Modelfile |
| **Match temperature** | Set `temperature 0.1` to match the report server `.env` default |
| **Match sampling params** | Set `top_p 0.95` and `seed 42` to match report server defaults |
| **Use higher quantization** | Pull `Q8_0` if your hardware allows — closer to FP16 precision |
| **Add a system prompt locally** | Mirror the cloud provider's system prompt behaviour |
| **Pin model version** | Use a specific GGUF tag, don't rely on `latest` |

### Example: Modelfile for Closer-to-Cloud Behaviour

Create a custom `Modelfile` to standardise your local setup:

```
FROM gpt-oss:20b

PARAMETER num_ctx 8192
PARAMETER temperature 0.1
PARAMETER top_p 0.95
PARAMETER seed 42

SYSTEM "You are a helpful assistant. Follow instructions carefully and generate valid JSX components in CommonJS format."
```

Then build and run:
```bash
ollama create gpt-oss-report -f Modelfile
ollama run gpt-oss-report
```

<br>

# Quick Reference

| Factor | 🖥️ Ollama Local | ☁️ Ollama Cloud |
|---|---|---|
| **Model** | `gpt-oss:20b` | `gpt-oss:20b-cloud` |
| **Weight precision** | Quantized (Q4/Q5) | Full precision (FP16) |
| **Context window** | 2048–4096 (default) | Up to 128k |
| **Sampling defaults** | Modelfile-defined | Provider-defined |
| **System prompt** | None (blank slate) | Often injected |
| **Model version** | Pinned to last `pull` | Always latest |
| **JSX code quality** | Good for simple templates | Better for complex templates |
| **Output determinism** | Lower | Higher |
| **Cost** | ~$0 (electricity only) | Pay-as-you-go or subscription |

> 📝 **Note:** Ollama Cloud is no longer free as of November 2026. The free tier (including the Starter plan) has been removed and replaced with pay-as-you-go and subscription plans. Please review [Ollama's pricing page](https://ollama.com/pricing) before use.

<br>

# Recommendation for Report Server Use

For generating complex JSX report templates locally, we recommend:

1. Use the **cloud model** (`gpt-oss:20b-cloud` via Ollama's official cloud) in the Report Template Manager for best and most consistent results
2. If using local, **always set `num_ctx` to at least 8192** to avoid silent prompt truncation
3. Set `temperature` to **0.1** and `seed` to **42** to match the report server defaults
4. After generating locally, always review the [Known Issues](./README.md#known-issues) section — local quantized models are more likely to produce the common JSX formatting errors listed there

<br>

### Disclaimer
Benchmark figures and default parameter values listed in this guide are approximate and may vary depending on your hardware, Ollama version, and model GGUF release. Always test with your specific setup.
