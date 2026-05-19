/**
 * AiAssistant.tsx — Diyana, HGSS AI Guide
 *
 * Phases:
 *   "welcome"   → intro modal with Tour / Chat / Skip
 *   "tour"      → guided tour bubble: navigates pages + auto-scrolls while voice plays
 *   "chat"      → full inline ChatGPT-style panel (OpenAI streaming)
 *   "minimized" → small robot corner button with pop-up menu
 */

import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/ai-assistant.css";

// ═══════════════════════════════════════════════════════════════
// SECTION 1: MARKDOWN RENDERER (lightweight, no deps)
// ═══════════════════════════════════════════════════════════════

function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="ai-chat-code-inline">{part.slice(1, -1)}</code>;
    return part;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      nodes.push(
        <ul key={key++} className="ai-chat-list">
          {listItems.map((item, i) => <li key={i}>{renderInline(item)}</li>)}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^#{1,3}\s/.test(line)) {
      flushList();
      nodes.push(<p key={key++} className="ai-chat-md-heading">{renderInline(line.replace(/^#{1,3}\s/, ""))}</p>);
    } else if (/^[-*•]\s/.test(line)) {
      listItems.push(line.replace(/^[-*•]\s/, ""));
      while (i + 1 < lines.length && /^[-*•]\s/.test(lines[i + 1])) {
        i++;
        listItems.push(lines[i].replace(/^[-*•]\s/, ""));
      }
      flushList();
    } else if (/^\d+\.\s/.test(line)) {
      flushList();
      const items: string[] = [line.replace(/^\d+\.\s/, "")];
      while (i + 1 < lines.length && /^\d+\.\s/.test(lines[i + 1])) {
        i++;
        items.push(lines[i].replace(/^\d+\.\s/, ""));
      }
      nodes.push(
        <ol key={key++} className="ai-chat-list ai-chat-ol">
          {items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
        </ol>
      );
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      nodes.push(<p key={key++} className="ai-chat-para">{renderInline(line)}</p>);
    }
  }
  flushList();
  return <div className="ai-chat-md">{nodes}</div>;
}

// ═══════════════════════════════════════════════════════════════
// SECTION 2: TOUR DATA
// ═══════════════════════════════════════════════════════════════

type TourStep = {
  title: string;
  text: string;
  audioText: string;
  page: string;
  action?: string;
  route?: string;
  audioSrc: string;
};

const TOUR_STEPS: TourStep[] = [
  {
    title: "About Our School",
    text: "Hindu Girls Sr. Sec. School, Kaithal — affiliated with HBSE (Haryana Board of School Education), has been providing excellence in girls' education for over 50 years. Our mission: empowering girls through Education, Values, and Excellence.",
    audioText: "हिन्दू गर्ल्स सीनियर सेकेंडरी स्कूल, कैथल — हरियाणा बोर्ड ऑफ स्कूल एजुकेशन से संबद्ध एक विद्यालय है जो पचास से अधिक वर्षों से बालिका शिक्षा में उत्कृष्टता प्रदान कर रहा है।",
    page: "our-history",
    action: "Read History",
    route: "our-history",
    audioSrc: "/audio/step-0.mp3",
  },
  {
    title: "Academics",
    text: "Nursery to Class 12 — HBSE board exams at Class 10 and Class 12. Streams available in Class 11–12: Arts, Commerce, and Science. HBSE (Haryana Board of School Education) curriculum.",
    audioText: "नर्सरी से कक्षा बारहवीं तक। हरियाणा बोर्ड ऑफ स्कूल एजुकेशन से संबद्ध। कक्षा ग्यारह और बारह में कला, वाणिज्य और विज्ञान धाराएँ उपलब्ध हैं।",
    page: "curriculum",
    action: "View Curriculum",
    route: "curriculum",
    audioSrc: "/audio/step-1.mp3",
  },
  {
    title: "Admissions",
    text: "Admissions open from Nursery to Class 11. Required documents: Birth Certificate, Marksheet, TC, Photograph, Aadhar Card, and Address Proof.",
    audioText: "प्रवेश नर्सरी से कक्षा ग्यारह तक खुले हैं। आवश्यक दस्तावेज़ — जन्म प्रमाण पत्र, अंकतालिका, आधार कार्ड।",
    page: "admissions",
    action: "Apply Now",
    route: "apply",
    audioSrc: "/audio/step-2.mp3",
  },
  {
    title: "Facilities",
    text: "Well-equipped Science Labs, Computer Lab, Library, Sports Ground, and a safe girls-only campus. A nurturing environment with experienced faculty.",
    audioText: "सुसज्जित विज्ञान प्रयोगशालाएँ, कंप्यूटर प्रयोगशाला, पुस्तकालय और खेल मैदान।",
    page: "facilities",
    action: "View Facilities",
    route: "facilities",
    audioSrc: "/audio/step-3.mp3",
  },
  {
    title: "Achievements",
    text: "Consistently outstanding results in HBSE board exams. Students excelling in sports, cultural, and academic achievements at national and state level.",
    audioText: "एचबीएसई बोर्ड परीक्षाओं में निरंतर उत्कृष्ट परिणाम। विद्यार्थी खेल, सांस्कृतिक और शैक्षणिक क्षेत्रों में राष्ट्रीय और राज्य स्तर पर उत्कृष्ट प्रदर्शन कर रहे हैं।",
    page: "achievements",
    action: "View Achievements",
    route: "achievements",
    audioSrc: "/audio/step-4.mp3",
  },
  {
    title: "Contact Us",
    text: "Address: Ambala Road, Kaithal, Haryana — 136027. Monday to Saturday, morning shift. Feel free to reach out for any queries.",
    audioText: "पता: अंबाला रोड, कैथल, हरियाणा। सोमवार से शनिवार, प्रातःकालीन पाली में।",
    page: "contact",
    action: "Contact Us",
    route: "contact",
    audioSrc: "/audio/step-5.mp3",
  },
];

const WELCOME_AUDIO_SRC = "/audio/welcome.mp3";
const WELCOME_AUDIO_TEXT = "नमस्ते! मैं दियाना हूँ — हिन्दू गर्ल्स सीनियर सेकेंडरी स्कूल, कैथल की डिजिटल गाइड।";
const WELCOME_TEXT = "Namaste! Main Diyana hoon — Hindu Girls Senior Secondary School, Kaithal ki AI guide. Tour shuru karein ya seedha kuch bhi poochein!";

// ═══════════════════════════════════════════════════════════════
// SECTION 3: CHAT TYPE
// ═══════════════════════════════════════════════════════════════

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
};

const QUICK_QS = [
  "Admissions kab hoti hain?",
  "Kaunse subjects hain?",
  "Fees kitni hai?",
  "School ki timings kya hain?",
  "Lab aur facilities kya hain?",
  "Results kaisa rehta hai?",
];

// ═══════════════════════════════════════════════════════════════
// SECTION 4: COMPONENT
// ═══════════════════════════════════════════════════════════════

type Props = {
  navigate: (route: string) => void;
  openApply: () => void;
};

export default function AiAssistant({ navigate, openApply }: Props) {

  // ── Core state ──────────────────────────────────────────────
  const [phase, setPhase]           = useState<"welcome" | "tour" | "chat" | "minimized">("welcome");
  const [visible, setVisible]       = useState(false);
  const [entering, setEntering]     = useState(false);

  // ── Tour state ──────────────────────────────────────────────
  const [step, setStep]             = useState(0);
  const [typing, setTyping]         = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ── Chat state ──────────────────────────────────────────────
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput]   = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatConvId, setChatConvId] = useState<number | null>(null);
  const chatInitializedRef          = useRef(false);
  const chatEndRef                  = useRef<HTMLDivElement>(null);
  const chatInputRef                = useRef<HTMLInputElement>(null);

  // ── Minimized ───────────────────────────────────────────────
  const [minimizedExpanded, setMinimizedExpanded] = useState(false);

  // ── Refs ─────────────────────────────────────────────────────
  const audioRef          = useRef<HTMLAudioElement | null>(null);
  const scrollTimerRef    = useRef<number | null>(null);
  const userScrolledRef   = useRef<number>(0);
  const speakGenRef       = useRef<number>(0);   // cancels stale async speak() calls
  const cachedVoicesRef   = useRef<SpeechSynthesisVoice[]>([]); // pre-loaded voices
  const welcomeSpokenRef  = useRef(false);       // ensures welcome narration plays only once

  const current = TOUR_STEPS[step];

  // ── Auto-scroll helpers ──────────────────────────────────────

  const stopPageScroll = useCallback(() => {
    if (scrollTimerRef.current !== null) {
      cancelAnimationFrame(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }
    // Restore CSS smooth scrolling after tour scroll ends
    document.documentElement.style.scrollBehavior = "";
  }, []);

  const startPageScroll = useCallback(() => {
    stopPageScroll();
    // Disable CSS scroll-behavior:smooth while RAF loop is running —
    // otherwise each scrollBy() queues a new native smooth animation,
    // causing multiple animations to stack and fight each other (jitter).
    document.documentElement.style.scrollBehavior = "auto";

    userScrolledRef.current = 0;
    const SPEED = 50; // px per second
    let lastTime: number | null = null;
    let accumulated = 0; // sub-pixel accumulator — only scroll by integer px

    const frame = (now: number) => {
      if (scrollTimerRef.current === null) return;
      if (lastTime !== null) {
        const dt = Math.min(now - lastTime, 40); // cap to avoid jumps on tab-switch
        if (userScrolledRef.current > 0) {
          // User scrolled — pause auto-scroll briefly
          userScrolledRef.current = Math.max(0, userScrolledRef.current - dt * 4);
          accumulated = 0;
        } else {
          const atBottom =
            window.innerHeight + window.scrollY >= document.body.scrollHeight - 80;
          if (!atBottom) {
            accumulated += (SPEED * dt) / 1000;
            const px = Math.floor(accumulated);
            if (px >= 1) {
              window.scrollBy(0, px); // always integer pixels — no sub-pixel jitter
              accumulated -= px;
            }
          } else {
            accumulated = 0;
          }
        }
      }
      lastTime = now;
      scrollTimerRef.current = requestAnimationFrame(frame);
    };

    scrollTimerRef.current = requestAnimationFrame(frame);
  }, [stopPageScroll]);

  useEffect(() => {
    const onScroll = () => { userScrolledRef.current = 3000; };
    window.addEventListener("wheel",     onScroll, { passive: true });
    window.addEventListener("touchmove", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel",     onScroll);
      window.removeEventListener("touchmove", onScroll);
    };
  }, []);

  useEffect(() => {
    if (phase === "tour" && isSpeaking) {
      const t = setTimeout(startPageScroll, 1500);
      return () => { clearTimeout(t); stopPageScroll(); };
    }
    stopPageScroll();
    return undefined;
  }, [phase, isSpeaking, startPageScroll, stopPageScroll]);

  // ── Audio helpers ────────────────────────────────────────────

  const stopAudio = useCallback(() => {
    speakGenRef.current++;                        // invalidate any in-flight speak()
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; audioRef.current = null; }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((audioSrc: string, fallbackText: string, onEnd?: () => void) => {
    // Cancel any previous speak by incrementing generation BEFORE async work
    speakGenRef.current++;
    const gen = speakGenRef.current;

    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; audioRef.current = null; }
    window.speechSynthesis?.cancel();
    setIsSpeaking(true);

    const handleEnd = () => {
      if (speakGenRef.current !== gen) return;
      setIsSpeaking(false);
      onEnd?.();
    };

    // 1️⃣ Try pre-recorded audio file (synchronous setup, async play)
    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    audio.onended = handleEnd;
    audio.onerror = () => {
      // Audio file failed — immediately fall back to Web Speech API
      if (speakGenRef.current !== gen) return;  // cancelled in the meantime
      audioRef.current = null;

      if (!window.speechSynthesis) { setIsSpeaking(false); return; }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(fallbackText);
      utter.lang = "hi-IN";
      utter.rate = 0.88;
      utter.pitch = 1.05;
      // Use pre-cached voices (loaded on mount — no async wait needed)
      const voices = cachedVoicesRef.current;
      const hiVoice = voices.find((v) => v.lang.startsWith("hi"))
                   ?? voices.find((v) => v.lang.startsWith("en-IN"));
      if (hiVoice) utter.voice = hiVoice;
      utter.onend  = handleEnd;
      utter.onerror = () => { if (speakGenRef.current === gen) setIsSpeaking(false); };
      window.speechSynthesis.speak(utter);
    };
    audio.play().catch(() => {
      // play() rejected — trigger onerror path
      audio.dispatchEvent(new Event("error"));
    });
  }, []);

  // ── Chat helpers ─────────────────────────────────────────────

  const initChat = useCallback(async () => {
    try {
      const res = await fetch("/api/openai/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "HGSS Chat" }),
      });
      const conv = await res.json();
      setChatConvId(conv.id);
      setChatMessages([{
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Namaste! Main Diyana hoon — HGSS ki AI assistant. School ke baare mein ya kuch bhi poochein, main poori madad karungi! 😊\n\nAap Hindi ya English dono mein pooch sakte hain.",
      }]);
    } catch {
      setChatMessages([{ id: crypto.randomUUID(), role: "assistant", content: "Server se connect nahi ho paya. Thodi der baad try karein." }]);
    }
  }, []);

  const sendChatMessage = useCallback(async (text: string) => {
    if (!text.trim() || chatLoading || chatConvId === null) return;
    const userText = text.trim();
    setChatInput("");

    const userId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();
    setChatMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: userText },
      { id: assistantId, role: "assistant", content: "", streaming: true },
    ]);
    setChatLoading(true);

    try {
      const res = await fetch(`/api/openai/conversations/${chatConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userText }),
      });
      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              setChatMessages((prev) =>
                prev.map((m) => m.id === assistantId ? { ...m, content: m.content + data.content } : m)
              );
            }
            if (data.done) {
              setChatMessages((prev) =>
                prev.map((m) => m.id === assistantId ? { ...m, streaming: false } : m)
              );
            }
          } catch { /* skip bad chunk */ }
        }
      }
    } catch {
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: "Kuch error aa gaya. Please dobara try karein.", streaming: false } : m
        )
      );
    } finally {
      setChatLoading(false);
    }
  }, [chatLoading, chatConvId]);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Focus input when chat opens
  useEffect(() => {
    if (phase === "chat") {
      setTimeout(() => chatInputRef.current?.focus(), 200);
      if (!chatInitializedRef.current) {
        chatInitializedRef.current = true;
        initChat();
      }
    }
  }, [phase, initChat]);

  // ── Lifecycle effects ─────────────────────────────────────────

  // Pre-load speech voices so they're ready instantly when tour starts
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) cachedVoicesRef.current = v;
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      setEntering(true);
      setTimeout(() => setEntering(false), 1000);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  // Auto-speak welcome message only once — the very first time Diyana appears
  useEffect(() => {
    if (!visible || phase !== "welcome" || welcomeSpokenRef.current) return;
    welcomeSpokenRef.current = true;
    const t = setTimeout(() => speak(WELCOME_AUDIO_SRC, WELCOME_AUDIO_TEXT), 600);
    return () => { clearTimeout(t); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, phase]);

  useEffect(() => {
    if (phase !== "tour" || !bubbleVisible) return;
    navigate(current.page as never);
    const t = setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 350);
    return () => clearTimeout(t);
  }, [step, bubbleVisible, phase, navigate, current.page]);

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
    // Auto-advance: when narration ends, wait 1.5 s then move to next step (or finish tour)
    const capturedStep = step;
    const autoNext = () => {
      setTimeout(() => {
        if (capturedStep < TOUR_STEPS.length - 1) {
          setBubbleVisible(false);
          setTimeout(() => { setStep((s) => s + 1); setBubbleVisible(true); }, 250);
        } else {
          setBubbleVisible(false);
          setTimeout(() => setPhase("minimized"), 300);
        }
      }, 1500);
    };
    const speakTimer = setTimeout(() => speak(current.audioSrc, current.audioText, autoNext), 300);
    return () => { clearInterval(interval); clearTimeout(speakTimer); stopAudio(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, bubbleVisible, phase]);

  useEffect(() => () => { stopAudio(); stopPageScroll(); }, [stopAudio, stopPageScroll]);

  // Listen for external open-chat events (from other components)
  useEffect(() => {
    const handler = () => { stopAudio(); setBubbleVisible(false); setMinimizedExpanded(false); setPhase("chat"); };
    window.addEventListener("diyana-open-chat", handler);
    return () => window.removeEventListener("diyana-open-chat", handler);
  }, [stopAudio]);

  // Listen for external start-tour events (from DiyanaChatBot "Tour" button)
  useEffect(() => {
    const handler = () => {
      stopAudio();
      setBubbleVisible(false);
      setMinimizedExpanded(false);
      setPhase("tour");
      setStep(0);
      setTimeout(() => setBubbleVisible(true), 300);
    };
    window.addEventListener("diyana-start-tour", handler);
    return () => window.removeEventListener("diyana-start-tour", handler);
  }, [stopAudio]);

  // Broadcast active/idle state so DiyanaChatBot can hide its FABs
  useEffect(() => {
    const isActive = phase !== "minimized" || minimizedExpanded;
    window.dispatchEvent(new CustomEvent(isActive ? "diyana-assistant-active" : "diyana-assistant-idle"));
  }, [phase, minimizedExpanded]);

  // ── Handlers ─────────────────────────────────────────────────

  const handleStartTour = () => {
    stopAudio();
    setPhase("tour");
    setStep(0);
    setTimeout(() => setBubbleVisible(true), 300);
  };

  const handleOpenChat = () => {
    stopAudio();
    setBubbleVisible(false);
    setMinimizedExpanded(false);
    setTimeout(() => setPhase("chat"), 200);
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
    if (phase === "minimized") setMinimizedExpanded((v) => !v);
    if (phase === "chat") setPhase("minimized");
  };

  const handleRestartTour = () => {
    stopAudio();
    setMinimizedExpanded(false);
    setPhase("welcome");
    setEntering(true);
    setTimeout(() => setEntering(false), 1000);
  };

  const handleVoiceToggle = () => {
    if (isSpeaking) stopAudio();
    else if (phase === "welcome") speak(WELCOME_AUDIO_SRC, WELCOME_AUDIO_TEXT);
    else speak(current.audioSrc, current.audioText);
  };

  if (!visible) return null;

  // ═══════════════════════════════════════════════════════════════
  // RENDER A: Welcome Modal
  // ═══════════════════════════════════════════════════════════════
  if (phase === "welcome") {
    return (
      <div className="ai-welcome-overlay" onClick={handleNoThanks}>
        <div className="ai-welcome-card-wrap" onClick={(e) => e.stopPropagation()}>
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
                <button
                  className={`ai-welcome-voice-btn${isSpeaking ? " speaking" : ""}`}
                  onClick={handleVoiceToggle}
                  title={isSpeaking ? "Stop" : "Listen"}
                >
                  {isSpeaking ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="5" y="4" width="4" height="16" rx="1" /><rect x="15" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V22H8v2h8v-2h-3v-1.07A9 9 0 0 0 21 12v-2h-2z"/>
                    </svg>
                  )}
                </button>
              </div>
              <div className="ai-welcome-actions">
                <div className="ai-welcome-actions-row">
                  <button className="ai-btn ai-btn-primary ai-btn-lg" onClick={handleStartTour}>🎓 Start Tour</button>
                  <button className="ai-btn ai-btn-chat ai-btn-lg" onClick={handleOpenChat}>💬 Ask a Question</button>
                </div>
                <button className="ai-btn ai-btn-ghost" onClick={handleNoThanks}>Maybe Later</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER B: Chat Phase — full inline ChatGPT-style panel
  // ═══════════════════════════════════════════════════════════════
  if (phase === "chat") {
    return (
      <div className="ai-assistant ai-chat-mode">
        <div className="ai-chat-panel">

          {/* ── Chat Header ── */}
          <div className="ai-chat-header">
            <div className="ai-chat-header-left">
              <img src="/ai-robot.png" alt="Diyana" className="ai-chat-hdr-avatar" />
              <div>
                <div className="ai-chat-hdr-name">Diyana</div>
                <div className="ai-chat-hdr-status">
                  {chatLoading
                    ? <><span className="ai-chat-loading-dot" /> Thinking...</>
                    : <><span className="ai-chat-online-dot" /> HGSS AI Assistant</>
                  }
                </div>
              </div>
            </div>
            <div className="ai-chat-header-right">
              {/* Switch to tour */}
              <button className="ai-chat-hdr-btn" onClick={handleRestartTour} title="Go to Tour">
                🎓
              </button>
              {/* Minimize */}
              <button className="ai-chat-hdr-btn ai-chat-hdr-close" onClick={handleMinimize} title="Close">✕</button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="ai-chat-messages">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`ai-chat-msg ai-chat-msg-${msg.role}`}>
                {msg.role === "assistant" && (
                  <img src="/ai-robot.png" alt="Diyana" className="ai-chat-msg-avatar" />
                )}
                <div className="ai-chat-bubble">
                  {msg.role === "assistant" ? (
                    msg.content
                      ? <>{renderMarkdown(msg.content)}{msg.streaming && <span className="ai-chat-cursor">|</span>}</>
                      : <span className="ai-chat-typing"><span /><span /><span /></span>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* ── Quick Questions ── */}
          {chatMessages.length <= 1 && !chatLoading && (
            <div className="ai-chat-quick">
              <span className="ai-chat-quick-label">Quick Questions</span>
              <div className="ai-chat-quick-grid">
                {QUICK_QS.map((q) => (
                  <button key={q} className="ai-chat-quick-btn" onClick={() => sendChatMessage(q)}>{q}</button>
                ))}
              </div>
            </div>
          )}

          {/* ── Input Row ── */}
          <div className="ai-chat-input-row">
            <input
              ref={chatInputRef}
              className="ai-chat-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(chatInput); } }}
              placeholder="Ask anything about HGSS..."
              disabled={chatLoading}
              maxLength={600}
            />
            <button
              className="ai-chat-send"
              onClick={() => sendChatMessage(chatInput)}
              disabled={chatLoading || !chatInput.trim()}
              title="Send"
            >
              {chatLoading
                ? <span className="ai-chat-send-spinner" />
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
              }
            </button>
          </div>

          <div className="ai-chat-footer-note">
            Powered by OpenAI · Diyana knows HGSS inside-out
          </div>
        </div>

        {/* Robot button stays visible in chat mode too */}
        <button
          className={`ai-robot-btn${isSpeaking ? " ai-robot-btn--speaking" : " ai-robot-btn--idle"}`}
          onClick={handleRobotClick}
          title="Minimize"
        >
          <img src="/ai-robot.png" alt="Diyana" className="ai-robot-img" />
          <span className="ai-robot-badge-pro">Chat</span>
          <span className="ai-robot-glow" />
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER C: Tour Bubble + Minimized state
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className={`ai-assistant${phase === "minimized" ? " ai-minimized" : ""}`}>

      {/* ── Tour Bubble ── */}
      {phase === "tour" && (
        <div className={`ai-bubble${bubbleVisible ? " ai-bubble-in" : ""}`}>
          <div className="ai-bubble-progress">
            <div className="ai-bubble-progress-fill" style={{ width: `${((step + 1) / TOUR_STEPS.length) * 100}%` }} />
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
                title={isSpeaking ? "Stop" : "Play"}
              >
                {isSpeaking
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="4" height="16" rx="1" /><rect x="15" y="4" width="4" height="16" rx="1" /></svg>
                  : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                }
              </button>
              <button className="ai-minimize-btn" onClick={handleMinimize} title="Minimize">─</button>
            </div>
          </div>

          {isSpeaking && (
            <div className="ai-scroll-indicator">
              <span className="ai-scroll-dot" />
              <span>Page scrolling...</span>
            </div>
          )}

          <div className="ai-bubble-title">{current.title}</div>
          <p className="ai-bubble-text">
            {displayText}
            {typing && <span className="ai-cursor">|</span>}
          </p>

          <div className="ai-bubble-actions">
            {current.action && (
              <button className="ai-btn ai-btn-primary" onClick={handleStepAction}>{current.action}</button>
            )}
            <button className="ai-btn ai-btn-secondary" onClick={handleNext}>
              {step < TOUR_STEPS.length - 1 ? "Next →" : "Finish"}
            </button>
          </div>

          <div className="ai-bubble-chat-row">
            <button className="ai-bubble-chat-btn" onClick={handleOpenChat}>
              💬 Have a question? Chat with Diyana
            </button>
          </div>
        </div>
      )}

      {/* ── Minimized popup menu ── */}
      {phase === "minimized" && minimizedExpanded && (
        <div className="ai-minimized-menu">
          <button className="ai-minimized-option" onClick={handleRestartTour}>🎓 Start Tour</button>
          <button className="ai-minimized-option" onClick={handleOpenChat}>💬 Ask Diyana</button>
        </div>
      )}

      {/* ── Corner Robot Button ── */}
      <button
        className={[
          "ai-robot-btn",
          entering    ? "ai-robot-btn--entering" :
          isSpeaking  ? "ai-robot-btn--speaking"  :
                        "ai-robot-btn--idle",
        ].join(" ")}
        onClick={handleRobotClick}
        title={phase === "minimized" ? "Diyana — click karein" : "Chhota karein"}
      >
        <img src="/ai-robot.png" alt="HGSS Guide Diyana" className="ai-robot-img" />
        {phase === "minimized" && (
          <span className="ai-robot-badge-pro">{minimizedExpanded ? "✕" : "Guide"}</span>
        )}
        <span className="ai-robot-glow" />
      </button>
    </div>
  );
}
