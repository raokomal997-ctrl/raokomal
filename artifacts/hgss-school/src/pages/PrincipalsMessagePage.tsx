import React from "react";

const UP = (id: string, w = 320, h = 320) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=faces&q=85`;

const IC: React.CSSProperties = {
  width: 56, height: 56, objectFit: "cover",
  borderRadius: 12, display: "block",
  margin: "0 auto 12px",
};

export default function PrincipalsMessagePage() {
  return (
    <>
      <section className="page-banner">
        <div className="crumb">About · Principal's Message</div>
        <h1>A Message from the Principal</h1>
        <p>Guidance, vision, and a warm welcome from the helm of our institution.</p>
      </section>

      <section className="section">
        <div className="about-grid" style={{ alignItems: "flex-start" }}>
          <div className="about-image reveal" style={{ textAlign: "center" }}>
            <img
              src={UP("1573496359142-b8d87734a5a2", 480, 480)}
              alt="Mrs. Sunita Sharma — Principal"
              style={{
                borderRadius: "50%",
                width: 240, height: 240,
                objectFit: "cover",
                objectPosition: "center top",
                border: "4px solid var(--gold)",
                margin: "0 auto",
                display: "block",
                boxShadow: "0 10px 32px rgba(0,0,0,.18)",
              }}
            />
            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontSize: "1.2rem" }}>Mrs. Sunita Sharma</h3>
              <p style={{ color: "var(--muted)", fontSize: ".9rem", marginTop: 4 }}>M.A., B.Ed. — Principal, HGSS Kaithal</p>
              <p style={{ color: "var(--gold-dk)", fontSize: ".85rem", marginTop: 4 }}>32+ Years in Education</p>
            </div>
          </div>

          <div className="about-text reveal">
            <span className="eyebrow" style={{ color: "var(--gold-dk)", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Principal's Message</span>
            <h2>Dear Students, Parents & Well-Wishers,</h2>
            <p>Welcome to Hindu Girls Senior Secondary School — an institution that has been nurturing young women for over five decades. It gives me immense pride to lead this school that stands as a beacon of quality education, values, and empowerment in Kaithal.</p>
            <p style={{ marginTop: 16 }}>Education, to me, is far more than the accumulation of knowledge. It is the cultivation of character. At HGSS, we work every day to create an environment where each girl feels safe, seen, and inspired — where curiosity is encouraged, discipline is embraced, and ambition is celebrated.</p>
            <p style={{ marginTop: 16 }}>Our dedicated faculty, modern infrastructure, and holistic curriculum ensure that students are prepared not just for board examinations, but for the challenges and opportunities of a rapidly changing world.</p>
            <p style={{ marginTop: 16 }}>We believe that when you educate a girl, you educate a generation. This conviction drives everything we do here — from the classroom to the sports ground, from the science laboratory to the cultural stage.</p>
            <p style={{ marginTop: 16 }}>I invite you to partner with us in this journey. To our students: dare to dream, strive with sincerity, and never stop learning. The world is yours to shape.</p>
            <p style={{ marginTop: 24, fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "var(--ink)", fontStyle: "italic" }}>— With warm regards,<br /><strong>Mrs. Sunita Sharma</strong></p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Core Beliefs</span>
          <h2>What We Stand For</h2>
        </div>
        <div className="features-grid" style={{ maxWidth: 960, margin: "0 auto" }}>
          {[
            { img: UP("1481627834876-b7833e8f5570"), title: "Academic Excellence",  desc: "Rigorous, board-aligned curriculum delivered by passionate educators who go beyond textbooks." },
            { img: UP("1461896836934-ffe607ba8211"), title: "Holistic Development", desc: "Sports, arts, NCC, and community service are as important as classroom performance." },
            { img: UP("1522202176988-66273c2fd55f"), title: "Critical Thinking",    desc: "We encourage questions, debate, and independent reasoning from an early age." },
            { img: UP("1529156069898-49953e39b3ac"), title: "Inclusive Community",  desc: "Every student, regardless of background, receives equal attention, care, and opportunity." },
          ].map((b, i) => (
            <div key={i} className="feature-card reveal" style={{ textAlign: "center" }}>
              <img src={b.img} alt={b.title} style={IC} />
              <h4 style={{ marginBottom: 8 }}>{b.title}</h4>
              <p style={{ color: "var(--muted)", fontSize: ".93rem" }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
