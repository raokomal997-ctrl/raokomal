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
    title: "Welcome to HGSS Kaithal! 🎓",
    text: "Namaste! I'm Gyaan, your school guide. We've been nurturing girls' education since 1974. Let me show you around!",
  },
  {
    title: "Our Rich History 📖",
    text: "Founded in 1974 and affiliated with CISCE, HGSS Kaithal has over 50 years of academic excellence. Explore our story!",
    action: "Our History",
    route: "our-history",
  },
  {
    title: "World-Class Academics 🏆",
    text: "From Primary to Senior Secondary, we offer a comprehensive curriculum with top faculty and outstanding results.",
    action: "Explore Academics",
    route: "curriculum",
  },
  {
    title: "Campus Life 🌟",
    text: "Sports, cultural programs, clubs — student life at HGSS is vibrant and full of opportunities to grow!",
    action: "See Campus Life",
    route: "events-activities",
  },
  {
    title: "Join Our Family 💛",
    text: "Admissions are open! Be part of a legacy of excellence. Click below to apply or explore more on your own.",
    action: "Apply Now",
    route: "apply",
  },
];

type Props = {
  navigate: (route: string) => void;
  openApply: () => void;
};

export default function AiAssistant({ navigate, openApply }: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState(0);
  const [inTour, setInTour] = useState(false);
  const [typing, setTyping] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const current = TOUR_STEPS[step];

  useEffect(() => {
    const dismissed = sessionStorage.getItem("hgss-ai-dismissed");
    if (dismissed) return;
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
    }, 22);
    return () => clearInterval(interval);
  }, [step, bubbleVisible]);

  const handleNoThanks = () => {
    setBubbleVisible(false);
    setTimeout(() => {
      setDismissed(true);
      setVisible(false);
      sessionStorage.setItem("hgss-ai-dismissed", "1");
    }, 400);
  };

  const handleStartTour = () => {
    setInTour(true);
    setStep(1);
  };

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setBubbleVisible(false);
      setTimeout(() => {
        setStep((s) => s + 1);
        setBubbleVisible(true);
      }, 250);
    } else {
      handleNoThanks();
    }
  };

  const handleStepAction = () => {
    if (!current.route) return;
    if (current.route === "apply") {
      openApply();
    } else {
      navigate(current.route as never);
    }
    handleNoThanks();
  };

  const handleMinimize = () => {
    setIsMinimized((m) => !m);
    if (isMinimized) setBubbleVisible(true);
    else setBubbleVisible(false);
  };

  if (dismissed || !visible) return null;

  return (
    <div className={`ai-assistant${isMinimized ? " ai-minimized" : ""}`}>
      {!isMinimized && (
        <div className={`ai-bubble${bubbleVisible ? " ai-bubble-in" : ""}`}>
          <div className="ai-bubble-header">
            <span className="ai-bubble-name">✨ Gyaan — HGSS Guide</span>
            <div className="ai-bubble-controls">
              {inTour && (
                <span className="ai-step-counter">
                  {step}/{TOUR_STEPS.length - 1}
                </span>
              )}
              <button className="ai-minimize-btn" onClick={handleMinimize} title="Minimize">
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
                  🚀 Start Tour
                </button>
                <button className="ai-btn ai-btn-ghost" onClick={handleNoThanks}>
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
                  {step < TOUR_STEPS.length - 1 ? "Next →" : "Finish ✓"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <button className="ai-robot-btn" onClick={handleMinimize} title={isMinimized ? "Open Guide" : "Minimize"}>
        <img src="/ai-robot.png" alt="AI Guide Gyaan" className="ai-robot-img" />
        {isMinimized && <span className="ai-robot-badge">👋</span>}
        <span className="ai-robot-glow" />
      </button>
    </div>
  );
}
