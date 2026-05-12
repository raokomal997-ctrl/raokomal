/**
 * AiAssistant.tsx — Diyana, HGSS Tour Guide
 *
 * Phases:
 *   "welcome"   → full-screen modal with Start / No / Chat buttons
 *   "tour"      → corner bubble navigates pages + auto-scrolls while voice plays
 *   "minimized" → small robot in corner with Tour + Chat quick-access buttons
 *   "chat"      → dispatches event to open DiyanaChatBot panel
 *
 * Voice: Cached MP3 files from /audio/ (pre-generated with ElevenLabs eleven_v3).
 *        Falls back to live /api/tts if a file fails.
 *
 * Auto-scroll: While isSpeaking = true during tour, the page slowly scrolls
 *              down so visitors read along. Pauses if user manually scrolls.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/ai-assistant.css";

// ═══════════════════════════════════════════════════════════════
// SECTION 1: TOUR DATA
// ═══════════════════════════════════════════════════════════════

type TourStep = {
  title: string;       // Hindi heading shown in bubble
  text: string;        // Romanized Hindi shown on screen
  audioText: string;   // Devanagari Hindi sent to TTS API (fallback)
  page: string;        // which page to navigate to for this step
  action?: string;     // optional CTA button label
  route?: string;      // CTA click destination
  audioSrc: string;    // cached MP3 path in public/audio/
};

const TOUR_STEPS: TourStep[] = [
  {
    title: "हमारे विद्यालय के बारे में",
    text: "Hindu Girls Sr. Sec. School, Kaithal — CISCE se manyata prapt ek vidyalay hai jo 50 se adhik varshon se balika shiksha mein uchch shiksha pradan kar raha hai. Hamare vidyalay ka uddeshya hai — Shiksha, Sanskaar aur Uttkarshtta ke madhyam se betiyon ko sashakt banana.",
    audioText: "हिन्दू गर्ल्स सीनियर सेकेंडरी स्कूल, कैथल — सीआईएससीई से संबद्ध एक विद्यालय है जो पचास से अधिक वर्षों से बालिका शिक्षा में उत्कृष्टता प्रदान कर रहा है। हमारा उद्देश्य है — शिक्षा, संस्कार और उत्कृष्टता के माध्यम से बेटियों को सशक्त बनाना।",
    page: "our-history",
    action: "Itihas Padhein",
    route: "our-history",
    audioSrc: "/audio/step-0.mp3",
  },
  {
    title: "शिक्षा व्यवस्था",
    text: "Nursery se Kaksha 12 tak — ICSE Kaksha 10 aur ISC Kaksha 12. Kaksha 11-12 mein Kala, Vanijya aur Vigyan dhaaraen uplabdh hain. Angrezi madhyam, CISCE pathyakram ke saath vaichaarak adhigam par vishesh bal diya jaata hai.",
    audioText: "नर्सरी से कक्षा बारहवीं तक — आईसीएसई कक्षा दस और आईएससी कक्षा बारह। कक्षा ग्यारह और बारह में कला, वाणिज्य और विज्ञान धाराएँ उपलब्ध हैं। अंग्रेजी माध्यम, सीआईएससीई पाठ्यक्रम के साथ वैचारिक अधिगम पर विशेष बल दिया जाता है।",
    page: "curriculum",
    action: "Shiksha Dekhein",
    route: "curriculum",
    audioSrc: "/audio/step-1.mp3",
  },
  {
    title: "प्रवेश प्रक्रिया",
    text: "Pravesh Nursery se Kaksha 11 tak khule hain. Aavashyak dastaavez: Janm Praman Patra, Anktaalika, TC, Photograph, Aadhar Card aur Nivas Praman. Vidyalay kaaryaalay mein pdhaaraein — hum aapka swagat karenge!",
    audioText: "प्रवेश नर्सरी से कक्षा ग्यारह तक खुले हैं। आवश्यक दस्तावेज़ हैं — जन्म प्रमाण पत्र, अंकतालिका, स्थानांतरण प्रमाण पत्र, फ़ोटोग्राफ, आधार कार्ड और निवास प्रमाण। विद्यालय कार्यालय में पधारें — हम आपका हार्दिक स्वागत करेंगे!",
    page: "admissions",
    action: "Avedan Karein",
    route: "apply",
    audioSrc: "/audio/step-2.mp3",
  },
  {
    title: "विद्यालय की सुविधाएँ",
    text: "Hamare vidyalay mein hain — sujjit Vigyan Prayogshaalaen, Computer Lab, Pustakalay, Khel Maidaan aur surakshit balika parisar. Anubhavi shikshkon ke saath ek poshankari vatavaran jahan har beti vikas kar sake.",
    audioText: "हमारे विद्यालय में हैं — सुसज्जित विज्ञान प्रयोगशालाएँ, कंप्यूटर प्रयोगशाला, पुस्तकालय, खेल मैदान और सुरक्षित बालिका परिसर। अनुभवी शिक्षकों के साथ एक पोषणकारी वातावरण जहाँ हर बेटी विकास कर सके।",
    page: "facilities",
    action: "Suvidhaen Dekhein",
    route: "facilities",
    audioSrc: "/audio/step-3.mp3",
  },
  {
    title: "उपलब्धियाँ",
    text: "ICSE aur ISC board pareekshaon mein nirantar uttam parinam. Chhatraen rashtriya aur rajya star par khel, saanskritik aur shaikshnik upalabdhiyan praapt kar rahi hain. Varshik Khel Divas, saanskritik karyakram aur Vigyan Mele bhi aayojit hote hain.",
    audioText: "आईसीएसई और आईएससी बोर्ड परीक्षाओं में निरंतर उत्कृष्ट परिणाम। छात्राएँ राष्ट्रीय और राज्य स्तर पर खेल, सांस्कृतिक और शैक्षणिक उपलब्धियाँ प्राप्त कर रही हैं। वार्षिक खेल दिवस, सांस्कृतिक कार्यक्रम और विज्ञान मेले भी आयोजित होते हैं।",
    page: "achievements",
    action: "Uplabdhiyan Dekhein",
    route: "achievements",
    audioSrc: "/audio/step-4.mp3",
  },
  {
    title: "संपर्क करें",
    text: "Pata: Ambala Road, Kaithal, Haryana — 136027. Vidyalay Somvar se Shanivar, pratahkaalin paali mein khula rehta hai. Koi bhi prashna ho toh vidyalay kaaryaalay mein seedha sampark karein.",
    audioText: "पता: अंबाला रोड, कैथल, हरियाणा। विद्यालय सोमवार से शनिवार, प्रातःकालीन पाली में खुला रहता है। कोई भी प्रश्न हो तो विद्यालय कार्यालय में सीधे संपर्क करें।",
    page: "contact",
    action: "Sampark Karein",
    route: "contact",
    audioSrc: "/audio/step-5.mp3",
  },
];

const WELCOME_TEXT =
  "Namaste! Main Diyana hoon — Hindu Girls Senior Secondary School, Kaithal ki digital guide. Main aapko hamare vidyalay ka ek guided bhraman karaane wali hoon. Kya aap bhraman shuru karna chahenge?";
const WELCOME_AUDIO_TEXT =
  "नमस्ते! मैं दियाना हूँ — हिन्दू गर्ल्स सीनियर सेकेंडरी स्कूल, कैथल की डिजिटल गाइड। मैं आपको हमारे विद्यालय का एक मार्गदर्शित भ्रमण कराने वाली हूँ। क्या आप भ्रमण शुरू करना चाहेंगे?";
const WELCOME_AUDIO_SRC = "/audio/welcome.mp3";

// ═══════════════════════════════════════════════════════════════
// SECTION 2: COMPONENT
// ═══════════════════════════════════════════════════════════════

type Props = {
  navigate: (route: string) => void;
  openApply: () => void;
};

/** Open DiyanaChatBot from anywhere by dispatching this event */
const openChat = () => window.dispatchEvent(new Event("diyana-open-chat"));

