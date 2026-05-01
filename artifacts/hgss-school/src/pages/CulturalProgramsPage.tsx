export default function CulturalProgramsPage() {
  const featured = [
    {
      name: "Annual Cultural Fest — 'Utsav'",
      desc: "A grand two-day event where students showcase talent in classical dance, drama, music, poetry, and art. Open to parents and the broader Kaithal community.",
      img: "/photos/cultural-bhangra.jpeg",
      icon: "🎭",
    },
    {
      name: "Classical & Folk Dance",
      desc: "Trained classical and folk dance performances — Bharatnatyam, Giddha, and Kathak — presented at school events and inter-school festivals across Haryana.",
      img: "/photos/folk-dance-group.jpeg",
      icon: "💃",
    },
    {
      name: "Drama & Theatre",
      desc: "Annual school play and one-act drama competitions nurture public speaking, confidence, and storytelling. Our drama group won Best Play at the District Youth Festival 2023.",
      img: "/photos/shiva-dance-kids.jpeg",
      icon: "🎬",
    },
    {
      name: "Republic & Patriotic Celebrations",
      desc: "Patriotic cultural performances — tableaux, march-past by NCC cadets, and special skits — mark Republic Day, Independence Day, and Kargil Vijay Diwas with pride.",
      img: "/photos/patriotic-dance.jpeg",
      icon: "🇮🇳",
    },
  ];

  const more = [
    { name: "Vocal & Instrumental Music", desc: "School choir, harmonium, tabla, and vocal classical music classes under trained instructors.", icon: "🎵", img: "/photos/folk-dance-kids.jpeg" },
    { name: "Hindi & Sanskrit Literary Events", desc: "Debate, elocution, essay writing, and poetry recitation celebrating our linguistic heritage.", icon: "📜", img: "/photos/hindi-exhibition.jpeg" },
    { name: "English Debates & MUN", desc: "Regular debate sessions and a Model United Nations programme develop global discourse skills.", icon: "🗣️", img: "/photos/students-traditional.jpeg" },
    { name: "Rangoli & Visual Arts", desc: "Festival rangoli, poster-making, and fine-arts exhibitions held throughout the year.", icon: "🎨", img: "/photos/havan-ceremony.jpeg" },
  ];

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Campus Life · Cultural Programs</div>
        <h1>Cultural Programs</h1>
        <p>Art, music, drama, and literature thrive at HGSS — because culture is the soul of a complete education.</p>
      </section>

      {/* Featured programs with large images */}
      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Arts & Culture</span>
          <h2>Where Talent Meets Tradition</h2>
          <p>Our rich cultural programme ensures every student finds a creative outlet — dance, music, drama, or the visual arts.</p>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 60 }}>
          {featured.map((p, i) => (
            <div key={i} className="about-grid reveal" style={{ alignItems: "center" }}>
              {i % 2 === 0 ? (
                <>
                  <div className="about-image">
                    <img src={p.img} alt={p.name} />
                  </div>
                  <div className="about-text">
                    <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{p.icon}</div>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: 14 }}>{p.name}</h2>
                    <p style={{ fontSize: "1.02rem", color: "var(--muted)", lineHeight: 1.75 }}>{p.desc}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="about-text">
                    <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{p.icon}</div>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: 14 }}>{p.name}</h2>
                    <p style={{ fontSize: "1.02rem", color: "var(--muted)", lineHeight: 1.75 }}>{p.desc}</p>
                  </div>
                  <div className="about-image">
                    <img src={p.img} alt={p.name} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* More programs — card grid with images */}
      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">More Programs</span>
          <h2>Music, Literature & Visual Arts</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {more.map((p, i) => (
            <div key={i} className="feature-card reveal">
              <div className="img">
                <img src={p.img} alt={p.name} />
              </div>
              <div className="body">
                <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
                <h3 style={{ marginTop: 8, fontSize: "1.05rem" }}>{p.name}</h3>
                <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recognition section */}
      <section className="section">
        <div className="about-grid" style={{ alignItems: "center" }}>
          <div className="about-text reveal">
            <span className="eyebrow" style={{ color: "var(--gold-dk)", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Recognition</span>
            <h2>Award-Winning Performances</h2>
            <p>HGSS students have won prizes at district, state, and zonal cultural competitions over the past decade. Our drama group won the Best Play Award at the District Youth Festival in 2023, and our choir took first place at the Haryana School Music Festival in 2022.</p>
            <p style={{ marginTop: 16 }}>We partner with local artists, classical musicians, and theatre professionals to expose our students to the highest standards of creative expression.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              {["Best Play — District Youth Festival 2023", "Choir 1st Place — Haryana School Music Festival 2022", "Giddha Group — District Cultural Championship 2023", "Hindi Elocution Winners — Zonal Meet 2024"].map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: "var(--gold)" }}>★</span>
                  <span style={{ fontWeight: 500 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="about-image reveal">
            <img src="/photos/annual-day-toppers.jpeg" alt="Cultural awards" />
          </div>
        </div>
      </section>

      {/* Upcoming event */}
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
