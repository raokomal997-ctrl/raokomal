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
      </section>
    </>
  );
}
