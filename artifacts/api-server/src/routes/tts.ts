import { Router, type IRouter } from "express";
import https from "https";

const router: IRouter = Router();

const VOICE_ID = "RABOvaPec1ymXz02oDQi";
const MODEL_ID = "eleven_multilingual_v2";

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
      stability: 0.5,
      similarity_boost: 0.75,
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
        const body = Buffer.concat(chunks).toString("utf8");
        req.log.error({ status: proxyRes.statusCode, body }, "ElevenLabs TTS error");
        res.status(502).json({ error: "TTS provider error", detail: body });
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
