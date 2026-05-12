import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/ai-assistant.css";

type TourStep = {
  title: string;
  text: string;
  page: string;
  action?: string;
  route?: string;
  audioSrc: string;
};

const TOUR_STEPS: TourStep[] = [
  {
    title: "About Our School",
    text: "Hindu Girls Sr. Sec. School, Kaithal — ek CISCE affiliated school with 50+ years of excellence in girls education. Hamare mission hai: Empowering girls through Education, Values and Excellence. School Code: 10365, Kaithal, Haryana — 136027.",
    page: "our-history",
    action: "Read Full History",
    route: "our-history",
    audioSrc: "/audio/step-0.mp3",
  },
  {
    title: "Academics",
    text: "Nursery se lekar Class 12 tak — ICSE Class 10 aur ISC Class 12. Class 11-12 mein Arts, Commerce aur Science streams available hain. English medium, CISCE curriculum with focus on conceptual learning.",
    page: "curriculum",
    action: "Explore Academics",
    route: "curriculum",
    audioSrc: "/audio/step-1.mp3",
  },
  {
    title: "Admissions",
    text: "Admissions open hain Nursery se Class 11 tak. Documents chahiye: Birth Certificate, Marksheet, TC, Photographs, Aadhar Card aur Residence Proof. School office mein aayein — hum aapka swagat karenge!",
    page: "admissions",
    action: "Apply Now",
    route: "apply",
    audioSrc: "/audio/step-2.mp3",
  },
  {
    title: "Facilities",
    text: "Hamare paas hain: well-equipped Science Labs, Computer Lab, Library, Sports Ground aur safe girls-only campus. Experienced faculty ke saath ek nurturing environment jahan har beti grow kar sake.",
    page: "facilities",
    action: "View Facilities",
    route: "facilities",
    audioSrc: "/audio/step-3.mp3",
  },
  {
    title: "Achievements",
    text: "Consistently excellent results in ICSE aur ISC board exams. Students national aur state level mein sports, cultural aur academic achievements kar rahi hain. Annual Sports Day, cultural events, science fairs bhi hote hain.",
    page: "achievements",
    action: "View Achievements",
    route: "achievements",
    audioSrc: "/audio/step-4.mp3",
  },
  {
    title: "Contact Us",
    text: "Address: Ambala Road, Kaithal, Haryana — 136027. School Monday to Saturday, Morning shift open rehti hai. Koi bhi sawaal ho toh school office mein directly contact karein.",
    page: "contact",
    action: "Contact School",
    route: "contact",
    audioSrc: "/audio/step-5.mp3",
  },
];

const WELCOME_TEXT =
  "Namaste! Main Diyana hoon — Hindu Girls Senior Secondary School, Kaithal ki digital guide. Main aapko hamare school ka ek guided tour dene wali hoon. Kya aap tour shuru karna chahenge?";
const WELCOME_AUDIO = "/audio/welcome.mp3";

type Props = {
  navigate: (route: string) => void;
  openApply: () => void;
};

export default function AiAssistant({ navigate, openApply }: Props) {
  const [phase, setPhase] = useState<"welcome" | "tour" | "minimized">("welcome");
  const [visible, setVisible] = useState(false);
  const [entering, setEntering] = useState(false);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = TOUR_STEPS[step];

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  // Play from a static pre-generated audio file; fall back to live API if file fails
  const speak = useCallback(async (audioSrc: string, fallbackText: string) => {
    stopAudio();
    setIsSpeaking(true);

    const tryPlay = (src: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const audio = new Audio(src);
        audioRef.current = audio;
        audio.onended = () => { setIsSpeaking(false); resolve(); };
        audio.onerror = () => reject(new Error("audio error"));
        audio.play().catch(reject);
      });

    // 1. Try cached static file
    try {
      await tryPlay(audioSrc);
      return;
    } catch {
      // static file failed — fall through to live API
    }

    // 2. Fall back to live TTS API
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fallbackText }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
      await audio.play();
    } catch {
      setIsSpeaking(false);
    }
  }, [stopAudio]);

  // Show welcome after brief delay, trigger entrance animation
  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      setEntering(true);
      setTimeout(() => setEntering(false), 1000);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  // Auto-read welcome when modal appears
  useEffect(() => {
    if (visible && phase === "welcome") {
      const t = setTimeout(() => speak(WELCOME_AUDIO, WELCOME_TEXT), 600);
      return () => clearTimeout(t);
    }
  }, [visible, phase, speak]);

  // Navigate + scroll when tour step changes
  useEffect(() => {
    if (phase !== "tour" || !bubbleVisible) return;
    navigate(current.page as never);
    const t = setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 350);
    return () => clearTimeout(t);
  }, [step, bubbleVisible, phase, navigate, current.page]);

  // Typewriter effect + auto-speak each step
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
    }, 18);
    const speakTimer = setTimeout(() => speak(current.audioSrc, text), 600);
    return () => {
      clearInterval(interval);
      clearTimeout(speakTimer);
      stopAudio();
    };
  }, [step, bubbleVisible, phase, current.text, current.audioSrc, speak, stopAudio]);

  useEffect(() => () => stopAudio(), [stopAudio]);

  const handleStartTour = () => {
    stopAudio();
    setPhase("tour");
    setStep(0);
    setTimeout(() => setBubbleVisible(true), 300);
  };

  const handleNoThanks = () => {
    stopAudio();
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
      setEntering(true);
      setTimeout(() => setEntering(false), 1000);
      setPhase("welcome");
    } else if (phase === "tour") {
      handleMinimize();
    }
  };

  const handleVoiceToggle = () => {
    if (isSpeaking) stopAudio();
    else if (phase === "welcome") speak(WELCOME_AUDIO, WELCOME_TEXT);
    else speak(current.audioSrc, current.text);
  };

  if (!visible) return null;

  // ── Welcome Modal ──
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
              <div className="ai-welcome-message-box">
                <p className="ai-welcome-message-text">{WELCOME_TEXT}</p>
                <button
                  className={`ai-welcome-voice-btn${isSpeaking ? " speaking" : ""}`}
                  onClick={handleVoiceToggle}
                  title={isSpeaking ? "Pause" : "Listen"}
                  aria-label={isSpeaking ? "Stop voice" : "Play welcome message"}
                >
                  {isSpeaking ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="5" y="4" width="4" height="16" rx="1" />
                      <rect x="15" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V22H8v2h8v-2h-3v-1.06A9 9 0 0 0 21 12v-2h-2z"/>
                    </svg>
                  )}
                </button>
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

  // ── Corner widget ──
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
            <span className="ai-bubble-name">
              Diyana — HGSS Guide
              {isSpeaking && <span className="ai-speaking-dots"><span /><span /><span /></span>}
            </span>
            <div className="ai-bubble-controls">
              <span className="ai-step-counter">{step + 1} / {TOUR_STEPS.length}</span>
              <button
                className={`ai-voice-btn${isSpeaking ? " ai-voice-btn--playing" : ""}`}
                onClick={handleVoiceToggle}
                title={isSpeaking ? "Stop voice" : "Replay voice"}
                aria-label={isSpeaking ? "Stop" : "Replay"}
              >
                {isSpeaking ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="5" y="4" width="4" height="16" rx="1" />
                    <rect x="15" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
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
        className={[
          "ai-robot-btn",
          entering        ? "ai-robot-btn--entering" :
          isSpeaking      ? "ai-robot-btn--speaking"  :
                            "ai-robot-btn--idle",
        ].join(" ")}
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
