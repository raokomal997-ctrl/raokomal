export default function EventsActivitiesPage() {
  const featured = [
    {
      name: "Annual Sports Day",
      desc: "A full day of inter-house athletics, track events, team sports, and sportsmanship. Every student participates — from sprint races to tug-of-war to drill demonstrations.",
      img: "/photos/marching-uniform.jpeg",
      month: "October",
    },
    {
      name: "Annual Cultural Fest — 'Utsav'",
      desc: "A two-day cultural extravaganza featuring dance, drama, music, debate, and art competitions. Open to parents, alumnae, and the Kaithal community.",
      img: "/photos/folk-dance-group.jpeg",
      month: "November",
    },
    {
      name: "NCC & Patriotic Events",
      desc: "Independence Day, Republic Day, and Kargil Vijay Diwas are marked with flag-hoisting, NCC cadet parades, patriotic songs, and special assemblies.",
      img: "/photos/ncc-cadets.jpeg",
      month: "Jan / Aug",
    },
    {
      name: "Annual Prize Distribution",
      desc: "Academic achievers, sports champions, and co-curricular stars are honoured in a grand ceremony attended by students, parents, faculty, and distinguished guests.",
      img: "/photos/annual-day-toppers.jpeg",
      month: "March",
    },
  ];

  const events = [
    { month: "April",     name: "New Session Inauguration",     icon: "🌸", desc: "Opening assembly, student orientation, and goal-setting for the new academic year." },
    { month: "May",       name: "Annual Science Exhibition",     icon: "🔬", desc: "Students display innovative science projects and models from Classes VI–XII." },
    { month: "July",      name: "Kargil Vijay Diwas",           icon: "🎖️", desc: "Special assembly with NCC cadets honouring India's defence heroes." },
    { month: "September", name: "Teachers' Day",                 icon: "🎓", desc: "Students pay tribute to teachers with skits, songs, and heartfelt appreciation." },
    { month: "December",  name: "Christmas & Winter Festival",  icon: "❄️", desc: "Carol singing, art exhibitions, and a winter fair celebrating diversity." },
    { month: "February",  name: "Inter-School Competitions",    icon: "🥇", desc: "HGSS hosts and competes in quiz, debate, elocution, and creative arts contests." },
  ];

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Campus Life · Events & Activities</div>
        <h1>Events & Activities</h1>
        <p>A vibrant calendar of events ensures that school life at HGSS is as enriching outside the classroom as it is within.</p>
      </section>

      {/* Featured events with alternating image/text */}
      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Signature Events</span>
          <h2>Highlights of the HGSS Calendar</h2>
          <p>These flagship events define the spirit, energy, and community of our school every year.</p>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 60 }}>
          {featured.map((e, i) => (
            <div key={i} className="about-grid reveal" style={{ alignItems: "center" }}>
              {i % 2 === 0 ? (
                <>
                  <div className="about-image">
                    <img src={e.img} alt={e.name} />
                  </div>
                  <div className="about-text">
                    <span style={{ fontSize: ".72rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 700, color: "var(--gold-dk)" }}>{e.month}</span>
                    <h2 style={{ fontSize: "1.8rem", marginTop: 8, marginBottom: 14 }}>{e.name}</h2>
                    <p style={{ fontSize: "1.02rem", color: "var(--muted)", lineHeight: 1.75 }}>{e.desc}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="about-text">
                    <span style={{ fontSize: ".72rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 700, color: "var(--gold-dk)" }}>{e.month}</span>
                    <h2 style={{ fontSize: "1.8rem", marginTop: 8, marginBottom: 14 }}>{e.name}</h2>
                    <p style={{ fontSize: "1.02rem", color: "var(--muted)", lineHeight: 1.75 }}>{e.desc}</p>
                  </div>
                  <div className="about-image">
                    <img src={e.img} alt={e.name} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* More events grid */}
      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Annual Calendar</span>
          <h2>More Events Throughout the Year</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {events.map((e, i) => (
            <div key={i} className="feature-card reveal" style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: 22, cursor: "default", flexDirection: "row" }}>
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

      {/* Co-curricular info */}
      <section className="section">
        <div className="about-grid" style={{ alignItems: "center" }}>
          <div className="about-image reveal">
            <img src="/photos/havan-ceremony.jpeg" alt="School celebration" />
          </div>
          <div className="about-text reveal">
            <span className="eyebrow" style={{ color: "var(--gold-dk)", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Student Leadership</span>
            <h2>Students Plan, Organise & Lead</h2>
            <p>Every event at HGSS is designed with purpose. Students don't just participate — they plan, organise, and lead these activities, developing real-world skills in teamwork, time management, and responsibility.</p>
            <p style={{ marginTop: 16 }}>Our Prefect Council, Cultural Committee, and NCC cadets take active roles in running major school events from inception to execution.</p>
          </div>
        </div>
      </section>
    </>
  );
}
