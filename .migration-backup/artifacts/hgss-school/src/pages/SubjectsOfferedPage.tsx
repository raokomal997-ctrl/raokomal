export default function SubjectsOfferedPage() {
  const streams = [
    {
      name: "Science Stream",
      classes: "XI – XII",
      color: "#3498DB",
      compulsory: ["English", "Physical Education"],
      elective: ["Physics", "Chemistry", "Biology", "Mathematics"],
      careers: ["Medicine", "Engineering", "Research", "Pharmacy"],
    },
    {
      name: "Commerce Stream",
      classes: "XI – XII",
      color: "#2ECC71",
      compulsory: ["English", "Physical Education"],
      elective: ["Accounts", "Business Studies", "Economics", "Mathematics / Informatics Practices"],
      careers: ["Chartered Accountancy", "MBA", "Banking", "Entrepreneurship"],
    },
    {
      name: "Humanities Stream",
      classes: "XI – XII",
      color: "#E67E22",
      compulsory: ["English", "Physical Education"],
      elective: ["History", "Political Science", "Sociology", "Psychology / Geography"],
      careers: ["Civil Services", "Law", "Journalism", "Social Work"],
    },
  ];

  const secondary = [
    "English Language", "English Literature", "Hindi", "Sanskrit",
    "Mathematics", "Physics", "Chemistry", "Biology",
    "History & Civics", "Geography", "Computer Applications",
    "Economic Applications", "Commercial Studies", "Art",
  ];

  const middle = [
    "English", "Hindi", "Mathematics", "Science",
    "Social Studies", "Sanskrit", "Computer Science", "Art & Craft", "Physical Education",
  ];

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Academics · Subjects Offered</div>
        <h1>Subjects Offered</h1>
        <p>A wide range of academic subjects across all levels to suit every student's strengths and aspirations.</p>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Senior Secondary — Classes XI & XII</span>
          <h2>Choose Your Stream</h2>
          <p>Students in Class XI choose from three specialised streams aligned with their career goals.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1100, margin: "0 auto" }} className="streams-grid">
          {streams.map((s, i) => (
            <div key={i} className="reveal" style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" }}>
              <div style={{ background: s.color, padding: "20px 24px" }}>
                <h3 style={{ color: "#fff", margin: 0, fontSize: "1.1rem" }}>{s.name}</h3>
                <p style={{ color: "rgba(255,255,255,.75)", fontSize: ".82rem", marginTop: 4 }}>Classes {s.classes}</p>
              </div>
              <div style={{ padding: "20px 24px" }}>
                <p style={{ fontSize: ".78rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700, marginBottom: 8 }}>Compulsory</p>
                {s.compulsory.map((c, j) => (
                  <span key={j} style={{ display: "inline-block", background: "#f0f0f0", borderRadius: 5, padding: "3px 10px", fontSize: ".82rem", marginRight: 6, marginBottom: 6 }}>{c}</span>
                ))}
                <p style={{ fontSize: ".78rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700, margin: "14px 0 8px" }}>Elective Subjects</p>
                {s.elective.map((e, j) => (
                  <span key={j} style={{ display: "inline-block", background: s.color + "18", border: `1px solid ${s.color}44`, borderRadius: 5, padding: "3px 10px", fontSize: ".82rem", marginRight: 6, marginBottom: 6, color: "var(--ink)" }}>{e}</span>
                ))}
                <p style={{ fontSize: ".78rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700, margin: "14px 0 8px" }}>Career Pathways</p>
                <p style={{ color: s.color, fontSize: ".88rem", fontWeight: 600 }}>{s.careers.join(" · ")}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="subj-lower-grid">
            <div className="reveal">
              <h3 style={{ marginBottom: 18, fontSize: "1.3rem" }}>Secondary — Classes IX & X</h3>
              <p style={{ color: "var(--muted)", marginBottom: 20 }}>Follows the HBSE curriculum for Class X Board Examinations.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {secondary.map((s, i) => (
                  <span key={i} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 13px", fontSize: ".87rem" }}>{s}</span>
                ))}
              </div>
            </div>
            <div className="reveal">
              <h3 style={{ marginBottom: 18, fontSize: "1.3rem" }}>Middle School — Classes VI – VIII</h3>
              <p style={{ color: "var(--muted)", marginBottom: 20 }}>Broad, balanced curriculum building readiness for secondary level.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {middle.map((s, i) => (
                  <span key={i} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 13px", fontSize: ".87rem" }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 800px) { .streams-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 640px) { .subj-lower-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
