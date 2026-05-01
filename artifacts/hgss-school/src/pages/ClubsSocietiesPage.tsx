export default function ClubsSocietiesPage() {
  const featured = [
    {
      name: "NCC — Girls Battalion",
      tagline: "Unity, Discipline, and National Pride",
      desc: "Our NCC Girls Battalion is one of the most active in Kaithal district. Students undergo rigorous drill, parade, and leadership training that shapes them into confident, disciplined young women. Past cadets have represented Haryana at the Republic Day parade in New Delhi.",
      img: "/photos/ncc-parade.png",
      color: "#2C3E50",
      activities: ["Drill and parade training", "Annual NCC camp", "Republic Day parade march", "Social service activities", "Shooting & trekking camps"],
    },
    {
      name: "Science Club",
      tagline: "Explore. Experiment. Discover.",
      desc: "Weekly experiments, STEM challenges, and Science Olympiad training make the Science Club one of the most popular at HGSS. Students collaborate on innovative projects displayed at our Annual Science Exhibition every May.",
      img: "/photos/science-lab.png",
      color: "#3498DB",
      activities: ["Monthly science fairs", "Science Olympiad training", "Field visits to institutes", "Guest lectures by scientists", "Annual Science Exhibition"],
    },
    {
      name: "Literary Club",
      tagline: "Words that move the world.",
      desc: "From creative writing to school magazine 'Kiran', our Literary Club is the heart of HGSS's intellectual life. Members debate, write poetry, and participate in elocution and essay competitions at district and state level.",
      img: "/photos/school-library.png",
      color: "#E67E22",
      activities: ["School magazine 'Kiran'", "Story-writing contests", "Poetry recitation evenings", "Book club meetings", "State-level essay competitions"],
    },
  ];

  const clubs = [
    { name: "Eco Club",               tagline: "Green campus, green future.",   icon: "🌿", color: "#2ECC71", desc: "Environmental campaigns, tree-plantation drives, waste management, and nature walks around Kaithal." },
    { name: "Cultural & Fine Arts",   tagline: "Creativity in every form.",      icon: "🎨", color: "#9B59B6", desc: "Dance, drama, music, painting — preparing students for all cultural competitions and the annual 'Utsav' fest." },
    { name: "Health & Wellness Club", tagline: "Mind, body, spirit.",            icon: "🧘‍♀️", color: "#E74C3C", desc: "Yoga, meditation, nutrition workshops, and first-aid training for senior students." },
    { name: "Mathematics Club",       tagline: "Numbers are fun.",               icon: "📐", color: "#F39C12", desc: "Math puzzles, problem-solving challenges, and preparation for Math Olympiad and inter-school competitions." },
    { name: "Community Service",      tagline: "Serve. Uplift. Inspire.",        icon: "🤝", color: "#1ABC9C", desc: "Orphanage visits, literacy drives, and village outreach — building compassion and responsibility." },
  ];

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Campus Life · Clubs & Societies</div>
        <h1>Clubs & Societies</h1>
        <p>At HGSS, learning extends well beyond the classroom. Our clubs and societies are where passions are discovered and leaders are made.</p>
      </section>

      {/* Featured clubs with alternating image/text */}
      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Flagship Clubs</span>
          <h2>Our Most Active Societies</h2>
          <p>These three clubs represent the pillars of co-curricular life at HGSS — discipline, discovery, and expression.</p>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 60 }}>
          {featured.map((c, i) => (
            <div key={i} className="about-grid reveal" style={{ alignItems: "center" }}>
              {i % 2 === 0 ? (
                <>
                  <div className="about-image">
                    <img src={c.img} alt={c.name} />
                  </div>
                  <div className="about-text">
                    <span style={{ fontSize: ".72rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 700, color: "var(--gold-dk)" }}>{c.tagline}</span>
                    <h2 style={{ fontSize: "1.7rem", marginTop: 8, marginBottom: 14 }}>{c.name}</h2>
                    <p style={{ fontSize: "1rem", color: "var(--muted)", lineHeight: 1.75 }}>{c.desc}</p>
                    <ul style={{ marginTop: 16, paddingLeft: 18, color: "var(--muted)", lineHeight: 2, fontSize: ".92rem" }}>
                      {c.activities.map((a, j) => <li key={j}>{a}</li>)}
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div className="about-text">
                    <span style={{ fontSize: ".72rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 700, color: "var(--gold-dk)" }}>{c.tagline}</span>
                    <h2 style={{ fontSize: "1.7rem", marginTop: 8, marginBottom: 14 }}>{c.name}</h2>
                    <p style={{ fontSize: "1rem", color: "var(--muted)", lineHeight: 1.75 }}>{c.desc}</p>
                    <ul style={{ marginTop: 16, paddingLeft: 18, color: "var(--muted)", lineHeight: 2, fontSize: ".92rem" }}>
                      {c.activities.map((a, j) => <li key={j}>{a}</li>)}
                    </ul>
                  </div>
                  <div className="about-image">
                    <img src={c.img} alt={c.name} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Remaining clubs as cards */}
      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">More Clubs</span>
          <h2>More Ways to Get Involved</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {clubs.map((c, i) => (
            <div key={i} className="reveal" style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" }}>
              <div style={{ background: c.color, padding: "20px 24px", display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{ fontSize: "2rem" }}>{c.icon}</span>
                <div>
                  <h3 style={{ color: "#fff", margin: 0, fontSize: "1.05rem" }}>{c.name}</h3>
                  <p style={{ color: "rgba(255,255,255,.7)", fontSize: ".8rem", margin: "3px 0 0", fontStyle: "italic" }}>{c.tagline}</p>
                </div>
              </div>
              <div style={{ padding: "18px 24px" }}>
                <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.65 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to join */}
      <section className="section">
        <div className="about-grid" style={{ alignItems: "center" }}>
          <div className="about-image reveal">
            <img src="/photos/students-happy.png" alt="HGSS students" />
          </div>
          <div className="about-text reveal">
            <span className="eyebrow" style={{ color: "var(--gold-dk)", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Join a Club</span>
            <h2>How to Become a Member</h2>
            <p>Club enrolment opens at the start of each academic year in April. Students fill in preference forms during orientation week, and club rosters are announced by mid-April.</p>
            <p style={{ marginTop: 14 }}>Each club meets <strong>once a week</strong> during the dedicated activity period on Saturdays. NCC training follows a separate weekly schedule.</p>
            <p style={{ marginTop: 14, color: "var(--muted)" }}>For details, contact the school office or speak to your class teacher.</p>
          </div>
        </div>
      </section>
    </>
  );
}
