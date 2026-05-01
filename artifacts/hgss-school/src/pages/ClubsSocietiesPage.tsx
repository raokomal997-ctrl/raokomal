export default function ClubsSocietiesPage() {
  const clubs = [
    {
      name: "Science Club",
      tagline: "Explore. Experiment. Discover.",
      desc: "Weekly experiments, STEM challenges, science quizzes, and preparation for Science Olympiads. Open to Classes VI–XII.",
      icon: "🔬",
      color: "#3498DB",
      activities: ["Monthly science fairs", "Olympiad training", "Field visits to research institutes", "Guest lectures by scientists"],
    },
    {
      name: "Literary Club",
      tagline: "Words that move the world.",
      desc: "Book discussions, creative writing workshops, poetry sessions, and editorial team for the school magazine.",
      icon: "📚",
      color: "#E67E22",
      activities: ["School magazine 'Kiran'", "Story-writing contests", "Poetry recitation", "Book club meetings"],
    },
    {
      name: "Eco Club",
      tagline: "Green campus, green future.",
      desc: "Environmental awareness campaigns, tree-plantation drives, waste management, and nature walks.",
      icon: "🌿",
      color: "#2ECC71",
      activities: ["Tree plantation drives", "Plastic-free campaigns", "Nature photography", "Clean school initiatives"],
    },
    {
      name: "NCC — Girls Battalion",
      tagline: "Unity and Discipline.",
      desc: "National Cadet Corps unit providing military training, leadership, and national service opportunities to Class IX–XII girls.",
      icon: "🪖",
      color: "#2C3E50",
      activities: ["Drill and parade training", "Annual NCC camp", "Republic Day parade", "Social service activities"],
    },
    {
      name: "Cultural & Fine Arts Club",
      tagline: "Creativity in every form.",
      desc: "Dance, drama, music, painting, and craft — this club prepares students for all cultural competitions and events.",
      icon: "🎨",
      color: "#9B59B6",
      activities: ["Dance & drama rehearsals", "Rangoli competitions", "Inter-school art contests", "Annual cultural fest 'Utsav'"],
    },
    {
      name: "Health & Wellness Club",
      tagline: "Mind, body, spirit.",
      desc: "Yoga, meditation, menstrual health awareness, nutrition workshops, and first-aid training for senior students.",
      icon: "🧘‍♀️",
      color: "#E74C3C",
      activities: ["Daily yoga sessions", "Nutrition & health talks", "First-aid certification", "Mental wellness workshops"],
    },
    {
      name: "Mathematics Club",
      tagline: "Numbers are fun.",
      desc: "Math puzzles, problem-solving challenges, and preparation for Mathematics Olympiad and inter-school competitions.",
      icon: "📐",
      color: "#F39C12",
      activities: ["Weekly Math challenges", "Olympiad preparation", "Logic and puzzle sessions", "Math quiz competitions"],
    },
    {
      name: "Community Service Society",
      tagline: "Serve. Uplift. Inspire.",
      desc: "Regular visits to orphanages, old-age homes, and literacy drives in the community — building compassion and responsibility.",
      icon: "🤝",
      color: "#1ABC9C",
      activities: ["Literacy drives", "Village outreach visits", "Donation campaigns", "Environmental service"],
    },
  ];

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Campus Life · Clubs & Societies</div>
        <h1>Clubs & Societies</h1>
        <p>At HGSS, learning extends well beyond the classroom. Our clubs and societies are where passions are discovered and leaders are made.</p>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Co-Curricular Life</span>
          <h2>Find Your Passion</h2>
          <p>Every student from Class VI onwards is encouraged to join at least one club and take an active role in its activities.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
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
                <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.65, marginBottom: 14 }}>{c.desc}</p>
                <p style={{ fontSize: ".72rem", letterSpacing: ".13em", textTransform: "uppercase", color: c.color, fontWeight: 700, marginBottom: 8 }}>Key Activities</p>
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  {c.activities.map((a, j) => (
                    <li key={j} style={{ color: "var(--ink)", fontSize: ".86rem", marginBottom: 4 }}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }} className="reveal">
          <div className="divider" style={{ margin: "0 auto 16px" }}></div>
          <span className="eyebrow" style={{ color: "var(--gold-dk)" }}>How to Join</span>
          <h2>Become a Member</h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.8 }}>Club enrolment opens at the start of each academic year in April. Students fill in their preference forms during the orientation week, and club rosters are announced by mid-April. Each club meets once a week during the dedicated activity period on Saturdays.</p>
          <p style={{ marginTop: 16, color: "var(--muted)", lineHeight: 1.8 }}>For more details, contact the school office or speak to your class teacher.</p>
        </div>
      </section>
    </>
  );
}
