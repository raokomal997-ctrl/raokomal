import { Router, type IRouter } from "express";
import https from "https";

const router: IRouter = Router();

// Voice ID and model — configurable via env, fallback to defaults
const VOICE_ID = process.env["ELEVENLABS_VOICE_ID"] ?? "EXAVITQu4vr4xnSDxMaL";
const MODEL_ID = process.env["ELEVENLABS_MODEL_ID"] ?? "eleven_v3";

router.post("/tts", (req, res) => {
  const { text } = req.body as { text?: string };

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  const apiKey = process.env["ELEVENLABS_API_KEY"];
  if (!apiKey) {
    res.status(500).json({ error: "ElevenLabs API key not configured" });
    return;
  }

  const body = JSON.stringify({
    text: text.trim(),
    model_id: MODEL_ID,
    voice_settings: {
      stability: 0.65,
      similarity_boost: 0.80,
      style: 0.40,
      use_speaker_boost: true,
    },
  });

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

  const proxyReq = https.request(options, (proxyRes) => {
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

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    req.log.error({ err }, "ElevenLabs TTS request failed");
    res.status(502).json({ error: "TTS request failed" });
  });

  proxyReq.write(body);
  proxyReq.end();
});

export default router;
