/**
 * AiAssistant.tsx — Diyana, HGSS ki AI Tour Guide
 *
 * Is file mein teen cheezein hain:
 *   1. TOUR_STEPS  — school ke baare mein 6 step ki jaankari
 *   2. Audio Logic — pehle cached MP3 chalata hai, agar fail ho toh live API se maangta hai
 *   3. UI          — teen states: welcome modal → tour bubble → minimized corner robot
 *
 * File Structure:
 *   ┌─ Types & Constants (TourStep, TOUR_STEPS, WELCOME_TEXT)
 *   ├─ Component State  (phase, step, isSpeaking, etc.)
 *   ├─ Audio Functions  (stopAudio, speak)
 *   ├─ Effects          (auto-show, auto-speak, typewriter, navigation)
 *   ├─ Event Handlers   (handleNext, handleStartTour, etc.)
 *   └─ JSX Render       (welcome modal | tour bubble + robot)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/ai-assistant.css";

// ═══════════════════════════════════════════════════════════════
// SECTION 1: DATA — Har tour step ka content yahan likha hai
//   text      → screen par dikhne wala text (Roman Hindi)
//   audioText → Devanagari Hindi — ElevenLabs ko bheji jaane
//               wali shuddh Hindi (fallback API ke liye)
//   audioSrc  → pehle se bana hua cached MP3 file ka path
// ═══════════════════════════════════════════════════════════════

type TourStep = {
  title: string;       // bubble ka heading
  text: string;        // screen par dikhne wala text
  audioText: string;   // shuddh Hindi — TTS API ke liye
  page: string;        // is step par kaun sa page open hoga
  action?: string;     // CTA button ka label (optional)
  route?: string;      // CTA click hone par kaun se route par jaana hai
  audioSrc: string;    // cached MP3 file path (public/audio/)
};

const TOUR_STEPS: TourStep[] = [
  // ── Step 1: Vidyalay ke baare mein ──
  {
    title: "हमारे विद्यालय के बारे में",
    text: "Hindu Girls Sr. Sec. School, Kaithal — CISCE se manyata prapt ek vidyalay hai jo 50 se adhik varshon se balika shiksha mein uchch shiksha pradan kar raha hai. Hamare vidyalay ka uddeshya hai — Shiksha, Sanskaar aur Uttkarshtta ke madhyam se betiyon ko sashakt banana.",
    audioText: "हिन्दू गर्ल्स सीनियर सेकेंडरी स्कूल, कैथल — सीआईएससीई से संबद्ध एक विद्यालय है जो पचास से अधिक वर्षों से बालिका शिक्षा में उत्कृष्टता प्रदान कर रहा है। हमारा उद्देश्य है — शिक्षा, संस्कार और उत्कृष्टता के माध्यम से बेटियों को सशक्त बनाना। विद्यालय कोड दस हजार तीन सौ पैंसठ, कैथल, हरियाणा।",
    page: "our-history",
    action: "Itihas Padhein",
    route: "our-history",
    audioSrc: "/audio/step-0.mp3",
  },

  // ── Step 2: Shiksha / Curriculum ──
  {
    title: "शिक्षा व्यवस्था",
    text: "Nursery se Kaksha 12 tak — ICSE Kaksha 10 aur ISC Kaksha 12. Kaksha 11-12 mein Kala, Vanijya aur Vigyan dhaaraen uplabdh hain. Angrezi madhyam, CISCE pathyakram ke saath vaichaarak adhigam par vishesh bal diya jaata hai.",
    audioText: "नर्सरी से कक्षा बारहवीं तक — आईसीएसई कक्षा दस और आईएससी कक्षा बारह। कक्षा ग्यारह और बारह में कला, वाणिज्य और विज्ञान धाराएँ उपलब्ध हैं। अंग्रेजी माध्यम, सीआईएससीई पाठ्यक्रम के साथ वैचारिक अधिगम पर विशेष बल दिया जाता है।",
    page: "curriculum",
    action: "Shiksha Dekhein",
    route: "curriculum",
    audioSrc: "/audio/step-1.mp3",
  },

  // ── Step 3: Pravesh / Admissions ──
  {
    title: "प्रवेश प्रक्रिया",
    text: "Pravesh Nursery se Kaksha 11 tak khule hain. Aavashyak dastaavez: Janm Praman Patra, Anktaalika, TC, Photograph, Aadhar Card aur Nivas Praman. Vidyalay kaaryaalay mein pdhaaraein — hum aapka swagat karenge!",
    audioText: "प्रवेश नर्सरी से कक्षा ग्यारह तक खुले हैं। आवश्यक दस्तावेज़ हैं — जन्म प्रमाण पत्र, अंकतालिका, स्थानांतरण प्रमाण पत्र, फ़ोटोग्राफ, आधार कार्ड और निवास प्रमाण। विद्यालय कार्यालय में पधारें — हम आपका हार्दिक स्वागत करेंगे!",
    page: "admissions",
    action: "Avedan Karein",
    route: "apply",
    audioSrc: "/audio/step-2.mp3",
  },

  // ── Step 4: Suvidhaen / Facilities ──
  {
    title: "विद्यालय की सुविधाएँ",
    text: "Hamare vidyalay mein hain — sujjit Vigyan Prayogshaalaen, Computer Lab, Pustakalay, Khel Maidaan aur surakshit balika parisar. Anubhavi shikshkon ke saath ek poshankari vatavaran jahan har beti vikas kar sake.",
    audioText: "हमारे विद्यालय में हैं — सुसज्जित विज्ञान प्रयोगशालाएँ, कंप्यूटर प्रयोगशाला, पुस्तकालय, खेल मैदान और सुरक्षित बालिका परिसर। अनुभवी शिक्षकों के साथ एक पोषणकारी वातावरण जहाँ हर बेटी विकास कर सके।",
    page: "facilities",
    action: "Suvidhaen Dekhein",
    route: "facilities",
    audioSrc: "/audio/step-3.mp3",
  },

  // ── Step 5: Uplabdhiyan / Achievements ──
  {
    title: "उपलब्धियाँ",
    text: "ICSE aur ISC board pareekshaon mein nirantar uttam parinam. Chhatraen rashtriya aur rajya star par khel, saanskritik aur shaikshnik upalabdhiyan praapt kar rahi hain. Varshik Khel Divas, saanskritik karyakram aur Vigyan Mele bhi aayojit hote hain.",
    audioText: "आईसीएसई और आईएससी बोर्ड परीक्षाओं में निरंतर उत्कृष्ट परिणाम। छात्राएँ राष्ट्रीय और राज्य स्तर पर खेल, सांस्कृतिक और शैक्षणिक उपलब्धियाँ प्राप्त कर रही हैं। वार्षिक खेल दिवस, सांस्कृतिक कार्यक्रम और विज्ञान मेले भी आयोजित होते हैं।",
    page: "achievements",
    action: "Uplabdhiyan Dekhein",
    route: "achievements",
    audioSrc: "/audio/step-4.mp3",
  },

  // ── Step 6: Sampark / Contact ──
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

// Welcome screen ke liye alag text
const WELCOME_TEXT =
  "Namaste! Main Diyana hoon — Hindu Girls Senior Secondary School, Kaithal ki digital guide. Main aapko hamare vidyalay ka ek guided bhraman karaane wali hoon. Kya aap bhraman shuru karna chahenge?";

// Welcome audio ke liye shuddh Hindi (Devanagari) — TTS fallback
const WELCOME_AUDIO_TEXT =
  "नमस्ते! मैं दियाना हूँ — हिन्दू गर्ल्स सीनियर सेकेंडरी स्कूल, कैथल की डिजिटल गाइड। मैं आपको हमारे विद्यालय का एक मार्गदर्शित भ्रमण कराने वाली हूँ। क्या आप भ्रमण शुरू करना चाहेंगे?";

// Cached welcome audio file
const WELCOME_AUDIO_SRC = "/audio/welcome.mp3";

// ═══════════════════════════════════════════════════════════════
// SECTION 2: COMPONENT PROPS
// ═══════════════════════════════════════════════════════════════

type Props = {
  navigate: (route: string) => void;  // page change karne ke liye App.tsx se aata hai
  openApply: () => void;              // Admission form kholne ke liye
};

// ═══════════════════════════════════════════════════════════════
// SECTION 3: MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function AiAssistant({ navigate, openApply }: Props) {

  // ── State Variables ──────────────────────────────────────────
  // phase: assistant kis mode mein hai
  //   "welcome"   → pehli baar wala modal dikhta hai
  //   "tour"      → corner mein bubble + robot dikhta hai
  //   "minimized" → sirf robot dikhta hai, bubble nahi
  const [phase, setPhase] = useState<"welcome" | "tour" | "minimized">("welcome");

  const [visible, setVisible]           = useState(false);   // page load ke baad delay se dikhta hai
  const [entering, setEntering]         = useState(false);   // entrance animation chal rahi hai?
  const [step, setStep]                 = useState(0);       // tour ka current step (0 se 5)
  const [typing, setTyping]             = useState(false);   // typewriter effect chal rahi hai?
  const [displayText, setDisplayText]   = useState("");      // typewriter ka abhi tak dikhaya hua text
  const [bubbleVisible, setBubbleVisible] = useState(false); // tour bubble animate-in hoga?
  const [isSpeaking, setIsSpeaking]     = useState(false);   // audio abhi chal raha hai?

  // Audio element ka reference — pause/stop ke liye
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Current step ka data shortcut
  const current = TOUR_STEPS[step];

  // ── Audio Functions ──────────────────────────────────────────

  /**
   * stopAudio — jo bhi audio chal raha ho use rokta hai
   */
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  /**
   * speak — audio chalata hai
   *   Step 1: Pehle cached MP3 file try karta hai (fast, free)
   *   Step 2: Agar file nahi chali toh live ElevenLabs API call karta hai (fallback)
   *
   * @param audioSrc   — cached MP3 ka path (e.g. "/audio/welcome.mp3")
   * @param fallbackText — agar cached file fail ho toh API ko bhejna wala shuddh Hindi text
   */
  const speak = useCallback(async (audioSrc: string, fallbackText: string) => {
    stopAudio();
    setIsSpeaking(true);

    // Helper: ek audio source se play karne ki koshish karta hai
    const tryPlay = (src: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const audio = new Audio(src);
        audioRef.current = audio;
        audio.onended = () => { setIsSpeaking(false); resolve(); };
        audio.onerror = () => reject(new Error("audio error"));
        audio.play().catch(reject);
      });

    // Pehle cached static file try karo
    try {
      await tryPlay(audioSrc);
      return; // success — bahar nikal jao
    } catch {
      // File nahi chali, neeche fallback API try karega
    }

    // Fallback: live TTS API se audio maango
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
        URL.revokeObjectURL(url); // memory free karo
      };
      audio.onerror = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
      await audio.play();
    } catch {
      setIsSpeaking(false);
    }
  }, [stopAudio]);

  // ── Effects (Side Effects) ───────────────────────────────────

  /**
   * Page load hone ke 1.2 second baad Diyana ko dikhata hai
   * aur entrance animation trigger karta hai
   */
  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      setEntering(true);
      setTimeout(() => setEntering(false), 1000); // animation khatam hone ke baad reset
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  /**
   * Welcome modal dikhne ke baad automatically welcome audio chalata hai
   */
  useEffect(() => {
    if (visible && phase === "welcome") {
      const t = setTimeout(() => speak(WELCOME_AUDIO_SRC, WELCOME_AUDIO_TEXT), 600);
      return () => clearTimeout(t);
    }
  }, [visible, phase, speak]);

  /**
   * Har tour step ke saath page navigate karta hai aur top par scroll karta hai
   */
  useEffect(() => {
    if (phase !== "tour" || !bubbleVisible) return;
    navigate(current.page as never);
    const t = setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 350);
    return () => clearTimeout(t);
  }, [step, bubbleVisible, phase, navigate, current.page]);

  /**
   * Tour step badalne par:
   *   1. Typewriter effect se text dikhata hai
   *   2. 600ms baad voice chalata hai (page load settle ho sake)
   */
  useEffect(() => {
    if (phase !== "tour" || !bubbleVisible) return;
    stopAudio();
    setTyping(true);
    setDisplayText("");
    const text = current.text;
    let i = 0;
    // Typewriter: har 18ms mein ek character add karo
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setTyping(false);
        clearInterval(interval);
      }
    }, 18);
    // Voice play karo — fallback ke liye audioText (shuddh Hindi) use karo
    const speakTimer = setTimeout(() => speak(current.audioSrc, current.audioText), 600);
    return () => {
      clearInterval(interval);
      clearTimeout(speakTimer);
      stopAudio();
    };
  }, [step, bubbleVisible, phase, current.text, current.audioSrc, current.audioText, speak, stopAudio]);

  // Component unmount hone par audio band karo
  useEffect(() => () => stopAudio(), [stopAudio]);

  // ── Event Handlers ───────────────────────────────────────────

  /** "Tour Shuru Karein" button dabane par */
  const handleStartTour = () => {
    stopAudio();
    setPhase("tour");
    setStep(0);
    setTimeout(() => setBubbleVisible(true), 300);
  };

  /** "Nahi Chahiye" button dabane par */
  const handleNoThanks = () => {
    stopAudio();
    setPhase("minimized");
  };

  /** "Aage" button dabane par — agla step ya tour khatam */
  const handleNext = () => {
    stopAudio();
    if (step < TOUR_STEPS.length - 1) {
      setBubbleVisible(false);
      setTimeout(() => {
        setStep((s) => s + 1);
        setBubbleVisible(true);
      }, 250);
    } else {
      // Tour khatam — minimize kar do
      setBubbleVisible(false);
      setTimeout(() => setPhase("minimized"), 300);
    }
  };

  /** Step ke CTA button (e.g. "Avedan Karein") dabane par */
  const handleStepAction = () => {
    if (!current.route) return;
    stopAudio();
    if (current.route === "apply") openApply();
    else navigate(current.route as never);
    setBubbleVisible(false);
    setTimeout(() => setPhase("minimized"), 300);
  };

  /** Minimize button dabane par */
  const handleMinimize = () => {
    stopAudio();
    setBubbleVisible(false);
    setTimeout(() => setPhase("minimized"), 300);
  };

  /** Robot image par click — minimized se wapas laata hai ya minimize karta hai */
  const handleRobotClick = () => {
    if (phase === "minimized") {
      setEntering(true);
      setTimeout(() => setEntering(false), 1000);
      setPhase("welcome");
    } else if (phase === "tour") {
      handleMinimize();
    }
  };

  /** Voice button (play/pause toggle) */
  const handleVoiceToggle = () => {
    if (isSpeaking) {
      stopAudio();
    } else if (phase === "welcome") {
      speak(WELCOME_AUDIO_SRC, WELCOME_AUDIO_TEXT);
    } else {
      speak(current.audioSrc, current.audioText);
    }
  };

  // ── Render ───────────────────────────────────────────────────

  // Jab tak page load nahi ho jaata, kuch nahi dikhao
  if (!visible) return null;

  // ─────────────────────────────────────────────
  // RENDER A: Welcome Modal (pehli baar wala popup)
  // ─────────────────────────────────────────────
  if (phase === "welcome") {
    return (
      <div className="ai-welcome-overlay">
        <div className="ai-welcome-card-wrap">
          {/* Diyana ka robot image — card ke upar float karta hai */}
          <img src="/ai-robot.png" alt="Diyana" className="ai-welcome-robot-float" />

          <div className="ai-welcome-modal">
            {/* Card ka upar wala dark section */}
            <div className="ai-welcome-modal-top">
              <div className="ai-welcome-badge-wrap">
                <span className="ai-welcome-badge">HGSS Digital Guide</span>
              </div>
              <h2 className="ai-welcome-title">Namaste! Main Diyana hoon</h2>
              <p className="ai-welcome-subtitle">Hindu Girls Sr. Sec. School, Kaithal</p>
            </div>

            {/* Card ka neeche wala body section */}
            <div className="ai-welcome-modal-body">
              {/* Welcome message box + voice button */}
              <div className="ai-welcome-message-box">
                <p className="ai-welcome-message-text">{WELCOME_TEXT}</p>
                <button
                  className={`ai-welcome-voice-btn${isSpeaking ? " speaking" : ""}`}
                  onClick={handleVoiceToggle}
                  title={isSpeaking ? "Rokein" : "Sunein"}
                  aria-label={isSpeaking ? "Awaaz rokein" : "Welcome message sunein"}
                >
                  {/* Pause icon (jab chal raha ho) */}
                  {isSpeaking ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="5" y="4" width="4" height="16" rx="1" />
                      <rect x="15" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    /* Mic icon (jab band ho) */
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V22H8v2h8v-2h-3v-1.06A9 9 0 0 0 21 12v-2h-2z"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Action buttons */}
              <div className="ai-welcome-actions">
                <button className="ai-btn ai-btn-primary ai-btn-lg" onClick={handleStartTour}>
                  Tour Shuru Karein
                </button>
                <button className="ai-btn ai-btn-ghost ai-btn-lg" onClick={handleNoThanks}>
                  Nahi Chahiye
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // RENDER B: Tour Bubble + Corner Robot Widget
  // ─────────────────────────────────────────────
  return (
    <div className={`ai-assistant${phase === "minimized" ? " ai-minimized" : ""}`}>

      {/* Tour bubble — sirf tour phase mein dikhta hai */}
      {phase === "tour" && (
        <div className={`ai-bubble${bubbleVisible ? " ai-bubble-in" : ""}`}>

          {/* Progress bar — kitne steps complete hue */}
          <div className="ai-bubble-progress">
            <div
              className="ai-bubble-progress-fill"
              style={{ width: `${((step + 1) / TOUR_STEPS.length) * 100}%` }}
            />
          </div>

          {/* Header: name + speaking dots + controls */}
          <div className="ai-bubble-header">
            <span className="ai-bubble-name">
              Diyana — HGSS Guide
              {/* Animated dots jab audio chal raha ho */}
              {isSpeaking && (
                <span className="ai-speaking-dots">
                  <span /><span /><span />
                </span>
              )}
            </span>
            <div className="ai-bubble-controls">
              <span className="ai-step-counter">{step + 1} / {TOUR_STEPS.length}</span>
              {/* Voice play/pause button */}
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
              {/* Minimize button */}
              <button className="ai-minimize-btn" onClick={handleMinimize} title="Chhota karein">─</button>
            </div>
          </div>

          {/* Step title */}
          <div className="ai-bubble-title">{current.title}</div>

          {/* Step content — typewriter effect se aata hai */}
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
        </div>
      )}

      {/* Corner robot button — hamesha dikhta hai */}
      <button
        className={[
          "ai-robot-btn",
          entering   ? "ai-robot-btn--entering" :  // entrance animation
          isSpeaking ? "ai-robot-btn--speaking"  :  // speaking animation
                       "ai-robot-btn--idle",         // idle sway animation
        ].join(" ")}
        onClick={handleRobotClick}
        title={phase === "minimized" ? "Tour dobara shuru karein" : "Chhota karein"}
      >
        <img src="/ai-robot.png" alt="HGSS Guide Diyana" className="ai-robot-img" />
        {/* "Guide" badge — sirf minimized state mein dikhta hai */}
        {phase === "minimized" && <span className="ai-robot-badge-pro">Guide</span>}
        {/* Glow effect */}
        <span className="ai-robot-glow" />
      </button>
    </div>
  );
}
