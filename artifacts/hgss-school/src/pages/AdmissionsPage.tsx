import { useState } from "react";

type Props = { openApply: () => void };

const steps = [
  { num: "01", title: "Online Application",  desc: "Fill the admission form on this website. You will receive a reference number on submission." },
  { num: "02", title: "Document Submission", desc: "Visit the school office with the original birth certificate, previous mark sheets and address proof." },
  { num: "03", title: "Interaction",         desc: "Brief age-appropriate interaction with the student and parents (no written test for Pre-Primary to Class II)." },
  { num: "04", title: "Confirmation & Fee",  desc: "Admission letter is issued, followed by fee payment and uniform / book collection." },
];

const fees = [
  {
    level: "Pre-Primary",
    classes: "Nursery – KG",
    color: "#F4D03F",
    icon: "🌱",
    admission: "₹ 8,000",
    tuition: "₹ 18,000",
    monthly: "₹ 1,500",
    exam: "₹ 1,200",
    annual: "₹ 2,500",
    highlight: false,
  },
  {
    level: "Primary",
    classes: "Class I – V",
    color: "#3498DB",
    icon: "📚",
    admission: "₹ 10,000",
    tuition: "₹ 24,000",
    monthly: "₹ 2,000",
    exam: "₹ 1,500",
    annual: "₹ 3,000",
    highlight: false,
  },
  {
    level: "Middle School",
    classes: "Class VI – VIII",
    color: "#2ECC71",
    icon: "🔬",
    admission: "₹ 12,000",
    tuition: "₹ 28,000",
    monthly: "₹ 2,400",
    exam: "₹ 1,800",
    annual: "₹ 3,500",
    highlight: false,
  },
  {
    level: "Secondary",
    classes: "Class IX – X",
    color: "#E67E22",
    icon: "🎯",
    admission: "₹ 15,000",
    tuition: "₹ 34,000",
    monthly: "₹ 2,800",
    exam: "₹ 2,200",
    annual: "₹ 4,000",
    highlight: true,
  },
  {
    level: "Senior Secondary",
    classes: "Class XI – XII",
    color: "#9B59B6",
    icon: "🏆",
    admission: "₹ 18,000",
    tuition: "₹ 42,000",
    monthly: "₹ 3,500",
    exam: "₹ 2,500",
    annual: "₹ 5,000",
    highlight: false,
  },
];

const concessions = [
  { icon: "👭", title: "Sibling Concession", desc: "10% discount on tuition fee for second child; 15% for third child onwards from the same family." },
  { icon: "🥇", title: "Merit Scholarship", desc: "Students scoring 90%+ in previous board / school exams get up to 25% tuition fee waiver." },
  { icon: "🎖️", title: "Staff Ward Benefit", desc: "Children of HGSS teaching and non-teaching staff receive a 50% concession on all fees." },
  { icon: "🤝", title: "EWS Provision", desc: "Seats reserved under the EWS/DG category as per RTE norms with full fee exemption." },
];

const included = [
  "Smart classroom access",
  "Library membership",
  "Sports & games facilities",
  "Cultural event participation",
  "Annual day & prize distribution",
  "Monthly progress reports",
];

const notIncluded = [
  "School uniform & ID card",
  "Textbooks & stationery",
  "Transport (optional)",
  "Exam board registration fees",
  "NCC / extra-curricular material",
];

type View = "cards" | "table";

