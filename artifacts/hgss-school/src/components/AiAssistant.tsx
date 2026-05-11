import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/ai-assistant.css";

type TourStep = {
  title: string;
  text: string;
  page: string;
  action?: string;
  route?: string;
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

type VoiceState = "idle" | "loading" | "playing";

type Props = {
  navigate: (route: string) => void;
  openApply: () => void;
};

export default function AiAssistant({ navigate, openApply }: Props) {
  const [phase, setPhase] = useState<"welcome" | "tour" | "minimized">("welcome");
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobUrlRef = useRef<string | null>(null);

  const current = TOUR_STEPS[step];

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioBlobUrlRef.current) {
      URL.revokeObjectURL(audioBlobUrlRef.current);
      audioBlobUrlRef.current = null;
    }
    setVoiceState("idle");
  }, []);

  const speakStep = useCallback(async (text: string) => {
    stopAudio();
    setVoiceState("loading");

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("TTS request failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioBlobUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setVoiceState("idle");
        if (audioBlobUrlRef.current) {
          URL.revokeObjectURL(audioBlobUrlRef.current);
          audioBlobUrlRef.current = null;
        }
        audioRef.current = null;
      };

      audio.onerror = () => {
        setVoiceState("idle");
      };

      setVoiceState("playing");
      await audio.play();
    } catch {
      setVoiceState("idle");
    }
  }, [stopAudio]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "tour" || !bubbleVisible) return;
    navigate(current.page as never);
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 350);
    return () => clearTimeout(t);
  }, [step, bubbleVisible, phase]);

  useEffect(() => {
    if (phase !== "tour" || !bubbleVisible) return;
    stopAudio();
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
    return () => {
      clearInterval(interval);
      stopAudio();
    };
  }, [step, bubbleVisible, phase, current.text, stopAudio]);

  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  const handleStartTour = () => {
    setPhase("tour");
    setStep(0);
    setTimeout(() => setBubbleVisible(true), 300);
  };

  const handleNoThanks = () => {
    setPhase("minimized");
  };

  const handleNext = () => {
    stopAudio();
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
    stopAudio();
    if (current.route === "apply") openApply();
    else navigate(current.route as never);
    setBubbleVisible(false);
    setTimeout(() => setPhase("minimized"), 300);
  };

  const handleMinimize = () => {
    stopAudio();
    setBubbleVisible(false);
    setTimeout(() => setPhase("minimized"), 300);
  };

  const handleRobotClick = () => {
    if (phase === "minimized") {
      setPhase("welcome");
    } else if (phase === "tour") {
      handleMinimize();
    }
  };

  const handleVoiceToggle = () => {
    if (voiceState === "playing" || voiceState === "loading") {
      stopAudio();
    } else {
      speakStep(current.text);
    }
  };

  if (!visible) return null;

  const STEP_ICONS = ["🏫", "📚", "🎯", "🏗️", "🏆", "📞"];

  if (phase === "welcome") {
    return (
      <div className="ai-welcome-overlay">
        <div className="ai-welcome-card-wrap">
          <img src="/ai-robot.png" alt="Diyana" className="ai-welcome-robot-float" />

          <div className="ai-welcome-modal">
            <div className="ai-welcome-modal-top">
              <div className="ai-welcome-badge-wrap">
                <span className="ai-welcome-badge">HGSS Digital Guide</span>
              </div>
              <h2 className="ai-welcome-title">Namaste! Main Diyana hoon</h2>
              <p className="ai-welcome-subtitle">Hindu Girls Sr. Sec. School, Kaithal</p>
            </div>

            <div className="ai-welcome-modal-body">
              <p className="ai-welcome-text">
                Main aapko hamare school ka ek guided tour dene wali hoon — 6 sections, step by step!
              </p>

              <div className="ai-tour-steps">
                {TOUR_STEPS.map((s, i) => (
                  <div className="ai-tour-step-row" key={i}>
                    <span className="ai-tour-step-num">{i + 1}</span>
                    <span className="ai-tour-step-label">{s.title}</span>
                    <span className="ai-tour-step-icon">{STEP_ICONS[i]}</span>
                  </div>
                ))}
              </div>

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
      </div>
    );
  }

  return (
    <div className={`ai-assistant${phase === "minimized" ? " ai-minimized" : ""}`}>
      {phase === "tour" && (
        <div className={`ai-bubble${bubbleVisible ? " ai-bubble-in" : ""}`}>
          <div className="ai-bubble-progress">
            <div
              className="ai-bubble-progress-fill"
              style={{ width: `${((step + 1) / TOUR_STEPS.length) * 100}%` }}
            />
          </div>

          <div className="ai-bubble-header">
            <span className="ai-bubble-name">Diyana — HGSS Guide</span>
            <div className="ai-bubble-controls">
              <span className="ai-step-counter">{step + 1} / {TOUR_STEPS.length}</span>
              <button
                className={`ai-voice-btn${voiceState === "playing" ? " ai-voice-btn--playing" : ""}${voiceState === "loading" ? " ai-voice-btn--loading" : ""}`}
                onClick={handleVoiceToggle}
                title={voiceState === "playing" ? "Stop voice" : "Listen (voice)"}
                aria-label={voiceState === "playing" ? "Stop voice" : "Play voice"}
              >
                {voiceState === "loading" && (
                  <span className="ai-voice-spinner" />
                )}
                {voiceState === "playing" && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="5" y="4" width="4" height="16" rx="1" />
                    <rect x="15" y="4" width="4" height="16" rx="1" />
                  </svg>
                )}
                {voiceState === "idle" && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V22H8v2h8v-2h-3v-1.06A9 9 0 0 0 21 12v-2h-2z"/>
                  </svg>
                )}
              </button>
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
