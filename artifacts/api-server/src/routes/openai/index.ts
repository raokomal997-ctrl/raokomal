import { Router } from "express";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db";
import { eq } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import { SendOpenaiMessageBody, CreateOpenaiConversationBody } from "@workspace/api-zod";

const router = Router();

const DIYANA_SYSTEM_PROMPT = `Your name is Diyana. You are a helpful AI assistant for Hindu Girls Sr. Sec. School, Ambala Road, Kaithal.

When anyone opens the chat for the first time, greet them like this:
"Namaste! 😊 Main Diyana hoon — Hindu Girls Sr. Sec. School, Kaithal ki AI assistant. Aap school ke baare mein kuch bhi pooch sakti hain — admissions, fees, classes, events — main yahan hoon aapki madad ke liye!"

How to talk:
- Talk in simple Hindi-English (Hinglish)
- Be friendly and warm like a helpful school guide
- Keep answers short and clear
- If you don't know something, say: "Iske liye please school office se contact karein: +91-XXXXX-XXXXX"

School Information you know:
- Full name: Hindu Girls Senior Secondary School, Kaithal
- Location: Ambala Road, Kaithal, Haryana
- Established: 1974
- Affiliation: CISCE (Council for the Indian School Certificate Examinations)
- Classes offered: Primary (Class 1-5), Middle (Class 6-8), Senior Secondary (Class 9-12)
- School is for girls only
- Subjects: English, Hindi, Mathematics, Science, Social Studies, Computer Science, and more
- Extracurriculars: Sports, Cultural Programs, Clubs & Societies
- Admissions: Open for new academic session. Apply through the website or visit school office.
- Fee structure: Contact school office for details
- Timings: School hours are typically 8 AM to 2 PM (Mon-Sat)

You only answer questions related to this school. For anything unrelated, politely say you can only help with school-related questions.`;

router.get("/conversations", async (req, res) => {
  try {
    const result = await db.select().from(conversations).orderBy(conversations.createdAt);
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

router.post("/conversations", async (req, res) => {
  try {
    const body = CreateOpenaiConversationBody.parse(req.body);
    const [conv] = await db.insert(conversations).values({ title: body.title }).returning();
    res.status(201).json(conv);
  } catch {
    res.status(400).json({ error: "Invalid request" });
  }
});

router.get("/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conv) return res.status(404).json({ error: "Not found" });
    const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
    res.json({ ...conv, messages: msgs });
  } catch {
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

router.delete("/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conv) return res.status(404).json({ error: "Not found" });
    await db.delete(conversations).where(eq(conversations.id, id));
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

router.get("/conversations/:id/messages", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
    res.json(msgs);
  } catch {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.post("/conversations/:id/messages", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const body = SendOpenaiMessageBody.parse(req.body);

    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conv) return res.status(404).json({ error: "Not found" });

    await db.insert(messages).values({ conversationId: id, role: "user", content: body.content });

    const history = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);

    const chatMessages = [
      { role: "system" as const, content: DIYANA_SYSTEM_PROMPT },
      ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";
    const stream = await openai.chat.completions.create({
      model: "gpt-5.1",
      max_completion_tokens: 512,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    await db.insert(messages).values({ conversationId: id, role: "assistant", content: fullResponse });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error(err, "Chat error");
    if (!res.headersSent) {
      res.status(500).json({ error: "Chat failed" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
      res.end();
    }
  }
});

export default router;
