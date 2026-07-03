---
name: Groq/OpenAI-SDK streaming chatbot appears to "hang forever" on thinking
description: Root cause and fix pattern when a Groq-backed chat endpoint stops responding under light rapid use — not a bug in fetch/proxy/CORS, it's TPM rate limiting with no client-visible error.
---

When a Groq (or similar low-free-tier-limit provider) streaming chat endpoint gets stuck on "thinking..." with no error shown to the user, suspect **tokens-per-minute (TPM) rate limiting**, not networking/CORS/proxy — those all tested fine in this case.

**Why:** A large system prompt (multi-KB knowledge-base style prompt) resent on every single message, plus full conversation history sent uncapped, burns through a small free-tier TPM budget (e.g. Groq's 6000 TPM) in 2-3 messages. The Groq Node SDK call then either 429s or hangs on the client if no request timeout is configured — and since the failure is silent/slow, the frontend "thinking" indicator just spins.

**How to apply:**
- Diagnose by hitting the endpoint directly with curl/rapid-fire loop (bypass the frontend) and check server logs for `429`/`413` "rate_limit_exceeded" or "Request too large" errors — this confirms token budget, not network.
- Fix: (1) drastically compact the system prompt (facts-dense, no markdown headers/tables bloat), (2) cap conversation history sent per request (e.g. last 10 messages) so token usage doesn't grow unbounded as a chat continues, (3) set an explicit `timeout` + low `maxRetries` on the OpenAI/Groq client so a stuck request fails fast with a user-facing error instead of hanging indefinitely, (4) wire `req.on("close")` to an AbortController so a disconnected client doesn't leave the upstream stream running.