export default function AiAssistant({ navigate, openApply }: Props) {

  // ── State ───────────────────────────────────────────────────
  const [phase, setPhase]               = useState<"welcome" | "tour" | "minimized">("welcome");
  const [visible, setVisible]           = useState(false);
  const [entering, setEntering]         = useState(false);
  const [step, setStep]                 = useState(0);
  const [typing, setTyping]             = useState(false);
  const [displayText, setDisplayText]   = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [isSpeaking, setIsSpeaking]     = useState(false);
  const [minimizedExpanded, setMinimizedExpanded] = useState(false);

  // ── Refs ────────────────────────────────────────────────────
  const audioRef         = useRef<HTMLAudioElement | null>(null);
  const scrollTimerRef   = useRef<number | null>(null);    // auto-scroll setInterval
  const userScrolledRef  = useRef<number>(0);              // countdown: paused by user scroll

  const current = TOUR_STEPS[step];

  // ── Auto-scroll helpers ─────────────────────────────────────

  const stopPageScroll = useCallback(() => {
    if (scrollTimerRef.current !== null) {
      clearInterval(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }
  }, []);

  const startPageScroll = useCallback(() => {
    stopPageScroll();
    userScrolledRef.current = 0;
    // Scroll 2px every 60ms ≈ 33px/sec — slow, guided feel
    scrollTimerRef.current = window.setInterval(() => {
      if (userScrolledRef.current > 0) {
        userScrolledRef.current -= 60; // count down pause timer
        return;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 120;
      if (!atBottom) window.scrollBy(0, 2);
    }, 60);
  }, [stopPageScroll]);

  // Detect manual user scroll → pause auto-scroll for 3 seconds
  useEffect(() => {
    const onManualScroll = () => { userScrolledRef.current = 3000; };
    window.addEventListener("wheel",     onManualScroll, { passive: true });
    window.addEventListener("touchmove", onManualScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel",     onManualScroll);
      window.removeEventListener("touchmove", onManualScroll);
    };
  }, []);

  // Start/stop auto-scroll based on speaking state (tour only)
  useEffect(() => {
    if (phase === "tour" && isSpeaking) {
      // Delay 1.5s so page navigation settles before scroll begins
      const t = setTimeout(startPageScroll, 1500);
      return () => { clearTimeout(t); stopPageScroll(); };
    }
    stopPageScroll();
    return undefined;
  }, [phase, isSpeaking, startPageScroll, stopPageScroll]);

  // ── Audio helpers ───────────────────────────────────────────

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  /**
   * speak — first tries the cached static MP3, then falls back to live API
   * @param audioSrc    path to pre-generated MP3 (e.g. "/audio/welcome.mp3")
   * @param fallbackText Devanagari Hindi text for live TTS fallback
   */
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

    // Try cached file first (fast, no API cost)
    try { await tryPlay(audioSrc); return; } catch { /* fall through */ }

    // Fallback: live TTS API
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
      audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
      audio.onerror = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
      await audio.play();
    } catch {
      setIsSpeaking(false);
    }
  }, [stopAudio]);

  // ── Effects ─────────────────────────────────────────────────

  // Appear after 1.2s with entrance animation
  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      setEntering(true);
      setTimeout(() => setEntering(false), 1000);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  // Navigate + scroll-to-top when tour step changes
  useEffect(() => {
    if (phase !== "tour" || !bubbleVisible) return;
    navigate(current.page as never);
    const t = setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 350);
    return () => clearTimeout(t);
  }, [step, bubbleVisible, phase, navigate, current.page]);

  // Typewriter + auto-speak each tour step
  // Note: voice auto-plays here because user already clicked "Tour Shuru Karein"
  // (that prior user interaction satisfies browser autoplay policy)
  useEffect(() => {
    if (phase !== "tour" || !bubbleVisible) return;
    stopAudio();
    setTyping(true);
    setDisplayText("");
    const text = current.text;
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) { setDisplayText(text.slice(0, i + 1)); i++; }
      else { setTyping(false); clearInterval(interval); }
    }, 18);
    // Auto-play voice — works because user already interacted with page
    const speakTimer = setTimeout(() => speak(current.audioSrc, current.audioText), 500);
    return () => { clearInterval(interval); clearTimeout(speakTimer); stopAudio(); };
  }, [step, bubbleVisible, phase, current.text, current.audioSrc, current.audioText, speak, stopAudio]);

  // Cleanup on unmount
  useEffect(() => () => { stopAudio(); stopPageScroll(); }, [stopAudio, stopPageScroll]);

  // ── Handlers ────────────────────────────────────────────────

  const handleStartTour = () => {
    stopAudio();
    setPhase("tour");
    setStep(0);
    setTimeout(() => setBubbleVisible(true), 300);
  };

  const handleNoThanks = () => { stopAudio(); setPhase("minimized"); };

  const handleNext = () => {
    stopAudio();
    if (step < TOUR_STEPS.length - 1) {
      setBubbleVisible(false);
      setTimeout(() => { setStep((s) => s + 1); setBubbleVisible(true); }, 250);
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
      setMinimizedExpanded((v) => !v);
    }
  };

  const handleRestartTour = () => {
    stopAudio();
    setMinimizedExpanded(false);
    setEntering(true);
    setTimeout(() => setEntering(false), 1000);
    setPhase("welcome");
  };

  const handleVoiceToggle = () => {
    if (isSpeaking) stopAudio();
    else if (phase === "welcome") speak(WELCOME_AUDIO_SRC, WELCOME_AUDIO_TEXT);
    else speak(current.audioSrc, current.audioText);
  };

  if (!visible) return null;

  // ─────────────────────────────────────────────────────────────
  // RENDER A: Welcome Modal
  // ─────────────────────────────────────────────────────────────
  if (phase === "welcome") {
    return (
      <div className="ai-welcome-overlay">
        <div className="ai-welcome-card-wrap">
          <img src="/ai-robot.png" alt="Diyana" className="ai-welcome-robot-float" />

          <div className="ai-welcome-modal">
            <div className="ai-welcome-modal-top">
              <div className="ai-welcome-badge-wrap">
                <span className="ai-welcome-badge">✦ HGSS Digital Guide</span>
              </div>
              <h2 className="ai-welcome-title">Namaste! Main Diyana hoon</h2>
              <p className="ai-welcome-subtitle">Hindu Girls Sr. Sec. School, Kaithal</p>
            </div>

            <div className="ai-welcome-modal-body">
              <div className="ai-welcome-message-box">
                <p className="ai-welcome-message-text">{WELCOME_TEXT}</p>
                {/* Voice button — click to hear welcome in Hindi */}
                <button
                  className={`ai-welcome-voice-btn${isSpeaking ? " speaking" : ""}`}
                  onClick={handleVoiceToggle}
                  title={isSpeaking ? "Rokein" : "Sunein"}
                  aria-label={isSpeaking ? "Awaaz rokein" : "Welcome message sunein"}
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

              {/* Action strip: two main CTA buttons + a small ghost below */}
              <div className="ai-welcome-actions">
                <div className="ai-welcome-actions-row">
                  <button className="ai-btn ai-btn-primary ai-btn-lg" onClick={handleStartTour}>
                    🎓 Tour Shuru Karein
                  </button>
                  <button className="ai-btn ai-btn-chat ai-btn-lg" onClick={() => { setPhase("minimized"); openChat(); }}>
                    💬 Poochein
                  </button>
                </div>
                <button className="ai-btn ai-btn-ghost" onClick={handleNoThanks}>
                  Baad Mein
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER B: Tour Bubble + Corner Robot
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={`ai-assistant${phase === "minimized" ? " ai-minimized" : ""}`}>

      {/* ── Tour Bubble ── */}
      {phase === "tour" && (
        <div className={`ai-bubble${bubbleVisible ? " ai-bubble-in" : ""}`}>

          {/* Progress bar */}
          <div className="ai-bubble-progress">
            <div
              className="ai-bubble-progress-fill"
              style={{ width: `${((step + 1) / TOUR_STEPS.length) * 100}%` }}
            />
          </div>

          {/* Header */}
          <div className="ai-bubble-header">
            <span className="ai-bubble-name">
              Diyana — HGSS Guide
              {isSpeaking && (
                <span className="ai-speaking-dots"><span /><span /><span /></span>
              )}
            </span>
            <div className="ai-bubble-controls">
              <span className="ai-step-counter">{step + 1} / {TOUR_STEPS.length}</span>
              {/* Voice toggle — plays / pauses current step audio */}
              <button
                className={`ai-voice-btn${isSpeaking ? " ai-voice-btn--playing" : ""}`}
                onClick={handleVoiceToggle}
                title={isSpeaking ? "Awaaz rokein" : "Dobara sunein"}
                aria-label={isSpeaking ? "Rokein" : "Sunein"}
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
              <button className="ai-minimize-btn" onClick={handleMinimize} title="Chhota karein">─</button>
            </div>
          </div>

          {/* Auto-scroll indicator */}
          {isSpeaking && (
            <div className="ai-scroll-indicator">
              <span className="ai-scroll-dot" />
              <span>Page scroll ho rahi hai...</span>
            </div>
          )}

          {/* Step title */}
          <div className="ai-bubble-title">{current.title}</div>

          {/* Typewriter text */}
          <p className="ai-bubble-text">
            {displayText}
            {typing && <span className="ai-cursor">|</span>}
          </p>

          {/* Action buttons */}
          <div className="ai-bubble-actions">
            {current.action && (
              <button className="ai-btn ai-btn-primary" onClick={handleStepAction}>
                {current.action}
              </button>
            )}
            <button className="ai-btn ai-btn-secondary" onClick={handleNext}>
              {step < TOUR_STEPS.length - 1 ? "Aage →" : "Samapt Karein"}
            </button>
          </div>

          {/* Chat shortcut at bottom of bubble */}
          <div className="ai-bubble-chat-row">
            <button className="ai-bubble-chat-btn" onClick={openChat}>
              💬 Kuch poochna hai? Diyana se baat karein
            </button>
          </div>
        </div>
      )}

      {/* ── Minimized quick-access popup ── */}
      {phase === "minimized" && minimizedExpanded && (
        <div className="ai-minimized-menu">
          <button className="ai-minimized-option" onClick={handleRestartTour}>
            🎓 Tour Shuru Karein
          </button>
          <button className="ai-minimized-option" onClick={() => { setMinimizedExpanded(false); openChat(); }}>
            💬 Diyana se Poochein
          </button>
        </div>
      )}

      {/* ── Corner Robot Button ── */}
      <button
        className={[
          "ai-robot-btn",
          entering   ? "ai-robot-btn--entering" :
          isSpeaking ? "ai-robot-btn--speaking"  :
                       "ai-robot-btn--idle",
        ].join(" ")}
        onClick={handleRobotClick}
        title={phase === "minimized" ? "Diyana — click karein" : "Chhota karein"}
      >
        <img src="/ai-robot.png" alt="HGSS Guide Diyana" className="ai-robot-img" />
        {phase === "minimized" && (
          <span className="ai-robot-badge-pro">
            {minimizedExpanded ? "✕ Band" : "Guide"}
          </span>
        )}
        <span className="ai-robot-glow" />
      </button>
    </div>
  );
}
