const awards = [
  { year: "2025", title: "ICSE Class X — 99.2% pass percentage",      desc: "Top scorer 97.4% · 14 students above 95%", icon: "🏆" },
  { year: "2025", title: "ISC Class XII — 98.7% pass percentage",     desc: "9 students above 95% across Science and Commerce", icon: "🎓" },
  { year: "2024", title: "State Champion — Judo (Sub-Junior)",        desc: "Gold medal at Haryana State Judo Championship", icon: "🥇" },
  { year: "2024", title: "Best Cultural Performance — District",      desc: "First place for folk dance at District Annual Festival", icon: "💃" },
  { year: "2024", title: "NCC — Republic Day Camp Selection",         desc: "Two cadets selected for the RDC parade contingent", icon: "🎖" },
  { year: "2023", title: "National Bal Shree Award",                  desc: "Awarded to Ms. Anjali Kumari for creative writing", icon: "✍" },
  { year: "2023", title: "Inter-School Science Exhibition — Winner",  desc: "First place at Kurukshetra Inter-School Science Mela", icon: "🔬" },
  { year: "2022", title: "50 Years of Educational Excellence",        desc: "Felicitated by the District Education Office", icon: "🏅" },
];

export default function AchievementsPage() {
  return (
    <>
      <section className="page-banner">
        <div className="crumb">About · Achievements</div>
        <h1>Recognised for Excellence — Year After Year</h1>
        <p>A snapshot of our students' achievements in academics, sports, arts and the NCC.</p>
      </section>

      <section className="section">
        <div className="award-list">
          {awards.map((a, i) => (
            <div key={i} className="award-item reveal">
              <div className="award-year">{a.year}</div>
              <div className="award-body">
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
              <div className="award-icon">{a.icon}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
