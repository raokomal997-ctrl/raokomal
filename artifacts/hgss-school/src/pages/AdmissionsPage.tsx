type Props = { openApply: () => void };

const steps = [
  { num: "01", title: "Online Application",  desc: "Fill the admission form on this website. You will receive a reference number on submission." },
  { num: "02", title: "Document Submission", desc: "Visit the school office with the original birth certificate, previous mark sheets and address proof." },
  { num: "03", title: "Interaction",         desc: "Brief age-appropriate interaction with the student and parents (no written test for Pre-Primary to Class II)." },
  { num: "04", title: "Confirmation & Fee",  desc: "Admission letter is issued, followed by fee payment and uniform / book collection." },
];

const fees = [
  { level: "Pre-Primary",       admission: "₹ 8,000",  tuition: "₹ 18,000 / yr" },
  { level: "Primary (1 – 5)",   admission: "₹ 10,000", tuition: "₹ 24,000 / yr" },
  { level: "Middle (6 – 8)",    admission: "₹ 12,000", tuition: "₹ 28,000 / yr" },
  { level: "Class IX – X",      admission: "₹ 15,000", tuition: "₹ 34,000 / yr" },
  { level: "Class XI – XII",    admission: "₹ 18,000", tuition: "₹ 42,000 / yr" },
];

export default function AdmissionsPage({ openApply }: Props) {
  return (
    <>
      <section className="page-banner">
        <div className="crumb">Admissions</div>
        <h1>Admissions Open · Session 2026 – 27</h1>
        <p>A simple, transparent admission process for Pre-Primary to Class XII.</p>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">How To Apply</span>
          <h2>Four Simple Steps</h2>
        </div>
        <div className="programs-list">
          {steps.map((s) => (
            <div key={s.num} className="program-row reveal">
              <div className="program-num">{s.num}</div>
              <div className="program-content">
                <div className="meta">Step {s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 36 }}>
          <button className="btn btn-gold" onClick={openApply}>Start Online Application</button>
        </div>
      </section>

      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Fee Structure</span>
          <h2>Indicative Fees · 2026 – 27</h2>
          <p>Final fees are confirmed at the time of admission. Concessions available for siblings and meritorious students.</p>
        </div>

        <div style={{ maxWidth: 820, margin: "0 auto", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--ink)", color: "#fff" }}>
                <th style={{ padding: "14px 18px", textAlign: "left", fontFamily: "'DM Sans'", fontSize: ".82rem", letterSpacing: ".1em", textTransform: "uppercase" }}>Class</th>
                <th style={{ padding: "14px 18px", textAlign: "left", fontFamily: "'DM Sans'", fontSize: ".82rem", letterSpacing: ".1em", textTransform: "uppercase" }}>Admission</th>
                <th style={{ padding: "14px 18px", textAlign: "left", fontFamily: "'DM Sans'", fontSize: ".82rem", letterSpacing: ".1em", textTransform: "uppercase" }}>Tuition</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f, i) => (
                <tr key={f.level} style={{ background: i % 2 ? "var(--cream)" : "#fff" }}>
                  <td style={{ padding: "14px 18px", fontWeight: 600, color: "var(--ink)" }}>{f.level}</td>
                  <td style={{ padding: "14px 18px", color: "var(--text)" }}>{f.admission}</td>
                  <td style={{ padding: "14px 18px", color: "var(--text)" }}>{f.tuition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="cta-band">
        <h2>Ready to Begin Her Journey at HGSS?</h2>
        <p>Apply online today. Our admissions team will reach out within 2 – 3 working days.</p>
        <button className="btn btn-gold" onClick={openApply}>Apply Online Now</button>
      </section>
    </>
  );
}
