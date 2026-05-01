export default function MissionVisionPage() {
  const values = [
    { title: "Integrity", desc: "We act with honesty and uprightness in all our conduct — in the classroom, on the field, and in life.", icon: "⚖️" },
    { title: "Excellence", desc: "We set high standards and encourage every student to consistently strive beyond their comfort zone.", icon: "🏆" },
    { title: "Empathy", desc: "We foster compassion and sensitivity — understanding others is as important as personal achievement.", icon: "🤝" },
    { title: "Discipline", desc: "Self-discipline is the cornerstone of all lasting success — we build it through habit and practice.", icon: "🎯" },
    { title: "Creativity", desc: "We nurture imagination and original thinking in arts, science, and everyday problem-solving.", icon: "🌟" },
    { title: "Patriotism", desc: "We instil a deep love for our nation, its heritage, and a sense of responsibility toward society.", icon: "🇮🇳" },
  ];

  return (
    <>
      <section className="page-banner">
        <div className="crumb">About · Mission & Vision</div>
        <h1>Our Mission & Vision</h1>
        <p>The compass that guides every decision, curriculum, and interaction at Hindu Girls Senior Secondary School.</p>
      </section>

      <section className="section">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 1000, margin: "0 auto" }} className="mv-grid">
          <div className="value-card reveal" style={{ background: "var(--ink)", color: "#fff", padding: 40, borderRadius: 16 }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔭</div>
            <span style={{ fontSize: ".75rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700 }}>Our Vision</span>
            <h2 style={{ color: "#fff", fontSize: "1.6rem", marginTop: 12, marginBottom: 16 }}>To Be the Leading Girls' School in Haryana</h2>
            <p style={{ color: "rgba(255,255,255,.78)", lineHeight: 1.75 }}>
              We envision HGSS as a nationally recognised institution producing graduates who are academically accomplished, culturally rooted, and ready to lead with integrity and courage in a changing world.
            </p>
          </div>
          <div className="value-card reveal" style={{ background: "var(--gold)", color: "var(--ink)", padding: 40, borderRadius: 16 }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🎯</div>
            <span style={{ fontSize: ".75rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--navy)", fontWeight: 700 }}>Our Mission</span>
            <h2 style={{ color: "var(--ink)", fontSize: "1.6rem", marginTop: 12, marginBottom: 16 }}>Educating the Whole Person</h2>
            <p style={{ color: "rgba(19,28,38,.8)", lineHeight: 1.75 }}>
              To provide a safe, joyful, and rigorous learning environment where every girl discovers her strengths through academics, arts, sports, and community service — and leaves as a confident, compassionate, and capable young woman.
            </p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Core Values</span>
          <h2>The Six Pillars of HGSS</h2>
          <p>These values are woven into every aspect of school life — from morning assembly to board exams.</p>
        </div>
        <div className="features-grid" style={{ maxWidth: 1100, margin: "0 auto" }}>
          {values.map((v, i) => (
            <div key={i} className="feature-card reveal" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{v.icon}</div>
              <h4 style={{ marginBottom: 8 }}>{v.title}</h4>
              <p style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.65 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: "var(--ink)", color: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }} className="reveal">
          <div style={{ fontSize: "2rem", marginBottom: 16 }}>📜</div>
          <span style={{ fontSize: ".75rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700 }}>School Motto</span>
          <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", margin: "16px 0 8px" }}>विद्या ददाति विनयम्</h2>
          <p style={{ color: "var(--gold)", fontSize: "1.1rem", fontStyle: "italic", marginBottom: 24 }}>"Knowledge bestows humility."</p>
          <p style={{ color: "rgba(255,255,255,.75)", lineHeight: 1.8 }}>
            Drawn from the Hitopadesha, this motto reminds our community that education is not merely a path to achievement — it is a lifelong practice of learning, growing, and serving others with grace and gratitude.
          </p>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) { .mv-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
