const notices = [
  { date: "30 Apr 2026", isNew: true,  text: "Admissions open for Session 2026 – 27 across all classes (Pre-Primary to Class XII). Apply online or visit the school office." },
  { date: "22 Apr 2026", isNew: true,  text: "ICSE & ISC 2026 Results — Congratulations to all students! Mark sheets available from the office between 9 am and 1 pm." },
  { date: "18 Apr 2026", isNew: false, text: "Summer break commences 1 June. Reopening on 1 July for Class III and above; 8 July for Pre-Primary to Class II." },
  { date: "10 Apr 2026", isNew: false, text: "Annual Sports Day photographs and certificates available for collection from the sports department." },
  { date: "02 Apr 2026", isNew: false, text: "Parent-Teacher Meeting (Term 1) for Classes VI – X scheduled for Saturday, 11 April from 9:00 am." },
  { date: "25 Mar 2026", isNew: false, text: "Republic Day / Founder's Day rehearsals — students of the marching contingent to assemble by 6:30 am." },
  { date: "12 Mar 2026", isNew: false, text: "Annual Day 2026 — 'विद्या ददाति विनयम्' — to be held on 18 March in the school auditorium. Parents cordially invited." },
];

export default function NoticesPage() {
  return (
    <>
      <section className="page-banner">
        <div className="crumb">Campus Life · Notice Board</div>
        <h1>Notices, Circulars & Announcements</h1>
        <p>Stay updated on dates, results, holidays, meetings and school events.</p>
      </section>

      <section className="section">
        <div className="notice-list">
          {notices.map((n, i) => (
            <div key={i} className="notice-card reveal">
              <div className="pin">📌</div>
              <div>
                <div className={`date ${n.isNew ? "new" : ""}`}>{n.isNew ? "NEW · " : ""}{n.date}</div>
                <div className="text">{n.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
