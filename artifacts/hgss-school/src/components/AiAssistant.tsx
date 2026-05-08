import { useEffect, useState } from "react";
import "../styles/ai-assistant.css";

type TourStep = {
  title: string;
  text: string;
  action?: string;
  route?: string;
};

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to HGSS Kaithal",
    text: "Namaste! Main Diyana hoon — Hindu Girls Sr. Sec. School, Kaithal ki aapki digital guide. Aap school ke baare mein kuch bhi pooch sakti hain, ya main aapko school ka ek special tour karwa sakti hoon. Batayein — main aapki kaise madad kar sakti hoon?",
  },
  {
    title: "About Our School",
    text: "Hindu Girls Sr. Sec. School, Kaithal — ek CISCE affiliated school with 50+ years of excellence in girls education. Hamare mission hai: 'Empowering girls through Education, Values and Excellence.' School Code: 10365, Kaithal, Haryana — 136027.",
    action: "Our History",
    route: "our-history",
  },
  {
    title: "Academics",
    text: "Nursery se lekar Class 12 tak — ICSE (Class 10) aur ISC (Class 12). Class 11-12 mein Arts, Commerce aur Science streams available hain. English medium, CISCE curriculum with focus on conceptual learning and overall development.",
    action: "Explore Academics",
    route: "curriculum",
  },
  {
    title: "Admissions",
    text: "Admissions open hain Nursery se Class 11 tak. Documents chahiye: Birth Certificate, Marksheet, TC, Photographs, Aadhar Card aur Residence Proof. Process: School office visit karein, form bharein, verification ke baad admission confirm hoga.",
    action: "Apply Now",
    route: "apply",
  },
  {
    title: "Facilities",
    text: "Hamare paas hain: well-equipped Science Labs, Computer Lab, Library, Sports Ground aur safe girls-only campus. Experienced aur qualified teachers ke saath ek nurturing environment jahan har beti grow kar sake.",
    action: "View Facilities",
    route: "facilities",
  },
  {
    title: "Achievements",
    text: "Consistently excellent results in ICSE aur ISC board exams. Students national aur state level mein sports, cultural aur academic achievements kar rahi hain. Annual Sports Day, cultural events, science fairs aur educational trips bhi hote hain.",
    action: "View Achievements",
    route: "achievements",
  },
  {
    title: "Contact Us",
    text: "Address: Ambala Road, Kaithal, Haryana — 136027. School Monday to Saturday (Morning) open rehti hai. Koi bhi sawaal ho toh school office mein directly contact karein — hum aapka swagat karenge.",
    action: "Contact School",
    route: "contact",
  },
];

type Props = {
  navigate: (route: string) => void;
  openApply: () => void;
};

export default function AiAssistant({ navigate, openApply }: Props) {
  const [visible, setVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [step, setStep] = useState(0);
  const [inTour, setInTour] = useState(false);
  const [typing, setTyping] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);

  const current = TOUR_STEPS[step];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setBubbleVisible(true), 400);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!bubbleVisible) return;
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
  }, [step, bubbleVisible, current.text]);

  const handleDismiss = () => {
    setBubbleVisible(false);
    setTimeout(() => setIsMinimized(true), 350);
  };

  const handleRobotClick = () => {
    if (isMinimized) {
      setStep(0);
      setInTour(false);
      setIsMinimized(false);
      setTimeout(() => setBubbleVisible(true), 300);
    } else {
      handleDismiss();
    }
  };

  const handleStartTour = () => {
    setInTour(true);
    setBubbleVisible(false);
    setTimeout(() => {
      setStep(1);
      setBubbleVisible(true);
    }, 250);
  };

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setBubbleVisible(false);
      setTimeout(() => {
        setStep((s) => s + 1);
        setBubbleVisible(true);
      }, 250);
    } else {
      setInTour(false);
      handleDismiss();
    }
  };

  const handleStepAction = () => {
    if (!current.route) return;
    if (current.route === "apply") {
      openApply();
    } else {
      navigate(current.route as never);
    }
    handleDismiss();
  };

  if (!visible) return null;

  return (
    <div className={`ai-assistant${isMinimized ? " ai-minimized" : ""}`}>
      {!isMinimized && (
        <div className={`ai-bubble${bubbleVisible ? " ai-bubble-in" : ""}`}>
          <div className="ai-bubble-header">
            <span className="ai-bubble-name">Diyana — HGSS Guide</span>
            <div className="ai-bubble-controls">
              {inTour && (
                <span className="ai-step-counter">
                  {step} / {TOUR_STEPS.length - 1}
                </span>
              )}
              <button className="ai-minimize-btn" onClick={handleDismiss} title="Minimize">
                ─
              </button>
            </div>
          </div>

          <div className="ai-bubble-title">{current.title}</div>
          <p className="ai-bubble-text">
            {displayText}
            {typing && <span className="ai-cursor">|</span>}
          </p>

          <div className="ai-bubble-actions">
            {!inTour ? (
              <>
                <button className="ai-btn ai-btn-primary" onClick={handleStartTour}>
                  Start Tour
                </button>
                <button className="ai-btn ai-btn-ghost" onClick={handleDismiss}>
                  No Thanks
                </button>
              </>
            ) : (
              <>
                {current.action && (
                  <button className="ai-btn ai-btn-primary" onClick={handleStepAction}>
                    {current.action}
                  </button>
                )}
                <button className="ai-btn ai-btn-secondary" onClick={handleNext}>
                  {step < TOUR_STEPS.length - 1 ? "Next" : "Finish"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <button
        className="ai-robot-btn"
        onClick={handleRobotClick}
        title={isMinimized ? "Click to restart tour" : "Minimize"}
      >
        <img src="/ai-robot.png" alt="HGSS Guide" className="ai-robot-img" />
        {isMinimized && <span className="ai-robot-badge-pro">Guide</span>}
        <span className="ai-robot-glow" />
      </button>
    </div>
  );
}
