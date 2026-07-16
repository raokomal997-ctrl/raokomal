export default function CurriculumPage() {
  const levels = [
    {
      level: "Pre-Primary (Nursery – KG)",
      color: "#F4D03F",
      focus: "Play-based learning, language development, motor skills, and foundational numeracy.",
      areas: ["Phonics & Early Literacy", "Number Sense & Shapes", "Creative Arts & Craft", "Music & Movement", "Environmental Awareness"],
    },
    {
      level: "Primary (Classes I – V)",
      color: "#3498DB",
      focus: "Building strong foundations in core subjects through activity-based and inquiry-led methods, aligned with SCERT/NCERT textbooks.",
      areas: ["English Language & Literature", "Hindi", "Mathematics", "Environmental Studies", "General Knowledge", "Art & Craft", "Physical Education"],
    },
    {
      level: "Middle School (Classes VI – VIII)",
      color: "#2ECC71",
      focus: "Developing analytical thinking, subject depth, and co-curricular participation following the NCERT framework.",
      areas: ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Sanskrit / Computer Science", "Art & Music", "Physical Education"],
    },
    {
      level: "Secondary (Classes IX – X)",
      color: "#E67E22",
      focus: "Rigorous board-oriented preparation following the HBSE curriculum for Class X Board Examinations.",
      areas: ["English Language & Literature", "Hindi", "Mathematics", "Science (Physics, Chemistry, Biology)", "Social Science", "Computer Science"],
    },
    {
      level: "Senior Secondary (Classes XI – XII)",
      color: "#9B59B6",
      focus: "Specialised stream education with HBSE board preparation, career readiness, and CCE-based assessment.",
      areas: ["Arts Stream: History, Political Science, Geography, Economics, Sociology", "Commerce Stream: Accounts, Business Studies, Economics", "English (compulsory)", "Physical Education (optional)"],
    },
  ];

  const affiliationDetails = [
    { label: "Board Name", value: "Haryana Board of School Education (HBSE / BSEH), Bhiwani" },
    { label: "Affiliation Type", value: "Senior Secondary (Class 1st to 12th)" },
    { label: "School UDISE Code", value: "06050205674" },
    { label: "Curriculum", value: "SCERT / NCERT Prescribed Textbooks" },
    { label: "Evaluation System", value: "Continuous and Comprehensive Evaluation (CCE)" },
    { label: "Streams Offered (XI–XII)", value: "Arts & Commerce" },
  ];

  const facilities = [
    {
      img: "/photos/art-class.jpeg",
      title: "State-of-the-Art Science Labs",
      desc: "Fully equipped Physics, Chemistry, and Biology laboratories where students perform hands-on experiments, reinforcing every concept taught in the classroom. Lab sessions are scheduled for all classes from VI onwards.",
      tag: "Laboratories",
    },
    {
      img: "/photos/hindi-exhibition.jpeg",
      title: "Library — 8,000+ Books & Digital Resources",
      desc: "Our spacious library houses over 8,000 books, encyclopaedias, periodicals, and digital learning resources. Students are encouraged to read widely beyond their syllabus, and library periods are a regular part of the weekly schedule.",
      tag: "Library",
    },
    {
      img: "/photos/assembly-building.jpeg",
      title: "Smart Classrooms & Digital Learning",
      desc: "Every classroom is equipped with a digital smart board and e-learning platform access, enabling multimedia instruction, interactive lessons, and seamless transition between physical and digital content.",
      tag: "Technology",
    },
    {
      img: "/photos/students-traditional.jpeg",
      title: "Structured Assessment & Exam Preparation",
      desc: "Regular unit tests, half-yearly exams, pre-boards, and board mock papers ensure students are always well-prepared. Our exam system mirrors the exact HBSE format so there are no surprises on the day.",
      tag: "Assessment",
    },
  ];

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Academics · Curriculum</div>
        <h1>Board Affiliation & Academic Overview</h1>
        <p>Officially affiliated with the Board of School Education Haryana (BSEH), Bhiwani — delivering quality education from Class I to XII.</p>
      </section>

      {/* Board Affiliation Details */}
      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">HBSE / BSEH Affiliation</span>
          <h2>Our Board Affiliation</h2>
          <p>Hindu Girls Senior Secondary School, Ambala Road, Kaithal is officially affiliated with the Board of School Education Haryana (BSEH), Bhiwani — a recognized institution under the State Board committed to high-quality, standards-aligned education.</p>
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div className="reveal" style={{ background: "#fff", borderRadius: 16, boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)", overflow: "hidden" }}>
            <div style={{ background: "var(--maroon, #8B0000)", padding: "20px 32px" }}>
              <h3 style={{ color: "#fff", margin: 0, fontSize: "1.15rem", fontWeight: 700, letterSpacing: ".02em" }}>Affiliation Details</h3>
            </div>
            <div style={{ padding: "8px 0" }}>
              {affiliationDetails.map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: "16px 32px",
                  borderBottom: i < affiliationDetails.length - 1 ? "1px solid var(--border)" : "none",
                  background: i % 2 === 0 ? "var(--cream, #fdf8f0)" : "#fff",
                }}>
                  <span style={{ fontWeight: 700, color: "var(--gold-dk, #9a6e00)", minWidth: 220, fontSize: ".95rem" }}>{item.label}</span>
                  <span style={{ color: "var(--ink)", fontSize: ".95rem", lineHeight: 1.6 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why HBSE Curriculum */}
      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Why Our Curriculum</span>
          <h2>Why Choose Our HBSE Curriculum?</h2>
          <p>Our HBSE-aligned curriculum is designed to foster critical thinking, moral values, and practical knowledge — preparing students for board examinations and beyond.</p>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {[
            { icon: "📋", title: "Standardized Assessment", desc: "Regular unit tests and mock exams to prepare students for the final HBSE Board Examinations with confidence." },
            { icon: "🌱", title: "Inclusive Education", desc: "A curriculum fostering critical thinking, moral values, and practical knowledge for holistic student development." },
            { icon: "📚", title: "SCERT/NCERT Aligned", desc: "Strictly following prescribed textbooks and syllabi to ensure readiness for competitive exams and higher education." },
            { icon: "🏆", title: "Results-Driven", desc: "A consistent track record of high pass percentages and merit positions in Haryana Board results, year after year." },
          ].map((item, i) => (
            <div key={i} className="reveal" style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)", textAlign: "center" }}>
              <div style={{ fontSize: "2.2rem", marginBottom: 14 }}>{item.icon}</div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 10, color: "var(--ink)" }}>{item.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: ".93rem", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum levels */}
      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">HBSE Board</span>
          <h2>Curriculum Overview</h2>
          <p>We follow the Haryana Board of School Education (HBSE) framework with SCERT/NCERT curriculum, combining rigorous academics with co-curricular breadth from Class I to XII.</p>
        </div>

        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
          {levels.map((l, i) => (
            <div key={i} className="reveal" style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" }}>
              <div style={{ background: l.color, padding: "18px 28px" }}>
                <h3 style={{ color: l.color === "#F4D03F" ? "var(--ink)" : "#fff", fontSize: "1.1rem", margin: 0 }}>{l.level}</h3>
              </div>
              <div style={{ padding: "20px 28px" }}>
                <p style={{ color: "var(--muted)", marginBottom: 16 }}>{l.focus}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {l.areas.map((a, j) => (
                    <span key={j} style={{ background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 12px", fontSize: ".85rem", color: "var(--ink)" }}>{a}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities with alternating image/text */}
      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Our Facilities</span>
          <h2>World-Class Learning Spaces</h2>
          <p>Our campus is equipped with everything students need to learn deeply, think clearly, and grow fully.</p>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 60 }}>
          {facilities.map((f, i) => (
            <div key={i} className="about-grid reveal" style={{ alignItems: "center" }}>
              {i % 2 === 0 ? (
                <>
                  <div className="about-image">
                    <img src={f.img} alt={f.title} />
                  </div>
                  <div className="about-text">
                    <span style={{ fontSize: ".72rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 700, color: "var(--gold-dk)" }}>{f.tag}</span>
                    <h2 style={{ fontSize: "1.7rem", marginTop: 10, marginBottom: 14 }}>{f.title}</h2>
                    <p style={{ fontSize: "1.02rem", color: "var(--muted)", lineHeight: 1.75 }}>{f.desc}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="about-text">
                    <span style={{ fontSize: ".72rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 700, color: "var(--gold-dk)" }}>{f.tag}</span>
                    <h2 style={{ fontSize: "1.7rem", marginTop: 10, marginBottom: 14 }}>{f.title}</h2>
                    <p style={{ fontSize: "1.02rem", color: "var(--muted)", lineHeight: 1.75 }}>{f.desc}</p>
                  </div>
                  <div className="about-image">
                    <img src={f.img} alt={f.title} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Teaching approach */}
      <section className="section">
        <div className="about-grid" style={{ alignItems: "center" }}>
          <div className="about-image reveal">
            <img src="/photos/marching-uniform.jpeg" alt="HGSS students" />
          </div>
          <div className="about-text reveal">
            <span className="eyebrow" style={{ color: "var(--gold-dk)", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Our Philosophy</span>
            <h2>Education That Empowers</h2>
            <p>At HGSS we believe every girl has the potential to excel — not just academically, but as a human being. Our curriculum is designed around this belief: rigorous in content, nurturing in spirit.</p>
            <ul style={{ marginTop: 16, paddingLeft: 20, color: "var(--muted)", lineHeight: 2 }}>
              <li>Inquiry-based and activity-led learning</li>
              <li>Regular parent-teacher communication</li>
              <li>Remedial classes for students who need extra support</li>
              <li>Advanced enrichment for high achievers</li>
              <li>Counselling and career guidance from Class IX</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
