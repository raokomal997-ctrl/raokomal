import { useEffect, useRef, useState } from "react";
import type { Route } from "../App";

type Props = { navigate: (r: Route) => void; openApply: () => void };

const UP = (id: string, size = 64) =>
  `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=crop&q=80`;

const IC: React.CSSProperties = {
  width: 56, height: 56, objectFit: "cover",
  borderRadius: 12, marginBottom: 10, display: "block",
};

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1800;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * end));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(end);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, end]);

  return <span ref={ref}>{n}{suffix}</span>;
}

const KB_SLIDES = [
  { src: "/photos/marching-uniform.jpeg",  dir: "kb-in"  },
  { src: "/photos/assembly-building.jpeg", dir: "kb-out" },
  { src: "/photos/folk-dance-group.jpeg",  dir: "kb-in"  },
  { src: "/photos/ncc-cadets.jpeg",        dir: "kb-out" },
];

const NOTICES = [
  { date: "28 Apr 2025", tag: "Admissions",  text: "Admissions open for session 2025–26. Limited seats in Pre-Primary, Primary & Senior Secondary." },
  { date: "20 Apr 2025", tag: "Exam",        text: "Class X & XII Pre-Board examination schedule released. Download from the notice board." },
  { date: "12 Apr 2025", tag: "Event",       text: "Annual Cultural Fest 'Utsav 2025' — 14–15 November 2025. Registrations begin in September." },
  { date: "05 Apr 2025", tag: "Sports",      text: "District Volleyball Championship: HGSS team qualifies for state-level finals. Congratulations!" },
];

const GALLERY_PHOTOS = [
  { src: "/photos/folk-dance-group.jpeg",    alt: "Folk Dance Group" },
  { src: "/photos/ncc-cadets.jpeg",          alt: "NCC Cadets" },
  { src: "/photos/havan-ceremony.jpeg",      alt: "Havan Ceremony" },
  { src: "/photos/cultural-bhangra.jpeg",    alt: "Bhangra Performance" },
  { src: "/photos/sports-weightlifting.jpeg",alt: "Sports" },
  { src: "/photos/patriotic-dance.jpeg",     alt: "Patriotic Dance" },
];

