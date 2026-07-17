import { Router } from "express";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import { SendOpenaiMessageBody, CreateOpenaiConversationBody } from "@workspace/api-zod";
import type { db as DbType, conversations as ConversationsType, messages as MessagesType } from "@workspace/db";

type Db = typeof DbType;
type Conversations = typeof ConversationsType;
type Messages = typeof MessagesType;

let _db: Db | null = null;
let _conversations: Conversations | null = null;
let _messages: Messages | null = null;
// After a DB error, fall back to memory for all subsequent requests
let dbFailed = false;

async function getDb(): Promise<{ db: Db; conversations: Conversations; messages: Messages }> {
  if (!_db) {
    const mod = await import("@workspace/db");
    _db = mod.db;
    _conversations = mod.conversations;
    _messages = mod.messages;
  }
  return { db: _db, conversations: _conversations!, messages: _messages! };
}

const shouldUseMemory = () => useMemoryDb || dbFailed;

type MemoryRole = "user" | "assistant";

type MemoryConversation = {
  id: number;
  title: string;
  createdAt: Date;
};

type MemoryMessage = {
  id: number;
  conversationId: number;
  role: MemoryRole;
  content: string;
  createdAt: Date;
};

const useMemoryDb = !process.env.DATABASE_URL;
const memoryConversations: MemoryConversation[] = [];
const memoryMessages: MemoryMessage[] = [];
let nextConvId = 1;
let nextMsgId = 1;

function getMemoryConversations() {
  return [...memoryConversations].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

function getMemoryConversation(id: number) {
  return memoryConversations.find((conv) => conv.id === id) ?? null;
}

function createMemoryConversation(title: string) {
  const conv = { id: nextConvId++, title, createdAt: new Date() };
  memoryConversations.push(conv);
  return conv;
}

function deleteMemoryConversation(id: number) {
  const index = memoryConversations.findIndex((conv) => conv.id === id);
  if (index !== -1) memoryConversations.splice(index, 1);
  for (let i = memoryMessages.length - 1; i >= 0; i--) {
    if (memoryMessages[i].conversationId === id) memoryMessages.splice(i, 1);
  }
}

function getMemoryMessages(id: number) {
  return memoryMessages
    .filter((msg) => msg.conversationId === id)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

function insertMemoryMessage(conversationId: number, role: MemoryRole, content: string) {
  const msg = { id: nextMsgId++, conversationId, role, content, createdAt: new Date() };
  memoryMessages.push(msg);
  return msg;
}

function getGroq(): OpenAI {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");
  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
    timeout: 20_000,
    maxRetries: 1,
  });
}

const router = Router();

