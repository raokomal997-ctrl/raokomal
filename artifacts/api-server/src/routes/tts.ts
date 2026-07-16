/**
 * tts.ts — ElevenLabs Text-to-Speech (TTS) Proxy Route
 *
 * Kaam kya karta hai:
 *   Client se text aata hai → ElevenLabs API ko bheji jaati hai →
 *   MP3 audio wapas milti hai → client ko stream kar di jaati hai
 *
 * API Key:
 *   ELEVENLABS_API_KEY — Replit Secrets mein safely rakha hai
 *   NEVER is key ko code mein seedha mat likhna
 *
 * Voice / Model (env vars se override kar sakte ho):
 *   ELEVENLABS_VOICE_ID  — kaun si awaaz use karni hai
 *   ELEVENLABS_MODEL_ID  — kaun sa model use karna hai
 *
 * Note: Audio files pehle se generate karke public/audio/ mein
 *   rakhi hain. Yeh route sirf fallback ke liye kaam karta hai
 *   jab cached file na mile.
 */

import { Router, type IRouter } from "express";
import https from "https";

const router: IRouter = Router();

// ── Voice Configuration ───────────────────────────────────────
// Default: Bella (EXAVITQu4vr4xnSDxMaL) — free plan compatible warm female voice
// Model:   eleven_v3 — ElevenLabs ka latest, sabse expressive model
// Override karne ke liye env vars set karo: ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL_ID
const VOICE_ID = process.env["ELEVENLABS_VOICE_ID"] ?? "EXAVITQu4vr4xnSDxMaL";
const MODEL_ID = process.env["ELEVENLABS_MODEL_ID"] ?? "eleven_v3";

// ── POST /api/tts ─────────────────────────────────────────────
// Body:    { text: string }   — bolne wala text (Hindi Devanagari ya Roman)
// Returns: audio/mpeg stream  — MP3 audio
router.post("/tts", (req, res) => {
  const { text } = req.body as { text?: string };

  // Validation — text nahi aaya toh 400 error
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  // API key check — agar secret set nahi toh 500 error
  const apiKey = process.env["ELEVENLABS_API_KEY"];
  if (!apiKey) {
    res.status(500).json({ error: "ElevenLabs API key not configured" });
    return;
  }

  // ── ElevenLabs API ko bhejna wala request body ────────────────
  // Voice settings ka matlab:
  //   stability        → 0 (dynamic/expressive) se 1 (stable/monotone)
  //   similarity_boost → voice character kitna consistent rahe
  //   style            → emotional expressiveness (0 = flat, 1 = dramatic)
  //   use_speaker_boost → audio quality better karta hai
  const body = JSON.stringify({
    text: text.trim(),
    model_id: MODEL_ID,
    voice_settings: {
      stability: 0.65,        // thodi si variation — natural lagti hai
      similarity_boost: 0.80, // voice consistent rahe
      style: 0.40,            // thoda expressive ho
      use_speaker_boost: true, // cleaner audio
    },
  });

  // ── HTTPS request options ─────────────────────────────────────
  const options = {
    hostname: "api.elevenlabs.io",
    path: `/v1/text-to-speech/${VOICE_ID}`,
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
      Accept: "audio/mpeg",
    },
  };

  // ElevenLabs se HTTPS request karo aur response stream karo
  const proxyReq = https.request(options, (proxyRes) => {
    // Error response aaya (4xx/5xx)
    if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
      const chunks: Buffer[] = [];
      proxyRes.on("data", (c: Buffer) => chunks.push(c));
      proxyRes.on("end", () => {
        const errBody = Buffer.concat(chunks).toString("utf8");
        req.log.error({ status: proxyRes.statusCode, body: errBody }, "ElevenLabs TTS error");
        res.status(502).json({ error: "TTS provider error", detail: errBody });
      });
      return;
    }

    // Success — MP3 stream seedha client ko de do
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    proxyRes.pipe(res);
  });

  // Network error
  proxyReq.on("error", (err) => {
    req.log.error({ err }, "ElevenLabs TTS request failed");
    res.status(502).json({ error: "TTS request failed" });
  });

  proxyReq.write(body);
  proxyReq.end();
});

export default router;
