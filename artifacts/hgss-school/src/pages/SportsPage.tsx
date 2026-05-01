export default function SportsPage() {
  const sports = [
    { name: "Athletics", desc: "100m, 200m, 400m, relay and long jump events contested in inter-house and district meets.", icon: "🏃‍♀️" },
    { name: "Volleyball", desc: "A strong volleyball programme with regular inter-school tournaments and district-level participation.", icon: "🏐" },
    { name: "Basketball", desc: "Our basketball team competes at the district level with a dedicated court and trained coaches.", icon: "🏀" },
    { name: "Badminton", desc: "Indoor courts for badminton with regular coaching sessions; several state-level qualifiers in recent years.", icon: "🏸" },
    { name: "Kho-Kho", desc: "Traditional Indian sport deeply embedded in our sports curriculum; multiple district championship titles.", icon: "🏅" },
    { name: "Kabaddi", desc: "Our Kabaddi team has been district champions three times in the past five years.", icon: "💪" },
    { name: "Table Tennis", desc: "Indoor table tennis with professional tables; open to all classes as part of sports electives.", icon: "🏓" },
    { name: "Yoga & Aerobics", desc: "Daily yoga sessions and aerobics classes promoting physical and mental well-being for all students.", icon: "🧘‍♀️" },
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

      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Our Sports Programme</span>
          <h2>Sports & Physical Education</h2>
          <p>Every student from Class I to XII participates in physical education classes and has access to our sports facilities.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {sports.map((s, i) => (
            <div key={i} className="feature-card reveal" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.4rem", marginBottom: 12 }}>{s.icon}</div>
              <h4 style={{ marginBottom: 8 }}>{s.name}</h4>
              <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, maxWidth: 980, margin: "0 auto", alignItems: "center" }} className="sports-info-grid">
          <div className="reveal">
            <span className="eyebrow" style={{ color: "var(--gold-dk)", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Facilities</span>
            <h2>World-Class on School Grounds</h2>
            <p>Our campus features dedicated sports infrastructure that rivals top institutions in Haryana:</p>
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
