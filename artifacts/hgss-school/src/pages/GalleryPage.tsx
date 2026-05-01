import { useState } from "react";

type Cat = "all" | "academics" | "culture" | "sports" | "events";

const photos: { src: string; cap: string; cat: Exclude<Cat, "all">; wide?: boolean }[] = [
  { src: "/photos/marching-uniform.jpeg",   cap: "Republic Day Parade",        cat: "events",  wide: true },
  { src: "/photos/students-traditional.jpeg", cap: "Traditional Day",          cat: "culture" },
  { src: "/photos/cultural-bhangra.jpeg",   cap: "Bhangra Performance",        cat: "culture" },
  { src: "/photos/folk-dance-group.jpeg",   cap: "Haryanvi Folk Dance",        cat: "culture" },
  { src: "/photos/havan-ceremony.jpeg",     cap: "Havan Ceremony",             cat: "events" },
  { src: "/photos/annual-day-toppers.jpeg", cap: "Annual Day · Toppers",       cat: "events", wide: true },
  { src: "/photos/art-class.jpeg",          cap: "Art & Craft Period",         cat: "academics" },
  { src: "/photos/students-cooking.jpeg",   cap: "Home Science · Cooking",     cat: "academics" },
  { src: "/photos/sports-weightlifting.jpeg", cap: "Strength Training",        cat: "sports" },
  { src: "/photos/judo-winner.jpeg",        cap: "State Judo Champion",        cat: "sports" },
  { src: "/photos/ncc-cadets.jpeg",         cap: "NCC Cadets on Parade",       cat: "events" },
  { src: "/photos/shiva-dance-kids.jpeg",   cap: "Shiv Tandav Performance",    cat: "culture" },
  { src: "/photos/folk-dance-kids.jpeg",    cap: "Junior Folk Dance",          cat: "culture" },
  { src: "/photos/hindi-exhibition.jpeg",   cap: "Hindi Diwas Exhibition",     cat: "academics" },
  { src: "/photos/patriotic-dance.jpeg",    cap: "Patriotic Dance",            cat: "culture" },
  { src: "/photos/assembly-building.jpeg",  cap: "Morning Assembly",           cat: "events", wide: true },
  { src: "/photos/school-entrance.jpeg",    cap: "School Entrance",            cat: "events" },
];

const tabs: { key: Cat; label: string }[] = [
  { key: "all", label: "All" },
  { key: "academics", label: "Academics" },
  { key: "culture", label: "Culture & Festivals" },
  { key: "sports", label: "Sports & NCC" },
  { key: "events", label: "Events" },
];

export default function GalleryPage() {
  const [cat, setCat] = useState<Cat>("all");
  const items = cat === "all" ? photos : photos.filter((p) => p.cat === cat);

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Campus Life · Gallery</div>
        <h1>Moments from Our Campus</h1>
        <p>From classrooms and laboratories to festivals, parades and the playground — life at HGSS in pictures.</p>
      </section>

      <section className="section">
        <div className="gallery-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`gal-tab ${cat === t.key ? "active" : ""}`}
              onClick={() => setCat(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {items.map((p) => (
            <div key={p.src} className={`gal-item ${p.wide ? "wide" : ""}`}>
              <span className="gal-tag">{p.cat}</span>
              <img src={p.src} alt={p.cap} loading="lazy" />
              <div className="gal-cap">{p.cap}</div>
            </div>
          ))}
        </div>

        <div className="gallery-footer">
          <p className="gallery-count">Showing <strong>{items.length}</strong> photo{items.length !== 1 ? "s" : ""}{cat !== "all" ? ` in "${tabs.find(t => t.key === cat)?.label}"` : ""}</p>
          <div className="gallery-footer-actions">
            {cat !== "all" && (
              <button className="btn btn-outline-dark" onClick={() => setCat("all")}>
                View All Photos
              </button>
            )}
            <a
              className="btn btn-gold gallery-view-all-btn"
              href="https://www.instagram.com/hindugirlsschool2025/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              View More on Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
