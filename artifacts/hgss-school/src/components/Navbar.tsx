import { useEffect, useRef, useState } from "react";
import type { Route } from "../App";

type Props = {
  route: Route;
  navigate: (r: Route) => void;
  openApply: () => void;
};

type Group = "about" | "academics" | "campus";
type MobileGroup = Group | null;

const aboutItems: { label: string; route: Route }[] = [
  { label: "Our History",         route: "our-history" },
  { label: "Principal's Message", route: "principals-message" },
  { label: "Mission & Vision",    route: "mission-vision" },
  { label: "Faculty & Staff",     route: "faculty-staff" },
];

const academicsItems: { label: string; route: Route }[] = [
  { label: "Curriculum",       route: "curriculum" },
  { label: "Subjects Offered", route: "subjects-offered" },
  { label: "Timetable",        route: "timetable" },
  { label: "Exam Results",     route: "exam-results" },
  { label: "Achievements",     route: "achievements" },
];

const campusItems: { label: string; route: Route }[] = [
  { label: "Events & Activities", route: "events-activities" },
  { label: "Sports",              route: "sports" },
  { label: "Cultural Programs",   route: "cultural-programs" },
  { label: "School Gallery",      route: "school-gallery" },
  { label: "Clubs & Societies",   route: "clubs-societies" },
];

