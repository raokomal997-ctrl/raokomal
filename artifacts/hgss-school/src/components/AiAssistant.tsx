import { useEffect, useState } from "react";
import "../styles/ai-assistant.css";

type TourStep = {
  title: string;
  text: string;
  page: string;    // auto-navigate to this route when step activates
  action?: string;
  route?: string;  // action button route (may differ from page, e.g. "apply" modal)
};

const TOUR_STEPS: TourStep[] = [
  {
    title: "About Our School",
    text: "Hindu Girls Sr. Sec. School, Kaithal — ek CISCE affiliated school with 50+ years of excellence in girls education. Hamare mission hai: 'Empowering girls through Education, Values and Excellence.' School Code: 10365, Kaithal, Haryana — 136027.",
    page: "our-history",
    action: "Read Full History",
    route: "our-history",
  },
  {
    title: "Academics",
    text: "Nursery se lekar Class 12 tak — ICSE (Class 10) aur ISC (Class 12). Class 11-12 mein Arts, Commerce aur Science streams available hain. English medium, CISCE curriculum with focus on conceptual learning.",
    page: "curriculum",
    action: "Explore Academics",
    route: "curriculum",
  },
  {
    title: "Admissions",
    text: "Admissions open hain Nursery se Class 11 tak. Documents chahiye: Birth Certificate, Marksheet, TC, Photographs, Aadhar Card aur Residence Proof. School office mein aayein — hum aapka swagat karenge!",
    page: "admissions",
    action: "Apply Now",
    route: "apply",
  },
  {
    title: "Facilities",
    text: "Hamare paas hain: well-equipped Science Labs, Computer Lab, Library, Sports Ground aur safe girls-only campus. Experienced faculty ke saath ek nurturing environment jahan har beti grow kar sake.",
    page: "facilities",
    action: "View Facilities",
    route: "facilities",
  },
  {
    title: "Achievements",
    text: "Consistently excellent results in ICSE aur ISC board exams. Students national aur state level mein sports, cultural aur academic achievements kar rahi hain. Annual Sports Day, cultural events, science fairs bhi hote hain.",
    page: "achievements",
    action: "View Achievements",
    route: "achievements",
  },
  {
    title: "Contact Us",
    text: "Address: Ambala Road, Kaithal, Haryana — 136027. School Monday to Saturday (Morning) open rehti hai. Koi bhi sawaal ho toh school office mein directly contact karein.",
    page: "contact",
    action: "Contact School",
    route: "contact",
  },
];

type Props = {
  navigate: (route: string) => void;
  openApply: () => void;
};

export default function AiAssistant({ navigate, openApply }: Props) {
  // welcome = centered modal; tour = corner bubble tour; minimized = corner icon only
  const [phase, setPhase] = useState<"welcome" | "tour" | "minimized">("welcome");
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);

  const current = TOUR_STEPS[step];

  // Show welcome modal after brief page-load delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Auto-navigate to the current step's page when the tour step changes
  useEffect(() => {
    if (phase !== "tour" || !bubbleVisible) return;
    const { page } = current;
    navigate(page as never);
    // Scroll to top so user sees the full page
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, bubbleVisible, phase]);

  // Typewriter effect — only during tour phase
  useEffect(() => {
    if (phase !== "tour" || !bubbleVisible) return;
    setTyping(true);
    setDisplayText("");
    const text = current.text;
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setTyping(false);
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [step, bubbleVisible, phase, current.text]);

  // ── Welcome modal actions ──
  const handleStartTour = () => {
    setPhase("tour");
    setStep(0);
    setTimeout(() => setBubbleVisible(true), 300);
  };

  const handleNoThanks = () => {
    setPhase("minimized");
  };

  // ── Tour actions ──
  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setBubbleVisible(false);
      setTimeout(() => {
        setStep((s) => s + 1);
        setBubbleVisible(true);
      }, 250);
    } else {
      setBubbleVisible(false);
      setTimeout(() => setPhase("minimized"), 300);
    }
  };

  const handleStepAction = () => {
    if (!current.route) return;
    if (current.route === "apply") openApply();
    else navigate(current.route as never);
    setBubbleVisible(false);
    setTimeout(() => setPhase("minimized"), 300);
  };

  const handleMinimize = () => {
    setBubbleVisible(false);
    setTimeout(() => setPhase("minimized"), 300);
  };

  // Click minimized robot → restart welcome modal
  const handleRobotClick = () => {
    if (phase === "minimized") {
      setPhase("welcome");
    } else if (phase === "tour") {
      handleMinimize();
    }
  };

  if (!visible) return null;

  // ── Welcome Modal (centered) ──
  if (phase === "welcome") {
    return (
      <div className="ai-welcome-overlay">
        <div className="ai-welcome-modal">
          <img src="/ai-robot.png" alt="Diyana" className="ai-welcome-robot" />
          <div className="ai-welcome-content">
            <div className="ai-welcome-badge">HGSS Guide</div>
            <h2 className="ai-welcome-title">Namaste! Main Diyana hoon</h2>
            <p className="ai-welcome-text">
              Hindu Girls Sr. Sec. School, Kaithal ki aapki digital guide. Kya aap school ka ek quick tour lena chahenge?
            </p>
            <div className="ai-welcome-actions">
              <button className="ai-btn ai-btn-primary ai-btn-lg" onClick={handleStartTour}>
                Start Tour
              </button>
              <button className="ai-btn ai-btn-ghost ai-btn-lg" onClick={handleNoThanks}>
                No Thanks
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Corner widget (tour or minimized) ──
  return (
    <div className={`ai-assistant${phase === "minimized" ? " ai-minimized" : ""}`}>
      {phase === "tour" && (
        <div className={`ai-bubble${bubbleVisible ? " ai-bubble-in" : ""}`}>
          <div className="ai-bubble-header">
            <span className="ai-bubble-name">Diyana — HGSS Guide</span>
            <div className="ai-bubble-controls">
              <span className="ai-step-counter">{step + 1} / {TOUR_STEPS.length}</span>
              <button className="ai-minimize-btn" onClick={handleMinimize} title="Minimize">─</button>
            </div>
          </div>

          <div className="ai-bubble-title">{current.title}</div>
          <p className="ai-bubble-text">
            {displayText}
            {typing && <span className="ai-cursor">|</span>}
          </p>

          <div className="ai-bubble-actions">
            {current.action && (
              <button className="ai-btn ai-btn-primary" onClick={handleStepAction}>
                {current.action}
              </button>
            )}
            <button className="ai-btn ai-btn-secondary" onClick={handleNext}>
              {step < TOUR_STEPS.length - 1 ? "Next" : "Finish"}
            </button>
          </div>
        </div>
      )}

      <button
        className="ai-robot-btn"
        onClick={handleRobotClick}
        title={phase === "minimized" ? "Click to restart tour" : "Minimize"}
      >
        <img src="/ai-robot.png" alt="HGSS Guide Diyana" className="ai-robot-img" />
        {phase === "minimized" && <span className="ai-robot-badge-pro">Guide</span>}
        <span className="ai-robot-glow" />
      </button>
    </div>
  );
}
