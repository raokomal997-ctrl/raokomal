const notices = [
  { date: "30 Apr 2026", isNew: true,  text: "Admissions open for Session 2026 – 27 across all classes (Pre-Primary to Class XII). Apply online or visit the school office." },
  { date: "22 Apr 2026", isNew: true,  text: "ICSE & ISC 2026 Results — Congratulations to all students! Mark sheets available from the office between 9 am and 1 pm." },
  { date: "18 Apr 2026", isNew: false, text: "Summer break commences 1 June. Reopening on 1 July for Class III and above; 8 July for Pre-Primary to Class II." },
  { date: "10 Apr 2026", isNew: false, text: "Annual Sports Day photographs and certificates available for collection from the sports department." },
  { date: "02 Apr 2026", isNew: false, text: "Parent-Teacher Meeting (Term 1) for Classes VI – X scheduled for Saturday, 11 April from 9:00 am." },
  { date: "25 Mar 2026", isNew: false, text: "Republic Day / Founder's Day rehearsals — students of the marching contingent to assemble by 6:30 am." },
  { date: "12 Mar 2026", isNew: false, text: "Annual Day 2026 — 'विद्या ददाति विनयम्' — to be held on 18 March in the school auditorium. Parents cordially invited." },
];

function IcPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22"/>
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
    </svg>
  );
}

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
              <div className="pin"><IcPin /></div>
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