export default function HomePage({ navigate, openApply }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % KB_SLIDES.length), 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          {KB_SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className={`hero-bg-slide ${slide.dir}${i === current ? " kb-active" : ""}`}
              style={{ backgroundImage: `url(${slide.src})` }}
            />
          ))}
        </div>
        <div className="hero-overlay" />
        <div className="hero-grid">
          <div className="hero-text">
            <span className="eyebrow">HBSE Affiliated · Estd. 1974 · Kaithal, Haryana</span>
            <h1>
              Empowering Girls Through <em>Education, Values & Excellence</em>.
            </h1>
            <p>
              For more than five decades, Hindu Girls Senior Secondary School has been
              shaping confident, capable young women in Kaithal — rooted in Indian
              values and prepared for a global future.
            </p>
            <div className="hero-cta">
              <button className="btn btn-gold" onClick={openApply}>Apply for Admission</button>
              <button className="btn btn-outline" onClick={() => navigate("our-history")}>About Our School</button>
            </div>
          </div>
        </div>
        <div className="hero-kb-dots">
          {KB_SLIDES.map((_, i) => (
            <button key={i} className={`hero-kb-dot${i === current ? " kb-dot-active" : ""}`}
              onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats">
        <div className="stats-grid" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
          <div className="stat"><div className="num"><Counter end={50} suffix="+" /></div><div className="label">Years of Legacy</div></div>
          <div className="stat"><div className="num"><Counter end={1500} suffix="+" /></div><div className="label">Students</div></div>
          <div className="stat"><div className="num"><Counter end={80} suffix="+" /></div><div className="label">Faculty Members</div></div>
          <div className="stat"><div className="num"><Counter end={99} suffix="%" /></div><div className="label">Board Pass Rate</div></div>
          <div className="stat"><div className="num"><Counter end={8} /></div><div className="label">Sports Disciplines</div></div>
          <div className="stat"><div className="num"><Counter end={8} /></div><div className="label">Clubs & Societies</div></div>
        </div>
      </section>

      {/* ── ABOUT OVERVIEW ── */}
      <section className="section">
        <div className="about-grid">
          <div className="about-image reveal">
            <img src="/photos/school-entrance.jpeg" alt="School entrance" />
          </div>
          <div className="about-text reveal">
            <div className="divider" style={{ margin: "0 0 18px" }}></div>
            <span style={{ fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700, color: "var(--gold-dk)" }}>Welcome to HGSS</span>
            <h2 style={{ marginTop: 10 }}>A Legacy Built on Educating Girls Since 1974</h2>
            <p>Founded on Ambala Road, Kaithal, with the conviction that educating a girl is the surest way to uplift a family and community, HGSS has grown into one of Haryana's most trusted schools.</p>
            <p>We follow the <strong>CISCE board</strong> (ICSE & ISC) curriculum from Pre-Primary through Class XII, with a commitment to academic rigour, cultural depth, and holistic development.</p>
            <p>Our motto — <em>विद्या ददाति विनयम्</em> — "Knowledge bestows humility" — guides every classroom, every ceremony, and every interaction on this campus.</p>
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              <button className="btn btn-outline-dark" onClick={() => navigate("our-history")}>Our History</button>
              <button className="btn btn-gold" onClick={() => navigate("principals-message")}>Principal's Message</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK LINKS — OVERVIEW CARDS ── */}
      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Explore HGSS</span>
          <h2>Everything You Need to Know</h2>
          <p>From our rich history to campus life, academics to achievements — discover every corner of our school.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, maxWidth: 1200, margin: "0 auto" }}>
          {[
            { img: UP("1523050854058-8df90110c9f1"), title: "Our History",         desc: "50+ years of shaping young women in Kaithal.",       route: "our-history" as Route },
            { img: UP("1573496359142-b8d87734a5a2"), title: "Principal's Message",  desc: "A warm welcome from the head of our institution.",   route: "principals-message" as Route },
            { img: UP("1522202176988-66273c2fd55f"), title: "Mission & Vision",     desc: "The values and goals that drive everything we do.",   route: "mission-vision" as Route },
            { img: UP("1524178232363-1fb2b075b655"), title: "Faculty & Staff",      desc: "Dedicated educators committed to every student.",    route: "faculty-staff" as Route },
            { img: UP("1481627834876-b7833e8f5570"), title: "Curriculum",           desc: "CISCE-aligned learning from Pre-Primary to Class XII.", route: "curriculum" as Route },
            { img: UP("1532094349884-543bc11b234d"), title: "Subjects Offered",     desc: "Science, Commerce & Humanities streams for XI–XII.",  route: "subjects-offered" as Route },
            { img: UP("1506784983877-45594efa4cbe"), title: "Timetable",            desc: "Our structured daily and weekly school schedule.",    route: "timetable" as Route },
            { img: UP("1434030216411-0b793f4b4173"), title: "Exam Results",         desc: "Outstanding ICSE & ISC board results year after year.", route: "exam-results" as Route },
            { img: UP("1546519638-68e109498ffc"),   title: "Achievements",         desc: "Academic, sports, and cultural accolades.",           route: "achievements" as Route },
            { img: UP("1530103862676-de8c9debad1d"), title: "Events & Activities",  desc: "A vibrant annual calendar of school-wide events.",    route: "events-activities" as Route },
            { img: UP("1461896836934-ffe607ba8211"), title: "Sports",               desc: "8 sports disciplines, courts, and champion teams.",  route: "sports" as Route },
            { img: UP("1518834107812-67b0b7c58434"), title: "Cultural Programs",    desc: "Dance, drama, music, and heritage celebrated.",        route: "cultural-programs" as Route },
            { img: UP("1471341971476-ae15ff5dd4ea"), title: "School Gallery",       desc: "A visual journey through campus life.",               route: "school-gallery" as Route },
            { img: UP("1529156069898-49953e39b3ac"), title: "Clubs & Societies",    desc: "8 clubs from Science to NCC to Literary Society.",    route: "clubs-societies" as Route },
            { img: UP("1454165804606-c3d57bc86b40"), title: "Admissions",           desc: "How to apply, eligibility, and important dates.",     route: "admissions" as Route },
          ].map((c, i) => (
            <div key={i} className="reveal" onClick={() => navigate(c.route)}
              style={{ background: "#fff", borderRadius: 12, padding: "20px 22px", cursor: "pointer", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", transition: "transform .25s ease, box-shadow .25s ease, border-color .25s ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)"; (e.currentTarget as HTMLDivElement).style.borderColor = "var(--gold)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)"; (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; }}
            >
              <img src={c.img} alt={c.title} style={IC} />
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 700, marginBottom: 6 }}>{c.title}</h4>
              <p style={{ color: "var(--muted)", fontSize: ".87rem", lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACADEMICS HIGHLIGHT ── */}
      <section className="section" style={{ background: "var(--ink)" }}>
        <div className="section-head reveal" style={{ color: "#fff" }}>
          <div className="divider"></div>
          <span style={{ color: "var(--gold)", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Academics</span>
          <h2 style={{ color: "#fff", marginTop: 10 }}>World-Class Education Under One Roof</h2>
          <p style={{ color: "rgba(255,255,255,.7)" }}>From playful pre-primary learning to board-level excellence in Science, Commerce, and Humanities.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, maxWidth: 1100, margin: "0 auto" }}>
          {[
            { img: UP("1503676260728-1c00da094a0b"), label: "Pre-Primary",     sub: "Nursery – KG",     route: "curriculum" as Route },
            { img: UP("1481627834876-b7833e8f5570"), label: "Primary",          sub: "Classes I – V",    route: "curriculum" as Route },
            { img: UP("1456513080510-7bf3a84b82f8"), label: "Middle School",    sub: "Classes VI – VIII", route: "curriculum" as Route },
            { img: UP("1434030216411-0b793f4b4173"), label: "Secondary",        sub: "Classes IX – X",   route: "exam-results" as Route },
            { img: UP("1523580494863-6f0b13b5a5c4"), label: "Senior Secondary", sub: "Classes XI – XII", route: "subjects-offered" as Route },
          ].map((l, i) => (
            <div key={i} className="reveal" onClick={() => navigate(l.route)}
              style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "24px 20px", textAlign: "center", cursor: "pointer", transition: "background .2s, border-color .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(244,208,63,.12)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(244,208,63,.3)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,.07)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,.1)"; }}
            >
              <img src={l.img} alt={l.label} style={{ ...IC, margin: "0 auto 10px", borderRadius: 10 }} />
              <h4 style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, marginBottom: 4 }}>{l.label}</h4>
              <p style={{ color: "rgba(255,255,255,.5)", fontSize: ".82rem" }}>{l.sub}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }} className="reveal">
          <button className="btn btn-gold" onClick={() => navigate("curriculum")}>View Full Curriculum</button>
        </div>
      </section>

      {/* ── CAMPUS LIFE HIGHLIGHT ── */}
      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Campus Life</span>
          <h2>Life at HGSS is Full, Rich & Memorable</h2>
          <p>Beyond the classroom — sports, culture, clubs, and events that shape character and create lifelong memories.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card reveal" onClick={() => navigate("sports")}>
            <div className="img"><img src="/photos/sports-weightlifting.jpeg" alt="Sports" /></div>
            <div className="body">
              <span className="tag">Sports</span>
              <h3>Champion Sports Teams</h3>
              <p>8 sports disciplines including Volleyball, Kabaddi, Athletics, Badminton, and more. District & state champions.</p>
              <p style={{ color: "var(--gold-dk)", fontWeight: 600, fontSize: ".88rem", marginTop: 10 }}>Explore Sports →</p>
            </div>
          </div>
          <div className="feature-card reveal" onClick={() => navigate("cultural-programs")}>
            <div className="img"><img src="/photos/folk-dance-group.jpeg" alt="Cultural programs" /></div>
            <div className="body">
              <span className="tag">Culture</span>
              <h3>Rich Cultural Heritage</h3>
              <p>Classical dance, music, drama, Hindi & English debate, and our annual 'Utsav' cultural extravaganza.</p>
              <p style={{ color: "var(--gold-dk)", fontWeight: 600, fontSize: ".88rem", marginTop: 10 }}>Explore Culture →</p>
            </div>
          </div>
          <div className="feature-card reveal" onClick={() => navigate("clubs-societies")}>
            <div className="img"><img src="/photos/ncc-cadets.jpeg" alt="NCC Cadets" /></div>
            <div className="body">
              <span className="tag">Clubs & NCC</span>
              <h3>8 Clubs & NCC Unit</h3>
              <p>Science Club, Literary Club, Eco Club, NCC, Fine Arts, Health Club, Math Club, and Community Service.</p>
              <p style={{ color: "var(--gold-dk)", fontWeight: 600, fontSize: ".88rem", marginTop: 10 }}>Explore Clubs →</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOTICES & ANNOUNCEMENTS ── */}
      <section className="section alt">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, maxWidth: 1200, margin: "0 auto", alignItems: "start" }} className="notice-grid">
          <div>
            <div className="reveal">
              <div className="divider" style={{ margin: "0 0 18px" }}></div>
              <span style={{ fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700, color: "var(--gold-dk)" }}>Latest Updates</span>
              <h2 style={{ marginTop: 10, marginBottom: 28 }}>Notices & Announcements</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {NOTICES.map((n, i) => (
                <div key={i} className="reveal" style={{ background: "#fff", borderRadius: 10, padding: "16px 20px", borderLeft: "4px solid var(--gold)", boxShadow: "var(--shadow-sm)", display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, textAlign: "center", minWidth: 52 }}>
                    <div style={{ background: "var(--ink)", color: "var(--gold)", borderRadius: 8, padding: "6px 8px", fontSize: ".72rem", fontWeight: 700, lineHeight: 1.3 }}>
                      {n.date.split(" ")[0]}<br />{n.date.split(" ")[1]}<br />{n.date.split(" ")[2]}
                    </div>
                  </div>
                  <div>
                    <span style={{ background: "var(--cream)", color: "var(--gold-dk)", fontSize: ".7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, textTransform: "uppercase", letterSpacing: ".1em" }}>{n.tag}</span>
                    <p style={{ marginTop: 6, fontSize: ".9rem", color: "var(--ink)", lineHeight: 1.6 }}>{n.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }} className="reveal">
              <button className="btn btn-outline-dark" onClick={() => navigate("notices")}>View All Notices</button>
            </div>
          </div>

          <div className="reveal">
            <div className="divider" style={{ margin: "0 0 18px" }}></div>
            <span style={{ fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700, color: "var(--gold-dk)" }}>Photo Highlights</span>
            <h2 style={{ marginTop: 10, marginBottom: 28 }}>School Gallery Preview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {GALLERY_PHOTOS.map((p, i) => (
                <div key={i} onClick={() => navigate("school-gallery")} style={{ cursor: "pointer", borderRadius: 8, overflow: "hidden", aspectRatio: "1", position: "relative" }}
                  onMouseEnter={e => { (e.currentTarget.querySelector("img") as HTMLImageElement).style.transform = "scale(1.08)"; }}
                  onMouseLeave={e => { (e.currentTarget.querySelector("img") as HTMLImageElement).style.transform = ""; }}>
                  <img src={p.src} alt={p.alt} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s ease", display: "block" }} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="btn btn-outline-dark" onClick={() => navigate("school-gallery")}>View Full Gallery</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE HGSS ── */}
      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Why HGSS</span>
          <h2>What Makes Our School Different</h2>
          <p>A combination of tradition, academic excellence, and modern infrastructure that no other school in Kaithal offers.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {[
            { img: UP("1523580494863-6f0b13b5a5c4"), title: "CISCE Board Affiliation", desc: "Nationally recognised ICSE & ISC curriculum with consistent 99%+ pass rates." },
            { img: UP("1532094349884-543bc11b234d"), title: "Fully Equipped Labs",     desc: "Physics, Chemistry, Biology & Computer labs for hands-on, practical learning." },
            { img: UP("1481627834876-b7833e8f5570"), title: "8,000+ Book Library",     desc: "A rich library with books, periodicals, and digital resources for all classes." },
            { img: UP("1516321318423-f06f85e504b3"), title: "Smart Classrooms",        desc: "Digital smart boards and e-learning tools integrated into every classroom." },
            { img: UP("1569982175286-3f1b4a4b16a2"), title: "NCC Unit",               desc: "Girls' NCC battalion providing military training, leadership and service." },
            { img: UP("1542601906-bff1a7e60e1d"),   title: "Green Campus",            desc: "A lush, safe, and eco-conscious campus with outdoor play and learning areas." },
            { img: UP("1546519638-68e109498ffc"),   title: "50 Years of Results",     desc: "Generations of alumnae — doctors, officers, educators — across India and beyond." },
            { img: UP("1529156069898-49953e39b3ac"), title: "Affordable Education",    desc: "Quality education accessible to families from all walks of life in Kaithal." },
          ].map((w, i) => (
            <div key={i} className="reveal" style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "22px 20px", boxShadow: "var(--shadow-sm)" }}>
              <img src={w.img} alt={w.title} style={IC} />
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, marginBottom: 6, fontSize: ".98rem" }}>{w.title}</h4>
              <p style={{ color: "var(--muted)", fontSize: ".87rem", lineHeight: 1.6, margin: 0 }}>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACHIEVEMENTS SNAPSHOT ── */}
      <section className="section alt">
        <div className="about-grid">
          <div className="about-text reveal">
            <div className="divider" style={{ margin: "0 0 18px" }}></div>
            <span style={{ fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700, color: "var(--gold-dk)" }}>Awards & Recognition</span>
            <h2 style={{ marginTop: 10 }}>A School That Wins — in Every Field</h2>
            <p>Our students don't just excel in board exams — they bring home trophies, medals, and certificates from districts, states, and national competitions every year.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
              {[
                "99.2% pass rate in ICSE 2024",
                "District Volleyball Champions 2022, 2023",
                "State Kho-Kho Runners-Up 2023",
                "Best Play Award — District Youth Festival 2023",
                "NCC Girls Shooting Distinction 2023",
                "12 Olympiad medals in 2023–24",
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ color: "var(--gold)", fontSize: "1.1rem" }}>★</span>
                  <span style={{ color: "var(--ink)", fontWeight: 500 }}>{a}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <button className="btn btn-gold" onClick={() => navigate("achievements")}>See All Achievements</button>
            </div>
          </div>
          <div className="about-image reveal">
            <img src="/photos/annual-day-toppers.jpeg" alt="Annual day toppers" />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" style={{ background: "var(--ink)" }}>
        <div className="section-head reveal">
          <div className="divider"></div>
          <span style={{ color: "var(--gold)", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Voices</span>
          <h2 style={{ color: "#fff", marginTop: 10 }}>What Our Community Says</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {[
            { quote: "HGSS gave my daughter not just an education, but a purpose and a personality. She passed Class XII with distinction and secured admission to a top college.", name: "Mrs. Anita Rani", role: "Parent, Class XII (2024)" },
            { quote: "The teachers here treat every student like their own child. The balance of academics, sports, and cultural activities is truly unique.", name: "Seema Sharma", role: "Alumna, Batch of 2018" },
            { quote: "My daughter has transformed here — she is confident, curious, and kind. HGSS has instilled values that no textbook can teach.", name: "Mr. Ramesh Kumar", role: "Parent, Class IX" },
          ].map((t, i) => (
            <div key={i} className="reveal" style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "28px 26px" }}>
              <p style={{ color: "rgba(255,255,255,.85)", lineHeight: 1.75, fontStyle: "italic", marginBottom: 20 }}>"{t.quote}"</p>
              <div>
                <p style={{ color: "var(--gold)", fontWeight: 700, margin: 0 }}>{t.name}</p>
                <p style={{ color: "rgba(255,255,255,.45)", fontSize: ".82rem", margin: "3px 0 0" }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section" style={{ textAlign: "center" }}>
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Join HGSS</span>
          <h2>Give Your Daughter the Education She Deserves</h2>
          <p>Admissions are open for session 2025–26. Seats are limited — apply today and secure your daughter's future.</p>
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }} className="reveal">
          <button className="btn btn-gold" onClick={openApply}>Apply for Admission</button>
          <button className="btn btn-outline-dark" onClick={() => navigate("contact")}>Contact Us</button>
        </div>
      </section>
    </>
  );
}
