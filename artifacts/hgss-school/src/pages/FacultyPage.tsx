const faculty = [
  { name: "Mrs. Sunita Sharma",  role: "Principal",          bio: "M.A., B.Ed. · 32 years in education" },
  { name: "Mrs. Anjali Verma",   role: "Vice Principal",     bio: "M.Sc. Mathematics · 24 years" },
  { name: "Mr. Rajesh Goel",     role: "Head — Sciences",    bio: "M.Sc. Physics, B.Ed. · 18 years" },
  { name: "Mrs. Pooja Aggarwal", role: "Head — Humanities",  bio: "M.A. English · 20 years" },
  { name: "Mrs. Meena Kaushik",  role: "Head — Mathematics", bio: "M.Sc., M.Phil. · 16 years" },
  { name: "Mrs. Kavita Singh",   role: "Head — Hindi & Sanskrit", bio: "M.A. Sanskrit · 22 years" },
  { name: "Mrs. Ritu Bansal",    role: "Coordinator — Primary Wing", bio: "B.El.Ed., M.A. · 15 years" },
  { name: "Ms. Neha Chauhan",    role: "Coordinator — Pre-Primary",  bio: "Montessori trained · 12 years" },
];

export default function FacultyPage() {
  return (
    <>
      <section className="page-banner">
        <div className="crumb">About · Our Faculty</div>
        <h1>Teachers Who Inspire, Mentors Who Care</h1>
        <p>Over 80 dedicated educators guide our students through academics, arts and life.</p>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Leadership</span>
          <h2>Meet the Heads of Department</h2>
          <p>Each department is led by experienced educators committed to academic rigour and student wellbeing.</p>
        </div>

        <div className="team-grid">
          {faculty.map((f) => (
            <div key={f.name} className="team-card reveal">
              <div className="team-avatar">{f.name.split(" ").slice(-2, -1)[0]?.[0] || "·"}</div>
              <h3>{f.name}</h3>
              <div className="role">{f.role}</div>
              <p>{f.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="container-narrow" style={{ textAlign: "center" }}>
          <div className="divider"></div>
          <h2 style={{ fontSize: "1.8rem", marginBottom: 14 }}>Built by 80+ Educators, Trainers & Coaches</h2>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>
            From subject teachers and laboratory assistants to dance, music, art, sports
            and NCC instructors — our team is united by a single goal: to help every
            student here discover and develop her best self.
          </p>
        </div>
      </section>
    </>
  );
}
