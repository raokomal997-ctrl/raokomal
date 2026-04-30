import type { Route } from "../App";

type Level = "primary" | "middle" | "senior";

const data: Record<Level, {
  crumb: string;
  title: string;
  intro: string;
  hero: string;
  programs: { num: string; meta: string; title: string; desc: string }[];
}> = {
  primary: {
    crumb: "Academics · Primary School",
    title: "Primary School (Classes I – V)",
    intro: "A joyful, activity-rich foundation in literacy, numeracy and curiosity.",
    hero: "/photos/art-class.jpeg",
    programs: [
      { num: "01", meta: "Languages",       title: "English, Hindi & Sanskrit",        desc: "Strong reading, writing and conversation foundations through stories, role-play and structured grammar lessons." },
      { num: "02", meta: "Numeracy",        title: "Mathematics — Concrete to Abstract", desc: "Concept-first teaching using manipulatives, real-life problems and number games to build confidence." },
      { num: "03", meta: "Discovery",       title: "Environmental Studies (EVS)",       desc: "Children explore plants, animals, the human body, festivals and our community — through observation and projects." },
      { num: "04", meta: "Creative Arts",   title: "Art, Music, Dance & Craft",         desc: "Weekly periods of drawing, painting, vocal music, classical and folk dance, and hands-on craft." },
      { num: "05", meta: "Wellbeing",       title: "Physical Education & Yoga",         desc: "Daily movement, age-appropriate sports, yoga and breathing — building healthy habits early." },
      { num: "06", meta: "Values",          title: "Moral Science & Sanskar",           desc: "Stories, songs and shlokas that introduce truth, kindness, gratitude and respect for elders." },
    ],
  },
  middle: {
    crumb: "Academics · Middle School",
    title: "Middle School (Classes VI – VIII)",
    intro: "A bridge between joyful primary learning and rigorous senior academics.",
    hero: "/photos/students-cooking.jpeg",
    programs: [
      { num: "01", meta: "Core Languages",  title: "English, Hindi & Sanskrit",         desc: "Literature, composition and grammar — preparing students to read, write and speak with clarity." },
      { num: "02", meta: "Mathematics",     title: "Algebra, Geometry & Reasoning",     desc: "Problem-solving focus with regular practice tests and Olympiad-style enrichment." },
      { num: "03", meta: "Sciences",        title: "Physics, Chemistry & Biology",      desc: "Hands-on laboratory work introduced — observations, experiments and scientific writing." },
      { num: "04", meta: "Social Sciences", title: "History, Geography & Civics",       desc: "Understanding India and the world — through maps, source-work, debates and projects." },
      { num: "05", meta: "Computing",       title: "Computer Applications",             desc: "Digital literacy, basic programming concepts, document and presentation skills." },
      { num: "06", meta: "Co-curricular",   title: "Art, Music, Dance, Sports & SUPW",  desc: "Continuing weekly enrichment — plus Socially Useful Productive Work projects." },
    ],
  },
  senior: {
    crumb: "Academics · Senior Secondary",
    title: "Senior Secondary (Classes IX – XII)",
    intro: "Rigorous CISCE preparation across Science, Commerce and Humanities — with full board readiness.",
    hero: "/photos/annual-day-toppers.jpeg",
    programs: [
      { num: "01", meta: "Class IX – X · ICSE", title: "Core Compulsory Subjects",       desc: "English, Second Language (Hindi/Sanskrit), History/Civics & Geography, Mathematics, Science, plus electives." },
      { num: "02", meta: "Stream",              title: "Science (PCM / PCB)",            desc: "Physics, Chemistry, Mathematics or Biology — with full lab access and competitive-exam readiness." },
      { num: "03", meta: "Stream",              title: "Commerce",                        desc: "Accounts, Business Studies, Economics, Mathematics — preparing students for CA, BBA, BCom and beyond." },
      { num: "04", meta: "Stream",              title: "Humanities",                      desc: "History, Political Science, Psychology, Sociology, Economics — for law, civil services and the social sciences." },
      { num: "05", meta: "Career Guidance",     title: "Counselling & Mentorship",       desc: "1-on-1 academic counselling, career talks, university application support and mock interviews." },
      { num: "06", meta: "Beyond Academics",    title: "NCC, Sports & Leadership",       desc: "Senior students lead the student council, NCC contingents and house-team sports." },
    ],
  },
};

type Props = { level: Level; navigate: (r: Route) => void };

export default function ProgramsPage({ level, navigate }: Props) {
  const d = data[level];
  return (
    <>
      <section
        className="page-banner"
        style={{
          background: `linear-gradient(135deg, rgba(19,28,38,.85), rgba(19,28,38,.7)), url('${d.hero}') center / cover no-repeat, var(--ink)`,
        }}
      >
        <div className="crumb">{d.crumb}</div>
        <h1>{d.title}</h1>
        <p>{d.intro}</p>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Curriculum</span>
          <h2>What Your Daughter Will Learn</h2>
          <p>A balanced syllabus combining core academics with arts, sports and values.</p>
        </div>

        <div className="programs-list">
          {d.programs.map((p) => (
            <div key={p.num} className="program-row reveal">
              <div className="program-num">{p.num}</div>
              <div className="program-content">
                <div className="meta">{p.meta}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="section-head reveal" style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: "1.6rem" }}>Explore Other Levels</h2>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn-outline-dark" onClick={() => navigate("programs-primary")}>Primary (1 – 5)</button>
          <button className="btn btn-outline-dark" onClick={() => navigate("programs-middle")}>Middle (6 – 8)</button>
          <button className="btn btn-outline-dark" onClick={() => navigate("programs-senior")}>Senior Secondary (9 – 12)</button>
        </div>
      </section>
    </>
  );
}