// TEMPORARY debug route — remove after diagnosing Groq connectivity
router.get("/debug/groq-check", async (req, res) => {
  const key = process.env.GROQ_API_KEY;
  if (!key) { res.json({ hasKey: false }); return; }
  try {
    const r = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: \`Bearer \${key}\` },
    });
    const text = await r.text();
    res.json({
      hasKey: true,
      keyLength: key.length,
      keyPreview: \`\${key.slice(0, 6)}...\${key.slice(-4)}\`,
      groqStatus: r.status,
      groqBodyPreview: text.slice(0, 200),
    });
  } catch (err) {
    res.json({ hasKey: true, keyLength: key.length, error: err instanceof Error ? err.message : String(err) });
  }
});

// ── Groq model ────────────────────────────────────────────────────────────────
// llama-3.1-8b-instant: Groq's fastest model — ideal for school FAQ chatbot
const GROQ_MODEL = "llama-3.1-8b-instant";

// ── Strictly school-only system prompt (kept compact to stay within Groq's
//    free-tier tokens-per-minute limit — a long prompt was causing 413/429
//    errors and made the chatbot appear to hang on "thinking...") ───────────
const DIYANA_SYSTEM_PROMPT = `You are Diyana, the AI assistant of Hindu Girls Senior Secondary School (HGSS), Kaithal, Haryana. Board: HBSE/BSEH (Bhiwani) ONLY — never say CISCE/ICSE/ISC/CBSE. Class 10 = HBSE Secondary Exam, Class 12 = HBSE Senior Secondary Exam.

ONLY answer questions about HGSS. If asked anything unrelated (general knowledge, homework, entertainment, etc.), refuse politely: "Main sirf HGSS school ke baare mein help kar sakti hoon. School ke admissions, fees, facilities, academics, ya koi bhi school-related sawaal poochhein — main poori koshish karungi! 😊"

Personality: warm, professional, like a helpful school receptionist. Match the user's language (Hindi/Hinglish → reply Hinglish; English → reply English). Be concise, use bold/bullets, no long preamble.

KNOWLEDGE BASE:
- Est. 1974, girls-only, 1500+ students, 80+ faculty, School Code 10365. Address: Ambala Road, Model Town, Kaithal – 136027, Haryana. Motto: विद्या ददाति विनयम् (Knowledge bestows humility).
- Classes: Nursery to Class XII. Streams (XI-XII): Science, Commerce, Arts. Medium: English.
- School hours: Mon–Sat, 7:30 AM–2:45 PM. 8 periods/day with short break and lunch break.
- Principal: Mrs. Sunita Sharma. Vice Principal: Mrs. Anjali Verma.
- Admissions 2026-27 open (Pre-Primary to Class XII). Process: (1) Online application (2) Document submission — birth certificate, marksheets, TC, photos, Aadhar, address proof (3) Interaction (4) Confirmation & fee payment.
- Fees (indicative, ₹): Pre-Primary 18,000/yr tuition + 1,500/mo; Primary (I-V) 24,000/yr + 2,000/mo; Middle (VI-VIII) 28,000/yr + 2,400/mo; Secondary (IX-X) 34,000/yr + 2,800/mo; Senior Secondary (XI-XII) 42,000/yr + 3,500/mo. Admission fee ₹8,000-18,000 depending on level. Monthly fee due by 10th, late fine ₹50/day. Modes: cash, DD, bank transfer.
- Scholarships: 10-15% sibling discount, up to 25% merit scholarship (90%+ scorers), 50% staff-ward discount, EWS full exemption.
- Facilities: science labs, computer lab, library (12,000+ books), art/music/dance rooms, indoor sports hall, playgrounds, medical room, GPS-tracked transport, CCTV & lady security, canteen.
- Sports: volleyball, judo, kabaddi, athletics, badminton, kho-kho, basketball — multiple district/state championships.
- Results: HBSE Class X 99.2% pass (2025), Class XII 98.7% pass (2025).
- Clubs: NCC Girls Battalion, Science Club, Literary Club (magazine 'Kiran'), Eco Club, Cultural Club, Health Club, Math Club, Community Service Club.
- Contact: Phone +91 1746 234 336, Mobile +91 70156 72075, Email hinduschoolktl@gmail.com. Office hours Mon–Sat 8:30 AM–2:30 PM.

If something isn't in the knowledge base, say: "Iske exact details ke liye school office se contact karein — +91 1746 234 336 ya hinduschoolktl@gmail.com 😊". Never share individual student data. Never badmouth other schools.`;

// Keep only the most recent messages when building context — prevents token
// usage (and Groq TPM rate limits) from growing unbounded as a chat gets long.
const MAX_HISTORY_MESSAGES = 10;

router.get("/conversations", async (req, res) => {
  try {
    if (shouldUseMemory()) { res.json(getMemoryConversations()); return; }
    try {
      const { db, conversations } = await getDb();
      const result = await db.select().from(conversations).orderBy(conversations.createdAt);
      res.json(result);
    } catch { dbFailed = true; res.json(getMemoryConversations()); }
  } catch { res.status(500).json({ error: "Failed to fetch conversations" }); }
});

router.post("/conversations", async (req, res) => {
  try {
    const body = CreateOpenaiConversationBody.parse(req.body);
    if (shouldUseMemory()) { res.status(201).json(createMemoryConversation(body.title)); return; }
    try {
      const { db, conversations } = await getDb();
      const [conv] = await db.insert(conversations).values({ title: body.title }).returning();
      res.status(201).json(conv);
    } catch { dbFailed = true; res.status(201).json(createMemoryConversation(body.title)); }
  } catch (err) {
    const isValidation = err instanceof Error && err.name === "ZodError";
    res.status(isValidation ? 400 : 500).json({ error: isValidation ? "Invalid request" : "Server error" });
  }
});

router.get("/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (shouldUseMemory()) {
      const conv = getMemoryConversation(id);
      if (!conv) { res.status(404).json({ error: "Not found" }); return; }
      res.json({ ...conv, messages: getMemoryMessages(id) }); return;
    }
    try {
      const { db, conversations, messages } = await getDb();
      const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
      if (!conv) { res.status(404).json({ error: "Not found" }); return; }
      const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
      res.json({ ...conv, messages: msgs });
    } catch {
      dbFailed = true;
      const conv = getMemoryConversation(id);
      if (!conv) { res.status(404).json({ error: "Not found" }); return; }
      res.json({ ...conv, messages: getMemoryMessages(id) });
    }
  } catch { res.status(500).json({ error: "Failed to fetch conversation" }); }
});

router.delete("/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (shouldUseMemory()) {
      if (!getMemoryConversation(id)) { res.status(404).json({ error: "Not found" }); return; }
      deleteMemoryConversation(id); res.status(204).send(); return;
    }
    try {
      const { db, conversations } = await getDb();
      const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
      if (!conv) { res.status(404).json({ error: "Not found" }); return; }
      await db.delete(conversations).where(eq(conversations.id, id));
      res.status(204).send();
    } catch {
      dbFailed = true;
      if (!getMemoryConversation(id)) { res.status(404).json({ error: "Not found" }); return; }
      deleteMemoryConversation(id); res.status(204).send();
    }
  } catch { res.status(500).json({ error: "Failed to delete conversation" }); }
});

