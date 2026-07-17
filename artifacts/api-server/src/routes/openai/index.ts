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

// TEMPORARY debug route
router.get("/debug/groq-check", async (req, res) => {
  const key = process.env.GROQ_API_KEY;
  if (!key) { res.json({ hasKey: false }); return; }
  try {
    const r = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: "Bearer " + key },
    });
    const text = await r.text();
    res.json({
      hasKey: true,
      keyLength: key.length,
      groqStatus: r.status,
      groqBodyPreview: text.slice(0, 200),
    });
  } catch (err) {
    res.json({ hasKey: true, error: err instanceof Error ? err.message : String(err) });
  }
});

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
