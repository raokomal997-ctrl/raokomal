const UP = (id: string, w = 320, h = 320) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=faces&q=85`;

const faculty = [
  {
    name: "Mrs. Sunita Sharma",
    role: "Principal",
    bio: "M.A., B.Ed. · 32 years in education",
    img: UP("1573496359142-b8d87734a5a2"),
  },
  {
    name: "Mrs. Anjali Verma",
    role: "Vice Principal",
    bio: "M.Sc. Mathematics · 24 years",
    img: UP("1580489944761-15a19d674174"),
  },
  {
    name: "Mr. Rajesh Goel",
    role: "Head — Sciences",
    bio: "M.Sc. Physics, B.Ed. · 18 years",
    img: UP("1507003211169-0a1dd7228f2d"),
  },
  {
    name: "Mrs. Pooja Aggarwal",
    role: "Head — Humanities",
    bio: "M.A. English · 20 years",
    img: UP("1494790108377-be9c29b29330"),
  },
  {
    name: "Mrs. Meena Kaushik",
    role: "Head — Mathematics",
    bio: "M.Sc., M.Phil. · 16 years",
    img: UP("1534528741775-53994a69daeb"),
  },
  {
    name: "Mrs. Kavita Singh",
    role: "Head — Hindi & Sanskrit",
    bio: "M.A. Sanskrit · 22 years",
    img: UP("1438761681033-6461ffad8d80"),
  },
  {
    name: "Mrs. Ritu Bansal",
    role: "Coordinator — Primary Wing",
    bio: "B.El.Ed., M.A. · 15 years",
    img: UP("1551836022-d5d88e9218df"),
  },
  {
    name: "Ms. Neha Chauhan",
    role: "Coordinator — Pre-Primary",
    bio: "Montessori trained · 12 years",
    img: UP("1489424731084-a5d8b06af4d9"),
  },
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
              <div className="team-avatar">
                <img src={f.img} alt={f.name} />
              </div>
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