export default function Navbar({ route, navigate, openApply }: Props) {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [mobileGroup, setMobileGroup]   = useState<MobileGroup>(null);
  const [openDropdown, setOpenDropdown] = useState<Group | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileGroup(null);
  }, [route]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const go = (to: Route) => {
    setMobileOpen(false);
    setOpenDropdown(null);
    navigate(to);
  };

  const clickGroup = (group: Group, firstRoute: Route) => {
    setOpenDropdown(prev => (prev === group ? null : group));
    navigate(firstRoute);
  };

  const isAbout     = aboutItems.some(i => i.route === route);
  const isAcademics = academicsItems.some(i => i.route === route);
  const isCampus    = campusItems.some(i => i.route === route);

  const toggleMobileGroup = (g: Group) =>
    setMobileGroup(prev => (prev === g ? null : g));

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} ref={navRef as any}>
        <div className="nav-brand" onClick={() => go("home")} role="button" tabIndex={0}
          onKeyDown={e => e.key === "Enter" && go("home")}>
          <div className="logo">
            <img src="/photos/school-logo.jpeg" alt="HGSS logo" />
          </div>
          <div className="name">
            Hindu Girls Sr. Sec. School
            <span>Kaithal · Estd. 1974</span>
          </div>
        </div>

        {/* ── Desktop navigation ── */}
        <ul className="nav-links">
          <li>
            <button className={`nav-link ${route === "home" ? "active" : ""}`} onClick={() => go("home")}>
              Home
            </button>
          </li>

          {/* About — hover to open, leave to close */}
          <li
            className={`has-dropdown${openDropdown === "about" ? " dropdown-open" : ""}`}
            onMouseEnter={() => setOpenDropdown("about")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              className={`nav-link ${isAbout ? "active" : ""}`}
              aria-haspopup="true"
              aria-expanded={openDropdown === "about"}
              onClick={() => go("our-history")}
            >
              About <span className="arrow">▼</span>
            </button>
            <div className="dropdown">
              {aboutItems.map(item => (
                <button key={item.route} onClick={() => go(item.route)}
                  className={route === item.route ? "active" : ""}>
                  {item.label}
                </button>
              ))}
            </div>
          </li>

          {/* Academics — hover to open, leave to close */}
          <li
            className={`has-dropdown${openDropdown === "academics" ? " dropdown-open" : ""}`}
            onMouseEnter={() => setOpenDropdown("academics")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              className={`nav-link ${isAcademics ? "active" : ""}`}
              aria-haspopup="true"
              aria-expanded={openDropdown === "academics"}
              onClick={() => go("curriculum")}
            >
              Academics <span className="arrow">▼</span>
            </button>
            <div className="dropdown">
              {academicsItems.map(item => (
                <button key={item.route} onClick={() => go(item.route)}
                  className={route === item.route ? "active" : ""}>
                  {item.label}
                </button>
              ))}
            </div>
          </li>

          {/* Campus Life — hover to open, leave to close */}
          <li
            className={`has-dropdown${openDropdown === "campus" ? " dropdown-open" : ""}`}
            onMouseEnter={() => setOpenDropdown("campus")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              className={`nav-link ${isCampus ? "active" : ""}`}
              aria-haspopup="true"
              aria-expanded={openDropdown === "campus"}
              onClick={() => go("events-activities")}
            >
              Campus Life <span className="arrow">▼</span>
            </button>
            <div className="dropdown">
              {campusItems.map(item => (
                <button key={item.route} onClick={() => go(item.route)}
                  className={route === item.route ? "active" : ""}>
                  {item.label}
                </button>
              ))}
            </div>
          </li>

          <li>
            <button className={`nav-link ${route === "admissions" ? "active" : ""}`} onClick={() => go("admissions")}>
              Admissions
            </button>
          </li>
          <li>
            <button className={`nav-link ${route === "contact" ? "active" : ""}`} onClick={() => go("contact")}>
              Contact
            </button>
          </li>
        </ul>

        <button className="nav-cta" onClick={openApply}>Apply Now</button>

        <button className={`hamburger ${mobileOpen ? "ham-open" : ""}`} aria-label="Toggle menu"
          onClick={() => setMobileOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <button className={route === "home" ? "active" : ""} onClick={() => go("home")}>
          Home
        </button>

        {/* About accordion */}
        <button
          className={`mob-group-btn ${isAbout ? "active" : ""} ${mobileGroup === "about" ? "expanded" : ""}`}
          onClick={() => { toggleMobileGroup("about"); navigate("our-history"); }}
        >
          About <span className="mob-arrow">{mobileGroup === "about" ? "▲" : "▼"}</span>
        </button>
        {mobileGroup === "about" && (
          <div className="mob-sub">
            {aboutItems.map(item => (
              <button key={item.route} className={route === item.route ? "active" : ""} onClick={() => go(item.route)}>
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Academics accordion */}
        <button
          className={`mob-group-btn ${isAcademics ? "active" : ""} ${mobileGroup === "academics" ? "expanded" : ""}`}
          onClick={() => { toggleMobileGroup("academics"); navigate("curriculum"); }}
        >
          Academics <span className="mob-arrow">{mobileGroup === "academics" ? "▲" : "▼"}</span>
        </button>
        {mobileGroup === "academics" && (
          <div className="mob-sub">
            {academicsItems.map(item => (
              <button key={item.route} className={route === item.route ? "active" : ""} onClick={() => go(item.route)}>
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Campus Life accordion */}
        <button
          className={`mob-group-btn ${isCampus ? "active" : ""} ${mobileGroup === "campus" ? "expanded" : ""}`}
          onClick={() => { toggleMobileGroup("campus"); navigate("events-activities"); }}
        >
          Campus Life <span className="mob-arrow">{mobileGroup === "campus" ? "▲" : "▼"}</span>
        </button>
        {mobileGroup === "campus" && (
          <div className="mob-sub">
            {campusItems.map(item => (
              <button key={item.route} className={route === item.route ? "active" : ""} onClick={() => go(item.route)}>
                {item.label}
              </button>
            ))}
          </div>
        )}

        <button className={route === "admissions" ? "active" : ""} onClick={() => go("admissions")}>
          Admissions
        </button>
        <button className={route === "contact" ? "active" : ""} onClick={() => go("contact")}>
          Contact
        </button>

        <button className="nav-cta" style={{ marginTop: 18 }}
          onClick={() => { setMobileOpen(false); openApply(); }}>
          Apply Now
        </button>
      </div>
    </>
  );
}
