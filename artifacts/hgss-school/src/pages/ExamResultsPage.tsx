export default function ExamResultsPage() {
  const results = [
    { year: "2024", passRate: "99.2%", distinctions: 87, topScore: "98.6%", topStudent: "Priya Sharma", topStream: "Science" },
    { year: "2023", passRate: "100%", distinctions: 74, topScore: "97.8%", topStudent: "Anjali Verma", topStream: "Commerce" },
    { year: "2022", passRate: "99.6%", distinctions: 68, topScore: "98.2%", topStudent: "Neha Gupta", topStream: "Science" },
    { year: "2021", passRate: "100%", distinctions: 92, topScore: "99.0%", topStudent: "Ritu Rani", topStream: "Science" },
    { year: "2020", passRate: "98.8%", distinctions: 61, topScore: "96.4%", topStudent: "Shikha Devi", topStream: "Humanities" },
  ];

  const isc = [
    { year: "2024", passRate: "98.5%", distinctions: 43, topScore: "96.8%", topStudent: "Kavya Singh", topStream: "Commerce" },
    { year: "2023", passRate: "100%", distinctions: 38, topScore: "97.2%", topStudent: "Simran Kaur", topStream: "Science" },
    { year: "2022", passRate: "99.0%", distinctions: 35, topScore: "95.8%", topStudent: "Pooja Jain", topStream: "Science" },
  ];

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Academics · Exam Results</div>
        <h1>Exam Results</h1>
        <p>Year after year, our students demonstrate outstanding performance in ICSE and ISC board examinations.</p>
      </section>

      <section className="section">
        <div className="stats-grid" style={{ maxWidth: 900, margin: "0 auto 60px", background: "var(--ink)", borderRadius: 16, overflow: "hidden" }}>
          {[
            { num: "99.1%", label: "5-Year Average Pass Rate" },
            { num: "415+", label: "Distinctions (5 Years)" },
            { num: "100%", label: "Pass Rate (3 Years ISC)" },
            { num: "98.6%", label: "Highest ICSE Score 2024" },
          ].map((s, i) => (
            <div key={i} className="stat reveal">
              <div className="num">{s.num}</div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">ICSE (Class X)</span>
          <h2>Board Results — ICSE</h2>
        </div>

        <div style={{ overflowX: "auto", marginBottom: 60 }}>
          <table style={{ width: "100%", maxWidth: 900, margin: "0 auto", borderCollapse: "collapse", fontSize: ".9rem" }} className="reveal">
            <thead>
              <tr style={{ background: "var(--ink)", color: "#fff" }}>
                {["Year", "Pass Rate", "Distinctions", "Top Score", "Top Student", "Stream"].map(h => (
                  <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "var(--cream)", borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700 }}>{r.year}</td>
                  <td style={{ padding: "12px 16px", color: "#2ECC71", fontWeight: 700 }}>{r.passRate}</td>
                  <td style={{ padding: "12px 16px", color: "var(--gold-dk)", fontWeight: 700 }}>{r.distinctions}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{r.topScore}</td>
                  <td style={{ padding: "12px 16px" }}>{r.topStudent}</td>
                  <td style={{ padding: "12px 16px", color: "var(--muted)" }}>{r.topStream}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">ISC (Class XII)</span>
          <h2>Board Results — ISC</h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", maxWidth: 900, margin: "0 auto", borderCollapse: "collapse", fontSize: ".9rem" }} className="reveal">
            <thead>
              <tr style={{ background: "var(--gold)", color: "var(--ink)" }}>
                {["Year", "Pass Rate", "Distinctions", "Top Score", "Top Student", "Stream"].map(h => (
                  <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isc.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "var(--cream)", borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700 }}>{r.year}</td>
                  <td style={{ padding: "12px 16px", color: "#2ECC71", fontWeight: 700 }}>{r.passRate}</td>
                  <td style={{ padding: "12px 16px", color: "var(--gold-dk)", fontWeight: 700 }}>{r.distinctions}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{r.topScore}</td>
                  <td style={{ padding: "12px 16px" }}>{r.topStudent}</td>
                  <td style={{ padding: "12px 16px", color: "var(--muted)" }}>{r.topStream}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Beyond Board Exams</span>
          <h2>Competitive Exam Achievements</h2>
        </div>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { title: "JEE / NEET Qualifiers", desc: "15+ students qualified for JEE / NEET in 2024 from our Science stream batch." },
            { title: "NDA Selections", desc: "3 students selected for National Defence Academy (NDA) in the last 5 years." },
            { title: "State Merit List", desc: "HGSS students have appeared in the Haryana State Merit List consecutively since 2019." },
            { title: "Olympiad Medalists", desc: "12 medals in Science and Math Olympiads at district, state, and national levels in 2023–24." },
          ].map((a, i) => (
            <div key={i} className="value-card reveal" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>🏅</div>
              <div>
                <h4 style={{ marginBottom: 4 }}>{a.title}</h4>
                <p style={{ color: "var(--muted)", margin: 0 }}>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