router.get("/conversations/:id/messages", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (shouldUseMemory()) { res.json(getMemoryMessages(id)); return; }
    try {
      const { db, messages } = await getDb();
      const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
      res.json(msgs);
    } catch { dbFailed = true; res.json(getMemoryMessages(id)); }
  } catch { res.status(500).json({ error: "Failed to fetch messages" }); }
});

router.post("/conversations/:id/messages", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const body = SendOpenaiMessageBody.parse(req.body);

    // DB path (with memory fallback) — handled below
    let useMemory = shouldUseMemory();
    if (!useMemory) {
      try {
        const { db, conversations, messages } = await getDb();
        const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
        if (!conv) { res.status(404).json({ error: "Not found" }); return; }
        await db.insert(messages).values({ conversationId: id, role: "user", content: body.content });
        const history = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
        const trimmedHistory = history.slice(-MAX_HISTORY_MESSAGES);
        const chatMessages = [
          { role: "system" as const, content: DIYANA_SYSTEM_PROMPT },
          ...trimmedHistory.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        ];
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        const abortController = new AbortController();
        const onClientClose = () => abortController.abort();
        req.on("close", onClientClose);
        if (!process.env.GROQ_API_KEY) {
          const demo = "Demo mode: AI key not configured. For full AI responses, set GROQ_API_KEY. Meanwhile, here's a sample answer: The school offers Nursery to Class XII, streams in XI-XII are Science, Commerce and Arts. For exact details contact the school office.";
          for (const p of demo.match(/.{1,80}/g) || [demo]) {
            if (req.aborted) break;
            res.write(`data: ${JSON.stringify({ content: p })}\n\n`);
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, 50));
          }
          if (!res.writableEnded) { res.write(`data: ${JSON.stringify({ done: true })}\n\n`); res.end(); }
          req.off("close", onClientClose);
          return;
        }
        let fullResponse = "";
        try {
          const groq = getGroq();
          const stream = await groq.chat.completions.create({ model: GROQ_MODEL, max_completion_tokens: 600, messages: chatMessages, stream: true }, { signal: abortController.signal });
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) { fullResponse += content; if (!res.writableEnded) res.write(`data: ${JSON.stringify({ content })}\n\n`); }
          }
          if (fullResponse) await db.insert(messages).values({ conversationId: id, role: "assistant", content: fullResponse });
          if (!res.writableEnded) { res.write(`data: ${JSON.stringify({ done: true })}\n\n`); res.end(); }
        } finally { req.off("close", onClientClose); }
        return;
      } catch { dbFailed = true; useMemory = true; }
    }

    // Memory path
    if (useMemory) {
      if (!getMemoryConversation(id)) { res.status(404).json({ error: "Not found" }); return; }
      insertMemoryMessage(id, "user", body.content);
      const history = getMemoryMessages(id);
      const trimmedHistory = history.slice(-MAX_HISTORY_MESSAGES);
      const chatMessages = [
        { role: "system" as const, content: DIYANA_SYSTEM_PROMPT },
        ...trimmedHistory.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ];
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      const abortController = new AbortController();
      const onClientClose = () => abortController.abort();
      req.on("close", onClientClose);
      if (!process.env.GROQ_API_KEY) {
        const demo = "Demo mode: AI key not configured. For full AI responses, set GROQ_API_KEY. Meanwhile, here's a sample answer: The school offers Nursery to Class XII, streams in XI-XII are Science, Commerce and Arts. For exact details contact the school office.";
        for (const p of demo.match(/.{1,80}/g) || [demo]) {
          if (req.aborted) break;
          res.write(`data: ${JSON.stringify({ content: p })}\n\n`);
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, 50));
        }
        if (!res.writableEnded) { res.write(`data: ${JSON.stringify({ done: true })}\n\n`); res.end(); }
        req.off("close", onClientClose);
        return;
      }
      let fullResponse = "";
      try {
        const groq = getGroq();
        const stream = await groq.chat.completions.create({ model: GROQ_MODEL, max_completion_tokens: 600, messages: chatMessages, stream: true }, { signal: abortController.signal });
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) { fullResponse += content; if (!res.writableEnded) res.write(`data: ${JSON.stringify({ content })}\n\n`); }
        }
        if (fullResponse) insertMemoryMessage(id, "assistant", fullResponse);
        if (!res.writableEnded) { res.write(`data: ${JSON.stringify({ done: true })}\n\n`); res.end(); }
      } finally { req.off("close", onClientClose); }
    }
  } catch (err) {
    req.log.error(err, "Chat error");
    if (!res.headersSent) {
      const isTimeout = err instanceof Error && /timeout|timed out|abort/i.test(err.message);
      res.status(isTimeout ? 504 : 500).json({
        error: isTimeout ? "Diyana is taking too long to respond. Please try again." : "Chat failed",
      });
    } else if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ error: "Stream failed. Please try again." })}\n\n`);
      res.end();
    }
  }
});

export default router;
