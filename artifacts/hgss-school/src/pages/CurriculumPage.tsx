export default function CurriculumPage() {
  const levels = [
    {
      level: "Pre-Primary (Nursery – KG)",
      color: "#F4D03F",
      focus: "Play-based learning, language development, motor skills, and foundational numeracy.",
      areas: ["Phonics & Early Literacy", "Number Sense & Shapes", "Creative Arts & Craft", "Music & Movement", "Environmental Awareness"],
    },
    {
      level: "Primary (Classes I – V)",
      color: "#3498DB",
      focus: "Building strong foundations in core subjects through activity-based and inquiry-led methods.",
      areas: ["English Language & Literature", "Hindi", "Mathematics", "Environmental Studies", "General Knowledge", "Art & Craft", "Physical Education"],
    },
    {
      level: "Middle School (Classes VI – VIII)",
      color: "#2ECC71",
      focus: "Developing analytical thinking, subject depth, and co-curricular participation.",
      areas: ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Sanskrit / Computer Science", "Art & Music", "Physical Education"],
    },
    {
      level: "Secondary (Classes IX – X)",
      color: "#E67E22",
      focus: "Board-oriented rigorous preparation following the CISCE curriculum for Class X ICSE.",
      areas: ["English Language & Literature", "Second Language (Hindi/Sanskrit)", "History & Civics", "Geography", "Mathematics", "Science (Physics, Chemistry, Biology)", "Computer Applications"],
    },
    {
      level: "Senior Secondary (Classes XI – XII)",
      color: "#9B59B6",
      focus: "Specialised stream education with ISC board preparation and career readiness.",
      areas: ["Science Stream: Physics, Chemistry, Biology/Math", "Commerce Stream: Accounts, Business Studies, Economics", "Humanities: History, Political Science, Sociology", "English (compulsory)", "Physical Education (optional)"],
    },
  ];

  const facilities = [
    {
      img: "/photos/science-lab.png",
      title: "State-of-the-Art Science Labs",
      desc: "Fully equipped Physics, Chemistry, and Biology laboratories where students perform hands-on experiments, reinforcing every concept taught in the classroom. Lab sessions are scheduled for all classes from VI onwards.",
      tag: "Laboratories",
    },
    {
      img: "/photos/school-library.png",
      title: "Library — 8,000+ Books & Digital Resources",
      desc: "Our spacious library houses over 8,000 books, encyclopaedias, periodicals, and digital learning resources. Students are encouraged to read widely beyond their syllabus, and library periods are a regular part of the weekly schedule.",
      tag: "Library",
    },
    {
      img: "/photos/smartboard-classroom.png",
      title: "Smart Classrooms & Digital Learning",
      desc: "Every classroom is equipped with a digital smart board and e-learning platform access, enabling multimedia instruction, interactive lessons, and seamless transition between physical and digital content.",
      tag: "Technology",
    },
    {
      img: "/photos/classroom-exam.png",
      title: "Structured Assessment & Exam Preparation",
      desc: "Regular unit tests, half-yearly exams, pre-boards, and board mock papers ensure students are always well-prepared. Our exam system mirrors the exact CISCE format so there are no surprises on the day.",
      tag: "Assessment",
    },
  ];

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Academics · Curriculum</div>
        <h1>Our Curriculum</h1>
        <p>A comprehensive, CISCE-aligned curriculum designed to develop the whole child — from Pre-Primary through to Class XII.</p>
      </section>

      {/* Curriculum levels */}
      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">CISCE Board</span>
          <h2>Curriculum Overview</h2>
          <p>We follow the Council for the Indian School Certificate Examinations (CISCE) framework, combining rigorous academics with co-curricular breadth.</p>
        </div>

        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
          {levels.map((l, i) => (
            <div key={i} className="reveal" style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" }}>
              <div style={{ background: l.color, padding: "18px 28px" }}>
                <h3 style={{ color: l.color === "#F4D03F" ? "var(--ink)" : "#fff", fontSize: "1.1rem", margin: 0 }}>{l.level}</h3>
              </div>
              <div style={{ padding: "20px 28px" }}>
                <p style={{ color: "var(--muted)", marginBottom: 16 }}>{l.focus}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {l.areas.map((a, j) => (
                    <span key={j} style={{ background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 12px", fontSize: ".85rem", color: "var(--ink)" }}>{a}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities with alternating image/text */}
      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Our Facilities</span>
          <h2>World-Class Learning Spaces</h2>
          <p>Our campus is equipped with everything students need to learn deeply, think clearly, and grow fully.</p>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 60 }}>
          {facilities.map((f, i) => (
            <div key={i} className="about-grid reveal" style={{ alignItems: "center" }}>
              {i % 2 === 0 ? (
                <>
                  <div className="about-image">
                    <img src={f.img} alt={f.title} />
                  </div>
                  <div className="about-text">
                    <span style={{ fontSize: ".72rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 700, color: "var(--gold-dk)" }}>{f.tag}</span>
                    <h2 style={{ fontSize: "1.7rem", marginTop: 10, marginBottom: 14 }}>{f.title}</h2>
                    <p style={{ fontSize: "1.02rem", color: "var(--muted)", lineHeight: 1.75 }}>{f.desc}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="about-text">
                    <span style={{ fontSize: ".72rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 700, color: "var(--gold-dk)" }}>{f.tag}</span>
                    <h2 style={{ fontSize: "1.7rem", marginTop: 10, marginBottom: 14 }}>{f.title}</h2>
                    <p style={{ fontSize: "1.02rem", color: "var(--muted)", lineHeight: 1.75 }}>{f.desc}</p>
                  </div>
                  <div className="about-image">
                    <img src={f.img} alt={f.title} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Teaching approach */}
      <section className="section">
        <div className="about-grid" style={{ alignItems: "center" }}>
          <div className="about-image reveal">
            <img src="/photos/students-happy.png" alt="Happy HGSS students" />
          </div>
          <div className="about-text reveal">
            <span className="eyebrow" style={{ color: "var(--gold-dk)", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Our Philosophy</span>
            <h2>Education That Empowers</h2>
            <p>At HGSS we believe every girl has the potential to excel — not just academically, but as a human being. Our curriculum is designed around this belief: rigorous in content, nurturing in spirit.</p>
            <ul style={{ marginTop: 16, paddingLeft: 20, color: "var(--muted)", lineHeight: 2 }}>
              <li>Inquiry-based and activity-led learning</li>
              <li>Regular parent-teacher communication</li>
              <li>Remedial classes for students who need extra support</li>
              <li>Advanced enrichment for high achievers</li>
              <li>Counselling and career guidance from Class IX</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
