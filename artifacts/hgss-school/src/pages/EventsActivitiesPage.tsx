export default function EventsActivitiesPage() {
  const events = [
    { month: "April", name: "New Session Inauguration", desc: "Opening of the academic year with a prayer assembly, welcoming new students and outlining the year's goals.", icon: "🌸" },
    { month: "May", name: "Annual Science Exhibition", desc: "Students from Class VI–XII display innovative science projects and models, fostering curiosity and research skills.", icon: "🔬" },
    { month: "July", name: "Kargil Vijay Diwas", desc: "A special assembly with NCC cadets, honouring the sacrifices of Indian soldiers and instilling patriotism.", icon: "🇮🇳" },
    { month: "August", name: "Independence Day Celebration", desc: "Flag hoisting, cultural programmes, patriotic songs, and speeches marking India's Independence Day.", icon: "🎉" },
    { month: "September", name: "Teachers' Day", desc: "Students pay tribute to their teachers with skits, songs, and heartfelt appreciation programmes.", icon: "🎓" },
    { month: "October", name: "Annual Sports Day", desc: "Inter-house athletics, track events, and team sports — a full day of competition and sportsmanship.", icon: "🏃‍♀️" },
    { month: "November", name: "Annual Cultural Fest — 'Utsav'", desc: "A grand two-day cultural extravaganza featuring dance, drama, music, debate, and art competitions.", icon: "🎭" },
    { month: "December", name: "Christmas & Winter Festival", desc: "Carol singing, art exhibitions, and a winter fair celebrating diversity and community spirit.", icon: "❄️" },
    { month: "January", name: "Republic Day", desc: "Flag-hoisting ceremony, parade by NCC cadets, and patriotic cultural performances.", icon: "🎆" },
    { month: "February", name: "Inter-School Competitions", desc: "HGSS hosts and participates in district-level quiz, debate, elocution, and creative arts contests.", icon: "🥇" },
    { month: "March", name: "Annual Prize Distribution", desc: "Academic achievers, sports champions, and co-curricular stars are honoured at the Annual Prize Giving ceremony.", icon: "🏆" },
  ];

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Campus Life · Events & Activities</div>
        <h1>Events & Activities</h1>
        <p>A vibrant calendar of events ensures that school life at HGSS is as enriching outside the classroom as it is within.</p>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Annual Calendar</span>
          <h2>The HGSS Events Calendar</h2>
          <p>From patriotic observances to cultural festivals — every month brings opportunities to learn, celebrate, and grow.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {events.map((e, i) => (
            <div key={i} className="feature-card reveal" style={{ display: "flex", gap: 16, alignItems: "flex-start", textAlign: "left" }}>
              <div style={{ fontSize: "2rem", flexShrink: 0 }}>{e.icon}</div>
              <div>
                <span style={{ fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold-dk)", fontWeight: 700 }}>{e.month}</span>
                <h4 style={{ margin: "4px 0 8px", fontSize: "1rem" }}>{e.name}</h4>
                <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.6, margin: 0 }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="about-grid">
          <div className="about-image reveal">
            <img src="/photos/havan-ceremony.jpeg" alt="School celebration" />
          </div>
          <div className="about-text reveal">
            <span className="eyebrow" style={{ color: "var(--gold-dk)", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Co-Curricular</span>
            <h2>More Than a School Event</h2>
            <p>Every event at HGSS is designed with purpose — building confidence, teamwork, leadership, and a sense of community. Students don't just participate; they plan, organise, and lead these activities, developing real-world skills.</p>
            <p style={{ marginTop: 16 }}>Our Prefect Council, Cultural Committee, and NCC cadets take active responsibility in running major school events from inception to execution.</p>
          </div>
        </div>
      </section>
    </>
  );
}