export default function AdmissionsPage({ openApply }: Props) {
  const [view, setView] = useState<View>("cards");

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Admissions</div>
        <h1>Admissions Open · Session 2026 – 27</h1>
        <p>A simple, transparent admission process for Pre-Primary to Class XII.</p>
      </section>

      {/* ── How to Apply ── */}
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

      {/* ── Fee Structure ── */}
      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Fee Structure</span>
          <h2>Indicative Fees · 2026 – 27</h2>
          <p>All amounts are in Indian Rupees. Final fees are confirmed at the time of admission. GST and government levies, if applicable, will be charged extra.</p>
        </div>

        {/* View Toggle */}
        <div className="reveal" style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 36 }}>
          <button
            onClick={() => setView("cards")}
            style={{
              padding: "9px 22px", border: "1.5px solid var(--border)", borderRadius: "8px 0 0 8px",
              background: view === "cards" ? "var(--ink)" : "var(--bg-card)", color: view === "cards" ? "#fff" : "var(--muted)",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: ".88rem", cursor: "pointer", transition: "all .2s",
            }}
          >
            ☰ Cards View
          </button>
          <button
            onClick={() => setView("table")}
            style={{
              padding: "9px 22px", border: "1.5px solid var(--border)", borderLeft: "none", borderRadius: "0 8px 8px 0",
              background: view === "table" ? "var(--ink)" : "var(--bg-card)", color: view === "table" ? "#fff" : "var(--muted)",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: ".88rem", cursor: "pointer", transition: "all .2s",
            }}
          >
            ⊞ Table View
          </button>
        </div>

        {/* Cards View */}
        {view === "cards" && (
          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20, maxWidth: 1200, margin: "0 auto" }}>
            {fees.map((f) => (
              <div key={f.level} style={{
                background: "var(--bg-card)",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: f.highlight ? "0 8px 32px rgba(0,0,0,.18)" : "var(--shadow-sm)",
                border: f.highlight ? `2px solid ${f.color}` : "1px solid var(--border)",
                position: "relative",
                transform: f.highlight ? "scale(1.03)" : "scale(1)",
                transition: "box-shadow .3s, transform .3s",
              }}>
                {f.highlight && (
                  <div style={{ position: "absolute", top: 12, right: 12, background: f.color, color: "#000", fontSize: ".68rem", fontWeight: 800, padding: "3px 10px", borderRadius: 999, letterSpacing: ".08em", textTransform: "uppercase" }}>
                    Popular
                  </div>
                )}
                <div style={{ background: f.color, padding: "18px 22px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "1.8rem" }}>{f.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.05rem", color: f.color === "#F4D03F" ? "#131C26" : "#fff" }}>{f.level}</div>
                    <div style={{ fontSize: ".8rem", color: f.color === "#F4D03F" ? "rgba(19,28,38,.7)" : "rgba(255,255,255,.8)" }}>{f.classes}</div>
                  </div>
                </div>
                <div style={{ padding: "20px 22px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { label: "Admission Fee", value: f.admission, bold: true },
                      { label: "Annual Tuition", value: f.tuition + " / yr" },
                      { label: "Monthly Fee", value: f.monthly + " / mo" },
                      { label: "Exam Fee", value: f.exam + " / yr" },
                      { label: "Annual Charges", value: f.annual + " / yr" },
                    ].map((row) => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
                        <span style={{ fontSize: ".88rem", color: "var(--muted)" }}>{row.label}</span>
                        <span style={{ fontSize: ".95rem", fontWeight: row.bold ? 700 : 600, color: "var(--ink)" }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {view === "table" && (
          <div className="reveal" style={{ maxWidth: 1000, margin: "0 auto", background: "var(--bg-card)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
                <thead>
                  <tr style={{ background: "var(--ink)" }}>
                    {["Class Group", "Admission Fee", "Annual Tuition", "Monthly Fee", "Exam Fee", "Annual Charges"].map(h => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#fff", fontFamily: "'DM Sans'", fontSize: ".78rem", letterSpacing: ".1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f, i) => (
                    <tr key={f.level} style={{ background: f.highlight ? `${f.color}18` : (i % 2 ? "var(--cream)" : "var(--bg-card)"), borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ width: 10, height: 10, borderRadius: "50%", background: f.color, flexShrink: 0, display: "inline-block" }} />
                          <div>
                            <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: ".95rem" }}>{f.level}</div>
                            <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>{f.classes}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "var(--ink)" }}>{f.admission}</td>
                      <td style={{ padding: "14px 16px", color: "var(--text)" }}>{f.tuition} / yr</td>
                      <td style={{ padding: "14px 16px", color: "var(--text)" }}>{f.monthly} / mo</td>
                      <td style={{ padding: "14px 16px", color: "var(--text)" }}>{f.exam} / yr</td>
                      <td style={{ padding: "14px 16px", color: "var(--text)" }}>{f.annual} / yr</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="reveal" style={{ textAlign: "center", color: "var(--muted)", fontSize: ".85rem", marginTop: 20 }}>
          * All fees are indicative and subject to revision by the school management.
        </p>
      </section>

      {/* ── What's Included ── */}
      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Fee Inclusions</span>
          <h2>What's Covered in Your Fee</h2>
        </div>

        <div className="reveal" style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px 26px", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: "1.4rem" }}>✅</span>
              <h3 style={{ fontSize: "1.05rem", color: "var(--ink)", margin: 0 }}>Included in Fees</h3>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {included.map(item => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text)", fontSize: ".93rem" }}>
                  <span style={{ color: "#2ECC71", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px 26px", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: "1.4rem" }}>🛒</span>
              <h3 style={{ fontSize: "1.05rem", color: "var(--ink)", margin: 0 }}>Charged Separately</h3>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {notIncluded.map(item => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text)", fontSize: ".93rem" }}>
                  <span style={{ color: "var(--muted)", flexShrink: 0 }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Concessions ── */}
      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Scholarships & Concessions</span>
          <h2>Fee Relief Provisions</h2>
          <p>We believe financial constraints should never stop a deserving girl from getting the best education.</p>
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {concessions.map((c, i) => (
            <div key={i} className="reveal" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px 22px", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
              <div style={{ fontSize: "2.4rem", marginBottom: 14 }}>{c.icon}</div>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>{c.title}</h4>
              <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Payment Info ── */}
      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Payment Details</span>
          <h2>Fee Payment Guidelines</h2>
        </div>

        <div className="reveal" style={{ maxWidth: 760, margin: "0 auto", background: "var(--bg-card)", borderRadius: 16, padding: "32px 36px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: "🏦", text: "Fees can be paid via Cash, Demand Draft, or online bank transfer to the school account." },
              { icon: "📅", text: "Monthly fees are due by the 10th of each month. A late fine of ₹ 50/day applies after the due date." },
              { icon: "🔄", text: "Annual fees can be paid in two installments — April and October — at no extra charge." },
              { icon: "🧾", text: "Official receipts are issued for all payments. Keep them safe for future reference." },
              { icon: "📞", text: "For any fee-related queries, contact the school accounts office: +91-9876543210." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", paddingBottom: 16, borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: "1.3rem", flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                <p style={{ color: "var(--text)", margin: 0, lineHeight: 1.7, fontSize: ".95rem" }}>{item.text}</p>
              </div>
            ))}
          </div>
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
