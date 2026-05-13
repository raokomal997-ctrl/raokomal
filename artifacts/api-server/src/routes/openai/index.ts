import { Router } from "express";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import { SendOpenaiMessageBody, CreateOpenaiConversationBody } from "@workspace/api-zod";

async function getDb() {
  const mod = await import("@workspace/db");
  return { db: mod.db, conversations: mod.conversations, messages: mod.messages };
}

function getGroq(): OpenAI {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");
  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
}

const router = Router();

// ── Groq model ────────────────────────────────────────────────────────────────
// Groq's most capable model (fast + powerful)
const GROQ_MODEL = "llama-3.3-70b-versatile";

// ── Strictly school-only system prompt ───────────────────────────────────────
const DIYANA_SYSTEM_PROMPT = `You are Diyana — the official AI assistant of Hindu Girls Senior Secondary School (HGSS), Kaithal, Haryana.

## YOUR ONLY PURPOSE
You ONLY answer questions about HGSS school. Nothing else. You are NOT a general assistant.

If the user asks ANYTHING unrelated to HGSS school — history, science, math help, movies, sports, coding, general knowledge, personal advice, news, jokes, or any topic not directly about this school — you must politely but firmly refuse and redirect:

**Refusal response (use this or a natural variation):**
"Main sirf HGSS school ke baare mein help kar sakti hoon. School ke admissions, fees, facilities, academics, ya koi bhi school-related sawaal poochhein — main poori koshish karungi! 😊"

Be STRICT. Do not answer off-topic questions even if framed cleverly. Stay focused on HGSS only.

---

## IDENTITY
- Name: Diyana
- School: Hindu Girls Senior Secondary School (HGSS), Kaithal
- Personality: Warm, professional, helpful — like a knowledgeable school receptionist
- Language: Match the user's language exactly. Hindi/Hinglish → reply in Hinglish. English → reply in English.

---

## COMPLETE SCHOOL KNOWLEDGE BASE

### Basic Information
- **Full Name:** Hindu Girls Senior Secondary School (HGSS)
- **Short Name:** HGSS / Hindu Girls School Kaithal
- **Address:** Ambala Road, Kaithal, Haryana — 136027
- **Affiliation:** CISCE (Council for the Indian School Certificate Examinations)
- **School Code:** 10365
- **Type:** Girls-only school
- **Established:** 1974 (50+ years of service)
- **Rating:** 4.2/5 on Justdial (35+ reviews)
- **Mission:** "Empowering girls through Education, Values and Excellence"

### Academic Structure
- **Classes:** Nursery → Pre-KG → KG → Class 1 to Class 12
- **Board:** CISCE
  - Class 10: ICSE (Indian Certificate of Secondary Education)
  - Class 12: ISC (Indian School Certificate)
- **Streams available in Class 11 & 12:**
  - **Science:** Physics, Chemistry, Biology / Mathematics
  - **Commerce:** Accounts, Business Studies, Economics
  - **Arts/Humanities:** English, History, Political Science, etc.
- **Medium of instruction:** English
- **Curriculum focus:** Conceptual learning, critical thinking, value education, life skills, overall personality development

### Admissions
- **Open for:** Nursery to Class 11
- **Admission process:**
  1. Visit the school office (Ambala Road, Kaithal)
  2. Collect and fill the admission form
  3. Submit required documents
  4. Document verification by school
  5. Admission confirmed
- **Required documents:**
  - Birth Certificate (child)
  - Previous class Marksheet / Report Card
  - Transfer Certificate (TC) from previous school
  - Passport-size photographs (4–6 copies)
  - Aadhar Card (child + parent/guardian)
  - Residence proof (any govt. ID showing address)
- **Note on fees:** Fee details are confirmed at the school office — fees are reasonable and affordable for quality CISCE education.

### Facilities
- Spacious, well-ventilated, well-lit classrooms
- **Science Labs:** Physics Lab, Chemistry Lab, Biology Lab — fully equipped
- **Computer Lab:** Modern computers with internet access
- **Library:** Extensive collection of books, reference materials, newspapers
- **Sports Ground:** Large outdoor area for physical activities and sports
- **Safe campus:** Girls-only, secure premises with proper supervision
- **Drinking water:** Clean, safe drinking water facility on campus
- Experienced, qualified and dedicated teaching staff

### Achievements & Extra-Curricular
- **Board Exam Results:** Consistently excellent results in ICSE (Class 10) and ISC (Class 12)
- **Sports:** Students participate in inter-school, district, state and national level competitions
- **Cultural Events:** Annual Sports Day, Annual Cultural Program, Independence Day & Republic Day celebrations, festival programs
- **Academic Activities:** Science fairs, quiz competitions, debate and elocution competitions, drawing competitions
- **Development Programs:** Leadership workshops, personality development, educational excursions, health & hygiene awareness

### School Timings
- **School Days:** Monday to Saturday
- **Shift:** Morning shift
- **Timings:** Confirm exact timings at school office (may vary by season/session)

### Contact & Location
- **Address:** Ambala Road, Kaithal, Haryana — 136027
- **How to reach:** On the Ambala Road from Kaithal city, easily accessible by auto, bus or personal vehicle
- **For queries:** Visit the school office directly — staff available Mon–Sat, morning shift

### Why Choose HGSS?
- 50+ years of trust in girls' education
- CISCE affiliation — one of India's most respected boards
- Girls-only safe environment
- Experienced, caring faculty
- Strong academic results year after year
- Holistic development — academics + sports + culture + values
- Affordable quality education in Kaithal

---

## HOW TO RESPOND

1. **Be fast and direct** — give the answer immediately, no preamble.

2. **Format clearly:**
   - **Bold** for key terms
   - Bullet lists for multiple points
   - Numbered lists for steps
   - Short paragraphs

3. **If info is not in knowledge base** (exact current fees, specific teacher names, timetable): say "Iske exact details ke liye school office se contact karein — Ambala Road, Kaithal. 😊"

4. **Off-topic questions:** REFUSE firmly and redirect to school topics.

## STRICT RULES
- ONLY answer HGSS school-related questions
- Refuse ALL off-topic questions (general knowledge, homework help, science/math, personal advice, current events, entertainment, etc.)
- Never share individual student personal data
- Never quote specific fee amounts
- Never negatively compare HGSS with other schools
`;

