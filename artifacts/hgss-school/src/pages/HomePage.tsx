import { useEffect, useState } from "react";
import type { Route } from "../App";

type Props = { navigate: (r: Route) => void; openApply: () => void };

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setN(Math.floor(p * end));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end]);
  return <>{n}{suffix}</>;
}

const KB_SLIDES = [
  { src: "/photos/marching-uniform.jpeg",  dir: "kb-in"  },
  { src: "/photos/assembly-building.jpeg", dir: "kb-out" },
  { src: "/photos/folk-dance-group.jpeg",  dir: "kb-in"  },
  { src: "/photos/ncc-cadets.jpeg",        dir: "kb-out" },
];

export default function HomePage({ navigate, openApply }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % KB_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* HERO */}
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
            <span className="eyebrow">CISCE Affiliated · Estd. 1974</span>
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
              <button className="btn btn-outline" onClick={() => navigate("story")}>About Our School</button>
            </div>
          </div>
        </div>

        <div className="hero-kb-dots">
          {KB_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero-kb-dot${i === current ? " kb-dot-active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat"><div className="num"><Counter end={50} suffix="+" /></div><div className="label">Years of Legacy</div></div>
          <div className="stat"><div className="num"><Counter end={1500} suffix="+" /></div><div className="label">Students</div></div>
          <div className="stat"><div className="num"><Counter end={80} suffix="+" /></div><div className="label">Faculty Members</div></div>
          <div className="stat"><div className="num"><Counter end={99} suffix="%" /></div><div className="label">Board Results</div></div>
        </div>
      </section>

      {/* FEATURED HIGHLIGHTS */}
      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Discover</span>
          <h2>Life at HGSS</h2>
          <p>A glimpse of the academics, culture, sports and traditions that make our school special.</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card reveal" onClick={() => navigate("programs-primary")}>
            <div className="img"><img src="/photos/art-class.jpeg" alt="Art class" /></div>
            <div className="body">
              <span className="tag">Academics</span>
              <h3>CISCE Curriculum, Pre-Primary to XII</h3>
              <p>A balanced programme blending strong academics with creative arts, sports, and life skills.</p>
            </div>
          </div>
          <div className="feature-card reveal" onClick={() => navigate("gallery")}>
            <div className="img"><img src="/photos/folk-dance-group.jpeg" alt="Folk dance" /></div>
            <div className="body">
              <span className="tag">Campus Life</span>
              <h3>Festivals, Culture & Tradition</h3>
              <p>From Havan ceremonies to folk dances and Annual Day — culture is woven into daily life.</p>
            </div>
          </div>
          <div className="feature-card reveal" onClick={() => navigate("achievements")}>
            <div className="img"><img src="/photos/judo-winner.jpeg" alt="Judo champion" /></div>
            <div className="body">
              <span className="tag">Achievements</span>
              <h3>State & National Recognition</h3>
              <p>Our girls represent the school in academics, sports, NCC and the performing arts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="cta-band">
        <h2>Admissions Open for 2026 – 27</h2>
        <p>Limited seats across Pre-Primary, Primary, Middle and Senior Secondary classes. Apply early to secure your daughter's place.</p>
        <div className="hero-cta" style={{ justifyContent: "center" }}>
          <button className="btn btn-gold" onClick={openApply}>Apply Now</button>
          <button className="btn btn-outline" onClick={() => navigate("admissions")}>View Admission Details</button>
        </div>
      </section>
    </>
  );
}
