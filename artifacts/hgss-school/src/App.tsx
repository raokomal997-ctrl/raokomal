import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdmissionModal from "./components/AdmissionModal";
import LoadingScreen from "./components/LoadingScreen";
import NotificationTicker from "./components/NotificationTicker";
import SocialSidebar from "./components/SocialSidebar";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FacultyPage from "./pages/FacultyPage";
import AchievementsPage from "./pages/AchievementsPage";
import ProgramsPage from "./pages/ProgramsPage";
import GalleryPage from "./pages/GalleryPage";
import FacilitiesPage from "./pages/FacilitiesPage";
import NoticesPage from "./pages/NoticesPage";
import AdmissionsPage from "./pages/AdmissionsPage";
import ContactPage from "./pages/ContactPage";

export type Route =
  | "home"
  | "story"
  | "faculty"
  | "achievements"
  | "programs-primary"
  | "programs-middle"
  | "programs-senior"
  | "gallery"
  | "facilities"
  | "notices"
  | "admissions"
  | "contact";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tickerVisible, setTickerVisible] = useState(true);
  const [route, setRoute] = useState<Route>("home");
  const [showApply, setShowApply] = useState(false);
  const handleLoadDone = useCallback(() => setLoading(false), []);

  // Load route from URL hash so deep links work and back/forward navigation works
  useEffect(() => {
    const fromHash = (): Route => {
      const h = window.location.hash.replace("#", "") as Route;
      const all: Route[] = [
        "home", "story", "faculty", "achievements",
        "programs-primary", "programs-middle", "programs-senior",
        "gallery", "facilities", "notices", "admissions", "contact",
      ];
      return (all.includes(h) ? h : "home") as Route;
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

  // Reveal-on-scroll: re-attach observer on every route change
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
    <div className={`app-shell${tickerVisible ? " has-ticker" : ""}`}>
      {loading && <LoadingScreen onDone={handleLoadDone} />}
      <NotificationTicker visible={tickerVisible} onClose={() => setTickerVisible(false)} />
      <SocialSidebar />
      <Navbar route={route} navigate={navigate} openApply={openApply} />
      <main className="page-fade" key={route}>
        {route === "home" && <HomePage navigate={navigate} openApply={openApply} />}
        {route === "story" && <AboutPage />}
        {route === "faculty" && <FacultyPage />}
        {route === "achievements" && <AchievementsPage />}
        {route === "programs-primary" && <ProgramsPage level="primary" navigate={navigate} />}
        {route === "programs-middle" && <ProgramsPage level="middle" navigate={navigate} />}
        {route === "programs-senior" && <ProgramsPage level="senior" navigate={navigate} />}
        {route === "gallery" && <GalleryPage />}
        {route === "facilities" && <FacilitiesPage />}
        {route === "notices" && <NoticesPage />}
        {route === "admissions" && <AdmissionsPage openApply={openApply} />}
        {route === "contact" && <ContactPage />}
      </main>
      <Footer navigate={navigate} openApply={openApply} />
      {showApply && <AdmissionModal onClose={closeApply} />}
    </div>
  );
}