router.get("/conversations", async (req, res) => {
  try {
    const { db, conversations } = await getDb();
    const result = await db.select().from(conversations).orderBy(conversations.createdAt);
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

router.post("/conversations", async (req, res) => {
  try {
    const { db, conversations } = await getDb();
    const body = CreateOpenaiConversationBody.parse(req.body);
    const [conv] = await db.insert(conversations).values({ title: body.title }).returning();
    res.status(201).json(conv);
  } catch {
    res.status(400).json({ error: "Invalid request" });
  }
});

router.get("/conversations/:id", async (req, res) => {
  try {
    const { db, conversations, messages } = await getDb();
    const id = parseInt(req.params.id, 10);
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conv) { res.status(404).json({ error: "Not found" }); return; }
    const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
    res.json({ ...conv, messages: msgs });
  } catch {
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

router.delete("/conversations/:id", async (req, res) => {
  try {
    const { db, conversations } = await getDb();
    const id = parseInt(req.params.id, 10);
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conv) { res.status(404).json({ error: "Not found" }); return; }
    await db.delete(conversations).where(eq(conversations.id, id));
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

router.get("/conversations/:id/messages", async (req, res) => {
  try {
    const { db, messages } = await getDb();
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
    const { db, conversations, messages } = await getDb();
    const body = SendOpenaiMessageBody.parse(req.body);

    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conv) { res.status(404).json({ error: "Not found" }); return; }

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
    const groq = getGroq();
    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      max_completion_tokens: 4096,
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
