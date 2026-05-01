export default function SportsPage() {
  const featured = [
    {
      name: "Athletics & Track Events",
      desc: "100m, 200m, 400m sprint, relay races, and long jump contested in inter-house meets and district championships. Our athletes have won gold in the District Athletics Championship.",
      img: "/photos/marching-uniform.jpeg",
      icon: "🏃‍♀️",
    },
    {
      name: "Volleyball & Team Sports",
      desc: "Our volleyball team has been District Volleyball Champions in 2022 and 2023. Students train under qualified coaches and compete regularly at state-level tournaments.",
      img: "/photos/ncc-cadets.jpeg",
      icon: "🏐",
    },
    {
      name: "Martial Arts & Combat Sports",
      desc: "Judo and other martial arts are offered as part of our physical education programme, producing district and state level medal winners year after year.",
      img: "/photos/judo-winner.jpeg",
      icon: "🥋",
    },
    {
      name: "Weightlifting & Fitness",
      desc: "A dedicated fitness and weightlifting programme for senior students, producing state-level competitors and helping girls build strength, endurance, and confidence.",
      img: "/photos/sports-weightlifting.jpeg",
      icon: "🏋️‍♀️",
    },
  ];

  const sports = [
    { name: "Badminton",    desc: "Indoor courts; several state-level qualifiers in recent years.",       icon: "🏸" },
    { name: "Kho-Kho",      desc: "District championship titles; state runners-up 2023.",                 icon: "🏅" },
    { name: "Kabaddi",      desc: "District champions three times in the past five years.",               icon: "💪" },
    { name: "Table Tennis", desc: "Professional tables; open to all classes as sports elective.",         icon: "🏓" },
    { name: "Basketball",   desc: "Dedicated court; district-level participation.",                       icon: "🏀" },
    { name: "Yoga & Aerobics", desc: "Daily yoga sessions promoting physical and mental well-being.",    icon: "🧘‍♀️" },
  ];

  const achievements = [
    "District Volleyball Champions — 2023, 2022",
    "State Kho-Kho Runners-Up — 2023",
    "District Athletics Gold — 400m Relay — 2024",
    "Kabaddi District Champions — 2021, 2022, 2023",
    "Inter-School Badminton Trophy — 2024",
    "NCC Girls Shooting Distinction — 2023",
  ];

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Campus Life · Sports</div>
        <h1>Sports at HGSS</h1>
        <p>We believe a healthy body nurtures a sharp mind. Sports are central to life at Hindu Girls Senior Secondary School.</p>
      </section>

      {/* Stats */}
      <section className="stats" style={{ padding: "0" }}>
        <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", maxWidth: 900 }}>
          {[
            { num: "8", label: "Sports Disciplines" },
            { num: "3×", label: "Kabaddi District Champs" },
            { num: "2×", label: "Volleyball Dist. Champs" },
            { num: "100+", label: "Medals Won (5 Years)" },
          ].map((s, i) => (
            <div key={i} className="stat">
              <div className="num">{s.num}</div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured sports with alternating image/text */}
      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Our Sports Programme</span>
          <h2>Sports & Physical Education</h2>
          <p>Every student from Class I to XII participates in physical education. Senior students can specialise in their chosen sport.</p>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 60 }}>
          {featured.map((s, i) => (
            <div key={i} className="about-grid reveal" style={{ alignItems: "center" }}>
              {i % 2 === 0 ? (
                <>
                  <div className="about-image">
                    <img src={s.img} alt={s.name} />
                  </div>
                  <div className="about-text">
                    <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{s.icon}</div>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: 14 }}>{s.name}</h2>
                    <p style={{ fontSize: "1.02rem", color: "var(--muted)", lineHeight: 1.75 }}>{s.desc}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="about-text">
                    <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{s.icon}</div>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: 14 }}>{s.name}</h2>
                    <p style={{ fontSize: "1.02rem", color: "var(--muted)", lineHeight: 1.75 }}>{s.desc}</p>
                  </div>
                  <div className="about-image">
                    <img src={s.img} alt={s.name} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* More sports grid */}
      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">All Sports</span>
          <h2>More Sports We Offer</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {sports.map((s, i) => (
            <div key={i} className="feature-card reveal" style={{ textAlign: "center", cursor: "default" }}>
              <div style={{ padding: "28px 22px 0" }}>
                <div style={{ fontSize: "2.4rem", marginBottom: 12 }}>{s.icon}</div>
                <h4 style={{ marginBottom: 8 }}>{s.name}</h4>
                <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.6, paddingBottom: 22 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements + Facilities */}
      <section className="section">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, maxWidth: 980, margin: "0 auto", alignItems: "center" }} className="sports-info-grid">
          <div className="reveal">
            <span className="eyebrow" style={{ color: "var(--gold-dk)", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Facilities</span>
            <h2>World-Class on School Grounds</h2>
            <p>Our campus features dedicated sports infrastructure:</p>
            <ul style={{ marginTop: 16, paddingLeft: 20, color: "var(--muted)", lineHeight: 2 }}>
              <li>Multi-purpose synthetic sports ground</li>
              <li>Volleyball & Basketball courts</li>
              <li>Indoor badminton & table tennis hall</li>
              <li>Athletics track (100m sprint lane)</li>
              <li>Yoga & aerobics studio</li>
              <li>Changing rooms & first-aid station</li>
            </ul>
          </div>
          <div className="reveal">
            <span className="eyebrow" style={{ color: "var(--gold-dk)", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Recent Achievements</span>
            <h2>Winning on Every Front</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
              {achievements.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ color: "var(--gold)", fontSize: "1.1rem" }}>🏆</span>
                  <span style={{ color: "var(--ink)", fontWeight: 500 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) { .sports-info-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
