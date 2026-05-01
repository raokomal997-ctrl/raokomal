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

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Academics · Curriculum</div>
        <h1>Our Curriculum</h1>
        <p>A comprehensive, CISCE-aligned curriculum designed to develop the whole child — from Pre-Primary through to Class XII.</p>
      </section>

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
              <div style={{ background: l.color, padding: "18px 28px", display: "flex", alignItems: "center", gap: 12 }}>
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

      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Our Approach</span>
          <h2>Beyond the Textbook</h2>
        </div>
        <div className="features-grid" style={{ maxWidth: 960, margin: "0 auto" }}>
          {[
            { icon: "🧪", title: "Hands-On Labs", desc: "Fully equipped Physics, Chemistry, Biology and Computer labs for experiential learning." },
            { icon: "📖", title: "Rich Library", desc: "A library of 8,000+ books, periodicals, and digital resources accessible to all students." },
            { icon: "💻", title: "Digital Learning", desc: "Smart boards and e-learning platforms integrated into daily instruction across all classes." },
            { icon: "🎨", title: "Arts Integration", desc: "Creative subjects woven into the academic calendar to support whole-brain development." },
          ].map((f, i) => (
            <div key={i} className="feature-card reveal" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{f.icon}</div>
              <h4 style={{ marginBottom: 8 }}>{f.title}</h4>
              <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
