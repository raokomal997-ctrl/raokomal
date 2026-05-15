export default function OurHistoryPage() {
  const milestones = [
    { year: "1974", title: "Foundation", desc: "Hindu Girls Senior Secondary School is established on Ambala Road, Kaithal, with a vision to educate girls from all sections of society." },
    { year: "1980", title: "First Board Results", desc: "Our first batch of Class X students appears for the HBSE board examinations — achieving a 100% pass rate that set a lasting benchmark." },
    { year: "1988", title: "Senior Secondary Wing", desc: "Classes XI and XII (Science & Commerce streams) are introduced, extending the school's reach to higher secondary education." },
    { year: "1995", title: "New Academic Block", desc: "A modern three-storey academic block with science laboratories, a computer room, and a dedicated library is inaugurated." },
    { year: "2003", title: "Sports Complex", desc: "A multi-purpose indoor sports hall, volleyball courts, and an athletics track are added to promote physical education and inter-school competitions." },
    { year: "2010", title: "Smart Classrooms", desc: "Digital smart boards and projector systems are installed across all classrooms, modernising the teaching environment." },
    { year: "2015", title: "NCC Unit Established", desc: "A National Cadet Corps (NCC) unit is inaugurated, offering girls leadership training, discipline and national service opportunities." },
    { year: "2019", title: "500+ Distinction Students", desc: "The school celebrates a milestone of over 500 students achieving distinction in HBSE board examinations over the decade." },
    { year: "2024", title: "Golden Jubilee", desc: "HGSS celebrates 50 years of educating girls — a landmark occasion with 1,500+ students, 80+ faculty, and generations of accomplished alumnae." },
  ];

  return (
    <>
      <section className="page-banner">
        <div className="crumb">About · Our History</div>
        <h1>Fifty Years of Purpose & Pride</h1>
        <p>From a humble beginning in 1974 to one of Kaithal's most trusted institutions — a journey shaped by dedication.</p>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Milestones</span>
          <h2>Our Journey Through the Decades</h2>
          <p>Every chapter of our history reflects a commitment to the girls, families, and community we serve.</p>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <div style={{ position: "absolute", left: 28, top: 0, bottom: 0, width: 2, background: "var(--gold)", opacity: .25 }} />
          {milestones.map((m, i) => (
            <div key={i} className="reveal" style={{ display: "flex", gap: 32, marginBottom: 40, paddingLeft: 16 }}>
              <div style={{ flexShrink: 0, width: 60, height: 60, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: ".85rem", color: "var(--ink)", boxShadow: "0 4px 16px rgba(244,208,63,.4)", zIndex: 1 }}>
                {m.year}
              </div>
              <div style={{ paddingTop: 14 }}>
                <h4 style={{ marginBottom: 6, fontSize: "1.1rem" }}>{m.title}</h4>
                <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="about-grid">
          <div className="about-image reveal">
            <img src="/photos/school-entrance.jpeg" alt="School entrance" />
          </div>
          <div className="about-text reveal">
            <span className="eyebrow" style={{ color: "var(--gold-dk)", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Our Motto</span>
            <h2>विद्या ददाति विनयम्</h2>
            <p style={{ fontSize: "1.15rem", fontStyle: "italic", color: "var(--muted)", marginBottom: 16 }}>"Knowledge bestows humility."</p>
            <p>This ancient Sanskrit proverb from the Hitopadesha has guided every generation of students at HGSS. We believe that true learning produces not just academic excellence, but character — humility, empathy, and service.</p>
            <p style={{ marginTop: 16 }}>Today, our alumnae serve as doctors, educators, engineers, officers, and community leaders across India and abroad — each carrying the values instilled here.</p>
          </div>
        </div>
      </section>
    </>
  );
}
