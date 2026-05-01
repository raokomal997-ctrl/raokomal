export default function CulturalProgramsPage() {
  const programs = [
    { name: "Annual Cultural Fest — 'Utsav'", desc: "A grand two-day event where students showcase talent in classical dance, drama, music, poetry, and art. Open to parents and the community.", icon: "🎭" },
    { name: "Classical Dance", desc: "Trained classical and folk dance performances — Bharatnatyam, Giddha, and Kathak — presented at school events and inter-school festivals.", icon: "💃" },
    { name: "Vocal & Instrumental Music", desc: "Dedicated music periods and a school choir. Students learn harmonium, tabla, and vocal classical music under trained instructors.", icon: "🎵" },
    { name: "Drama & Theatre", desc: "Annual school play and one-act drama competitions nurture public speaking, confidence, and storytelling skills.", icon: "🎬" },
    { name: "Hindi & Sanskrit Literary Events", desc: "Debate, elocution, essay writing, and poetry recitation in Hindi and Sanskrit celebrating our linguistic heritage.", icon: "📜" },
    { name: "English Debates & MUN", desc: "Regular English debate sessions and a Model United Nations programme prepare students for global-level public discourse.", icon: "🗣️" },
    { name: "Rangoli & Visual Arts", desc: "Festival rangoli competitions, poster-making, and fine arts exhibitions held throughout the academic year.", icon: "🎨" },
    { name: "Republic & Independence Day Programmes", desc: "Patriotic cultural performances including tableaux, march-past, and special skits honouring national occasions.", icon: "🇮🇳" },
  ];

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Campus Life · Cultural Programs</div>
        <h1>Cultural Programs</h1>
        <p>Art, music, drama, and literature thrive at HGSS — because culture is the soul of a complete education.</p>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Arts & Culture</span>
          <h2>Where Talent Meets Tradition</h2>
          <p>Our rich cultural programme ensures that every student finds a creative outlet — be it dance, music, drama, or the visual arts.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {programs.map((p, i) => (
            <div key={i} className="feature-card reveal">
              <div style={{ fontSize: "2.2rem", marginBottom: 12 }}>{p.icon}</div>
              <h4 style={{ marginBottom: 8 }}>{p.name}</h4>
              <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.65 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="about-grid">
          <div className="about-image reveal">
            <img src="/photos/havan-ceremony.jpeg" alt="Cultural program" />
          </div>
          <div className="about-text reveal">
            <span className="eyebrow" style={{ color: "var(--gold-dk)", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Recognition</span>
            <h2>Award-Winning Performances</h2>
            <p>HGSS students have won prizes at district, state, and zonal cultural competitions over the past decade. Our drama group won the Best Play Award at the District Youth Festival in 2023, and our choir took first place at the Haryana School Music Festival in 2022.</p>
            <p style={{ marginTop: 16 }}>We partner with local artists, classical musicians, and theatre professionals to expose our students to the highest standards of creative expression.</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--ink)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }} className="reveal">
          <h2 style={{ color: "#fff", marginBottom: 12 }}>Upcoming: <span style={{ color: "var(--gold)" }}>Utsav 2025</span></h2>
          <p style={{ color: "rgba(255,255,255,.72)", fontSize: "1.05rem", marginBottom: 28 }}>
            Our annual cultural extravaganza returns this November — two days of music, dance, drama, and celebration. Open to students, parents, alumnae, and the broader Kaithal community.
          </p>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {["Date: 14–15 Nov 2025", "Venue: HGSS Main Hall", "Open to All"].map((d, i) => (
              <div key={i} style={{ background: "rgba(244,208,63,.12)", border: "1px solid rgba(244,208,63,.25)", borderRadius: 8, padding: "10px 20px", color: "var(--gold)", fontSize: ".88rem", fontWeight: 600 }}>{d}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
