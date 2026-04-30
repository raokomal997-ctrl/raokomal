import { useEffect, useRef, useState } from "react";
import type { Route } from "../App";

type Props = {
  route: Route;
  navigate: (r: Route) => void;
  openApply: () => void;
};

type DropKey = "about" | "academics" | "campus" | null;

export default function Navbar({ route, navigate, openApply }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [openDrop, setOpenDrop] = useState<DropKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close any open dropdown on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) setOpenDrop(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setOpenDrop(null); }, [route]);

  const go = (to: Route) => { setOpenDrop(null); navigate(to); };

  const isAbout      = ["story", "faculty", "achievements"].includes(route);
  const isAcademics  = route.startsWith("programs-");
  const isCampus     = ["gallery", "facilities", "notices"].includes(route);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} ref={navRef as any}>
      <div className="nav-brand" onClick={() => go("home")} role="button" tabIndex={0}>
        <div className="logo"><img src="/photos/school-logo.jpeg" alt="HGSS logo" /></div>
        <div className="name">
          Hindu Girls Sr. Sec. School
          <span>Kaithal · Estd. 1974</span>
        </div>
      </div>

      <ul className="nav-links">
        <li>
          <button className={`nav-link ${route === "home" ? "active" : ""}`} onClick={() => go("home")}>Home</button>
        </li>

        <li>
          <button
            className={`nav-link ${isAbout ? "active" : ""} ${openDrop === "about" ? "open" : ""}`}
            onClick={(e) => { e.stopPropagation(); setOpenDrop(openDrop === "about" ? null : "about"); }}
            aria-expanded={openDrop === "about"}
          >
            About <span className="arrow">▼</span>
          </button>
          {openDrop === "about" && (
            <div className="dropdown">
              <button onClick={() => go("story")}>Our Story</button>
              <button onClick={() => go("faculty")}>Our Faculty</button>
              <button onClick={() => go("achievements")}>Achievements</button>
            </div>
          )}
        </li>

        <li>
          <button
            className={`nav-link ${isAcademics ? "active" : ""} ${openDrop === "academics" ? "open" : ""}`}
            onClick={(e) => { e.stopPropagation(); setOpenDrop(openDrop === "academics" ? null : "academics"); }}
            aria-expanded={openDrop === "academics"}
          >
            Academics <span className="arrow">▼</span>
          </button>
          {openDrop === "academics" && (
            <div className="dropdown">
              <button onClick={() => go("programs-primary")}>Primary School (1 – 5)</button>
              <button onClick={() => go("programs-middle")}>Middle School (6 – 8)</button>
              <button onClick={() => go("programs-senior")}>Senior Secondary (9 – 12)</button>
            </div>
          )}
        </li>

        <li>
          <button
            className={`nav-link ${isCampus ? "active" : ""} ${openDrop === "campus" ? "open" : ""}`}
            onClick={(e) => { e.stopPropagation(); setOpenDrop(openDrop === "campus" ? null : "campus"); }}
            aria-expanded={openDrop === "campus"}
          >
            Campus Life <span className="arrow">▼</span>
          </button>
          {openDrop === "campus" && (
            <div className="dropdown">
              <button onClick={() => go("gallery")}>Gallery</button>
              <button onClick={() => go("facilities")}>Facilities</button>
              <button onClick={() => go("notices")}>Notice Board</button>
            </div>
          )}
        </li>

        <li>
          <button className={`nav-link ${route === "admissions" ? "active" : ""}`} onClick={() => go("admissions")}>Admissions</button>
        </li>
        <li>
          <button className={`nav-link ${route === "contact" ? "active" : ""}`} onClick={() => go("contact")}>Contact</button>
        </li>
      </ul>

      <button className="nav-cta" onClick={openApply}>Apply Now</button>

      <button className="hamburger" aria-label="Menu" onClick={() => setMobileOpen((o) => !o)}>
        <span></span><span></span><span></span>
      </button>

      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <button className={route === "home" ? "active" : ""} onClick={() => go("home")}>Home</button>

        <div className="group-title">About</div>
        <button className={route === "story" ? "active" : ""} onClick={() => go("story")}>Our Story</button>
        <button className={route === "faculty" ? "active" : ""} onClick={() => go("faculty")}>Our Faculty</button>
        <button className={route === "achievements" ? "active" : ""} onClick={() => go("achievements")}>Achievements</button>

        <div className="group-title">Academics</div>
        <button className={route === "programs-primary" ? "active" : ""} onClick={() => go("programs-primary")}>Primary (1 – 5)</button>
        <button className={route === "programs-middle" ? "active" : ""} onClick={() => go("programs-middle")}>Middle (6 – 8)</button>
        <button className={route === "programs-senior" ? "active" : ""} onClick={() => go("programs-senior")}>Senior Secondary (9 – 12)</button>

        <div className="group-title">Campus Life</div>
        <button className={route === "gallery" ? "active" : ""} onClick={() => go("gallery")}>Gallery</button>
        <button className={route === "facilities" ? "active" : ""} onClick={() => go("facilities")}>Facilities</button>
        <button className={route === "notices" ? "active" : ""} onClick={() => go("notices")}>Notice Board</button>

        <div className="group-title">More</div>
        <button className={route === "admissions" ? "active" : ""} onClick={() => go("admissions")}>Admissions</button>
        <button className={route === "contact" ? "active" : ""} onClick={() => go("contact")}>Contact</button>

        <button className="nav-cta" onClick={() => { setMobileOpen(false); openApply(); }}>Apply Now</button>
      </div>
    </nav>
  );
}
