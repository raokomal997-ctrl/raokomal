export default function AboutPage() {
  return (
    <>
      <section className="page-banner">
        <div className="crumb">About · Our Story</div>
        <h1>A Legacy of Educating Girls Since 1974</h1>
        <p>Five decades of nurturing confident, compassionate and capable young women in Kaithal, Haryana.</p>
      </section>

      <section className="section">
        <div className="about-grid">
          <div className="about-image reveal">
            <img src="/photos/school-entrance.jpeg" alt="School entrance" />
          </div>
          <div className="about-text reveal">
            <span className="eyebrow" style={{ color: "#D4B026", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Our Story</span>
            <h2>From a Modest Vision to a Pillar of the Community</h2>
            <p>
              Hindu Girls Senior Secondary School was founded in 1974 with a simple but
              powerful conviction — that educating a girl is the surest way to uplift a
              family, a community, and a nation.
            </p>
            <p>
              What began as a small institution on Ambala Road has grown into one of
              Kaithal's most trusted schools, serving over 1,500 students across
              Pre-Primary to Class XII under the CISCE board.
            </p>
            <p>
              Our motto — <em>विद्या ददाति विनयम्</em> — reminds us every day that true
              learning brings humility. It guides our teaching, our discipline, and our
              relationships within this campus.
            </p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Our Foundation</span>
          <h2>The Three Pillars of HGSS</h2>
          <p>Every classroom, ceremony and decision at our school is rooted in these values.</p>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="value-card reveal">
            <h4>Discipline</h4>
            <p>"Discipline is the foundation upon which all success is built."</p>
          </div>
          <div className="value-card reveal">
            <h4>Dedication</h4>
            <p>"Dedication transforms ordinary effort into extraordinary achievement."</p>
          </div>
          <div className="value-card reveal">
            <h4>Devotion</h4>
            <p>"Devotion to learning, culture and country shapes the character of a generation."</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="about-grid">
          <div className="about-text reveal">
            <span className="eyebrow" style={{ color: "#D4B026", fontSize: ".78rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Vision & Mission</span>
            <h2>Educating the Whole Child</h2>
            <p>
              <strong>Our Vision —</strong> To be the leading girls' school in the region,
              producing graduates who are academically excellent, culturally rooted, and
              prepared to lead with integrity.
            </p>
            <p>
              <strong>Our Mission —</strong> To provide a safe, joyful and rigorous
              learning environment where every student discovers her strengths through
              academics, arts, sports, NCC and service to the community.
            </p>
          </div>
          <div className="about-image reveal">
            <img src="/photos/havan-ceremony.jpeg" alt="Havan ceremony" />
          </div>
        </div>
      </section>
    </>
  );
}
