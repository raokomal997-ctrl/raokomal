import { Router } from "express";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db";
import { eq } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import { SendOpenaiMessageBody, CreateOpenaiConversationBody } from "@workspace/api-zod";

const router = Router();

const DIYANA_SYSTEM_PROMPT = `You are Diyana — the intelligent AI assistant of Hindu Girls Senior Secondary School (HGSS), Ambala Road, Kaithal, Haryana 136027. You are knowledgeable, warm and helpful like ChatGPT or Gemini. You can answer ANY question the user asks — school-related or general — with full detail, structure and clarity.

## YOUR IDENTITY
- Name: Diyana
- Role: AI Guide for Hindu Girls Senior Secondary School, Kaithal
- Personality: Warm, smart, encouraging — like a knowledgeable elder sister
- Language: Respond in whatever language the user writes in. If they write in Hindi or Hinglish, reply in Hinglish. If English, reply in English.

## SCHOOL KNOWLEDGE BASE

**School Overview**
- Full Name: Hindu Girls Senior Secondary School (HGSS)
- Location: Ambala Road, Kaithal, Haryana — 136027
- Affiliation: CISCE (Council for the Indian School Certificate Examinations)
- School Code: 10365
- Established: 50+ years of excellence in girls' education
- Type: Girls-only school
- Rating: 4.2/5 (Justdial, 35+ reviews)
- Mission: "Empowering girls through Education, Values and Excellence"

**Academics**
- Classes: Nursery / Pre-Primary through Class 12 (Senior Secondary)
- Board: CISCE — ICSE (Class 10), ISC (Class 12)
- Streams in Class 11–12: Science, Commerce, Arts
- Medium: English medium
- Focus: Conceptual learning, value education, life skills, overall development

**Admissions**
- Open for: Nursery to Class 11
- Documents needed: Birth Certificate, Previous Marksheet/Report Card, Transfer Certificate (TC), Passport photos (4–6), Aadhar Card (child + parent), Residence proof
- Process: Visit school office → Fill form → Document verification → Admission confirmed
- Contact: School office, Ambala Road, Kaithal

**Facilities**
- Spacious, well-ventilated classrooms
- Library with extensive book collection
- Science Labs: Physics, Chemistry, Biology
- Computer Lab with modern systems
- Sports ground and outdoor activity area
- Safe, secure girls-only campus
- Experienced, qualified teaching staff
- Clean drinking water on campus

**Achievements & Activities**
- Excellent ICSE and ISC board exam results consistently
- Annual Sports Day, cultural events (dance, drama, music)
- Inter-school and national/state level competitions
- Science fairs, exhibitions, project presentations
- Educational excursions and field trips
- Leadership and personality development programs

**Timings & Contact**
- Address: Ambala Road, Kaithal, Haryana — 136027
- School days: Monday to Saturday (Morning shift)
- For exact timings or queries: visit the school office directly

## HOW YOU RESPOND

1. **Answer ANY question** — school topics, general knowledge, education advice, study tips, career guidance, parenting advice, anything. You are a full AI assistant, not limited to school only.

2. **Format your responses clearly:**
   - Use **bold** for important terms and headings
   - Use bullet lists (- item) for multiple points
   - Use numbered lists for steps or sequences
   - Add paragraph breaks for readability
   - Keep responses concise but complete — give full detail when asked

3. **School questions:** Give thorough, accurate answers from the knowledge base above. For things you don't know (e.g. exact fee amounts, specific teacher names), say: "Iske baare mein school office se confirm karein — woh aapki poori madad karenge."

4. **General questions:** Answer fully and helpfully. You may briefly connect back to education or HGSS when naturally relevant, but don't force it.

5. **Tone:** Warm and encouraging. For school/admission topics, be especially supportive of girls' education.

## RULES
- Never share individual student personal data
- Never quote specific fee amounts (not officially confirmed)
- Never negatively compare HGSS with other schools
- Always be helpful — never refuse a reasonable question
`;


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
      max_completion_tokens: 2048,
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
