const UP = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=64&h=64&fit=crop&q=80`;

const awards = [
  { year: "2025", title: "ICSE Class X — 99.2% pass percentage",     desc: "Top scorer 97.4% · 14 students above 95%",                    img: UP("1546519638-68e109498ffc") },
  { year: "2025", title: "ISC Class XII — 98.7% pass percentage",    desc: "9 students above 95% across Science and Commerce",             img: UP("1523580494863-6f0b13b5a5c4") },
  { year: "2024", title: "State Champion — Judo (Sub-Junior)",       desc: "Gold medal at Haryana State Judo Championship",                img: UP("1567459399498-64ad4f6f75c9") },
  { year: "2024", title: "Best Cultural Performance — District",     desc: "First place for folk dance at District Annual Festival",        img: UP("1518834107812-67b0b7c58434") },
  { year: "2024", title: "NCC — Republic Day Camp Selection",        desc: "Two cadets selected for the RDC parade contingent",            img: UP("1569982175286-3f1b4a4b16a2") },
  { year: "2023", title: "National Bal Shree Award",                 desc: "Awarded to Ms. Anjali Kumari for creative writing",            img: UP("1455390582262-e3a3ce15d6d4") },
  { year: "2023", title: "Inter-School Science Exhibition — Winner", desc: "First place at Kurukshetra Inter-School Science Mela",         img: UP("1532094349884-543bc11b234d") },
  { year: "2022", title: "50 Years of Educational Excellence",       desc: "Felicitated by the District Education Office",                 img: UP("1523050854058-8df90110c9f1") },
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
              <div className="award-icon">
                <img src={a.img} alt={a.title}
                  style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 10, display: "block" }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
