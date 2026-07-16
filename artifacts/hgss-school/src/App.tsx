import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdmissionModal from "./components/AdmissionModal";
import AiAssistant from "./components/AiAssistant";
import DiyanaChatBot from "./components/DiyanaChatBot";
import LoadingScreen from "./components/LoadingScreen";
import SocialSidebar from "./components/SocialSidebar";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import OurHistoryPage from "./pages/OurHistoryPage";
import PrincipalsMessagePage from "./pages/PrincipalsMessagePage";
import MissionVisionPage from "./pages/MissionVisionPage";
import FacultyPage from "./pages/FacultyPage";
import AchievementsPage from "./pages/AchievementsPage";
import ProgramsPage from "./pages/ProgramsPage";
import CurriculumPage from "./pages/CurriculumPage";
import SubjectsOfferedPage from "./pages/SubjectsOfferedPage";
import TimetablePage from "./pages/TimetablePage";
import ExamResultsPage from "./pages/ExamResultsPage";
import GalleryPage from "./pages/GalleryPage";
import FacilitiesPage from "./pages/FacilitiesPage";
import NoticesPage from "./pages/NoticesPage";
import EventsActivitiesPage from "./pages/EventsActivitiesPage";
import SportsPage from "./pages/SportsPage";
import CulturalProgramsPage from "./pages/CulturalProgramsPage";
import ClubsSocietiesPage from "./pages/ClubsSocietiesPage";
import AdmissionsPage from "./pages/AdmissionsPage";
import ContactPage from "./pages/ContactPage";

export type Route =
  | "home"
  // About
  | "our-history"
  | "principals-message"
  | "mission-vision"
  | "faculty-staff"
  // Academics
  | "curriculum"
  | "subjects-offered"
  | "timetable"
  | "exam-results"
  | "achievements"
  // Campus Life
  | "events-activities"
  | "sports"
  | "cultural-programs"
  | "school-gallery"
  | "clubs-societies"
  // Standalone
  | "admissions"
  | "contact"
  // Legacy routes (kept for backward compatibility)
  | "story"
  | "faculty"
  | "programs-primary"
  | "programs-middle"
  | "programs-senior"
  | "gallery"
  | "facilities"
  | "notices";

const ALL_ROUTES: Route[] = [
  "home",
  "our-history", "principals-message", "mission-vision", "faculty-staff",
  "curriculum", "subjects-offered", "timetable", "exam-results", "achievements",
  "events-activities", "sports", "cultural-programs", "school-gallery", "clubs-societies",
  "admissions", "contact",
  "story", "faculty", "programs-primary", "programs-middle", "programs-senior",
  "gallery", "facilities", "notices",
];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<Route>("home");
  const [showApply, setShowApply] = useState(false);
  const handleLoadDone = useCallback(() => setLoading(false), []);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("hgss-theme");
    return (saved === "dark" || saved === "light") ? saved : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("hgss-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  useEffect(() => {
    const fromHash = (): Route => {
      const h = window.location.hash.replace("#", "") as Route;
      return (ALL_ROUTES.includes(h) ? h : "home") as Route;
    };
    setRoute(fromHash());
    const onHash = () => {
      if (window.location.hash === "#apply") {
        setShowApply(true);
        return;
      }
      setRoute(fromHash());
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", onHash);
    if (window.location.hash === "#apply") setShowApply(true);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (to: Route) => {
    if (to === route) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.location.hash = to;
  };

  const openApply = () => setShowApply(true);
  const closeApply = () => {
    setShowApply(false);
    if (window.location.hash === "#apply") {
      history.replaceState(null, "", " ");
    }
  };

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [route]);

  return (
    <div className="app-shell">
      {loading && <LoadingScreen onDone={handleLoadDone} />}
      <SocialSidebar />
      <Navbar route={route} navigate={navigate} openApply={openApply} theme={theme} toggleTheme={toggleTheme} />
      <main className="page-fade" key={route}>
        {route === "home"              && <HomePage navigate={navigate} openApply={openApply} />}
        {/* About */}
        {route === "our-history"       && <OurHistoryPage />}
        {route === "principals-message"&& <PrincipalsMessagePage />}
        {route === "mission-vision"    && <MissionVisionPage />}
        {route === "faculty-staff"     && <FacultyPage />}
        {/* Academics */}
        {route === "curriculum"        && <CurriculumPage />}
        {route === "subjects-offered"  && <SubjectsOfferedPage />}
        {route === "timetable"         && <TimetablePage />}
        {route === "exam-results"      && <ExamResultsPage />}
        {route === "achievements"      && <AchievementsPage />}
        {/* Campus Life */}
        {route === "events-activities" && <EventsActivitiesPage />}
        {route === "sports"            && <SportsPage />}
        {route === "cultural-programs" && <CulturalProgramsPage />}
        {route === "school-gallery"    && <GalleryPage />}
        {route === "clubs-societies"   && <ClubsSocietiesPage />}
        {/* Standalone */}
        {route === "admissions"        && <AdmissionsPage openApply={openApply} />}
        {route === "contact"           && <ContactPage />}
        {/* Legacy */}
        {route === "story"             && <AboutPage />}
        {route === "faculty"           && <FacultyPage />}
        {route === "programs-primary"  && <ProgramsPage level="primary" navigate={navigate} />}
        {route === "programs-middle"   && <ProgramsPage level="middle" navigate={navigate} />}
        {route === "programs-senior"   && <ProgramsPage level="senior" navigate={navigate} />}
        {route === "gallery"           && <GalleryPage />}
        {route === "facilities"        && <FacilitiesPage />}
        {route === "notices"           && <NoticesPage />}
      </main>
      <Footer navigate={navigate} openApply={openApply} />
      {showApply && <AdmissionModal onClose={closeApply} />}
      <AiAssistant navigate={navigate} openApply={openApply} />
      <DiyanaChatBot />
    </div>
  );
}
