import { useEffect, useRef, useState, useCallback } from "react";
import "../styles/diyana-chat.css";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
};

type Lang = "hi-IN" | "en-US";

const BASE_URL = import.meta.env.BASE_URL ?? "/";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function DiyanaChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState<number | null>(null);
  const [pulse, setPulse] = useState(true);

  // Voice state
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lang, setLang] = useState<Lang>("hi-IN");
  const [voiceSupported, setVoiceSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef(window.speechSynthesis);
  const lastFullTextRef = useRef("");

  // Check voice support
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(!!SR && !!window.speechSynthesis);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && !initialized.current) {
      initialized.current = true;
      initConversation();
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
      setPulse(false);
    }
    // Stop speech when chat closes
    if (!open) stopSpeaking();
  }, [open]);

  // Rebuild recognition when lang changes
  useEffect(() => {
    if (recording) stopRecording();
  }, [lang]);

  const apiUrl = (path: string) => {
    const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
    return `${base}/api${path}`;
  };

  const initConversation = async () => {
    try {
      const res = await fetch(apiUrl("/openai/conversations"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "HGSS Chat" }),
      });
      const conv = await res.json();
      setConvId(conv.id);
      const greeting = lang === "hi-IN"
        ? "Namaste! Main Diyana hoon — Hindu Girls Sr. Sec. School, Kaithal ki aapki digital guide! Aap school ke baare mein kuch bhi pooch sakti hain — main yahan hoon aapki madad ke liye!"
        : "Hello! I'm Diyana — your digital guide for Hindu Girls Sr. Sec. School, Kaithal. Ask me anything about admissions, academics, facilities or activities!";
      setMessages([{ id: crypto.randomUUID(), role: "assistant", content: greeting }]);
      speakText(greeting);
    } catch {
      setMessages([{ id: crypto.randomUUID(), role: "assistant", content: "Namaste! Server se connect nahi ho pa raha. Please thodi der baad try karein." }]);
    }
  };

  // ── Speech Synthesis ──
  const speakText = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    stopSpeaking();

    // Strip markdown-style symbols for cleaner speech
    const clean = text.replace(/[*_~`#>]/g, "").replace(/\n+/g, ". ");
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = lang;
    utter.rate = 0.95;
    utter.pitch = 1.05;

    // Pick a Hindi voice if available
    const voices = synthRef.current.getVoices();
    const preferred = voices.find((v) =>
      lang === "hi-IN"
        ? v.lang.startsWith("hi") || v.name.toLowerCase().includes("hindi")
        : v.lang.startsWith("en") && v.name.toLowerCase().includes("female")
    );
    if (preferred) utter.voice = preferred;

    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);

    synthRef.current.speak(utter);
  }, [lang]);

  const stopSpeaking = () => {
    synthRef.current?.cancel();
    setSpeaking(false);
  };

  // ── Speech Recognition ──
  const startRecording = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    stopSpeaking();
    const recognition = new SR();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setRecording(true);
      setTranscript("");
      lastFullTextRef.current = "";
    };

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      const combined = (lastFullTextRef.current + final).trim();
      if (final) lastFullTextRef.current = combined;
      setTranscript(combined || interim);
      setInput(combined || interim);
    };

    recognition.onend = () => {
      setRecording(false);
      recognitionRef.current = null;
      // Auto-send if there's captured text
      const captured = lastFullTextRef.current.trim();
      if (captured) {
        setInput(captured);
        setTimeout(() => sendMessageText(captured), 100);
      }
      setTranscript("");
    };

    recognition.onerror = () => {
      setRecording(false);
      setTranscript("");
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, [lang]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setRecording(false);
    setTranscript("");
  }, []);

  const toggleRecording = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  // ── Send Message ──
  const sendMessageText = async (text: string) => {
    if (!text.trim() || loading || convId === null) return;
    const userText = text.trim();
    setInput("");
    setTranscript("");
    lastFullTextRef.current = "";

    const userId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: userId, role: "user", content: userText }]);
    setLoading(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "", streaming: true }]);

    let fullResponse = "";

    try {
      const res = await fetch(apiUrl(`/openai/conversations/${convId}/messages`), {
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
              fullResponse += data.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + data.content } : m
                )
              );
            }
            if (data.done) {
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m))
              );
            }
          } catch {}
        }
      }

      // Speak the full response after streaming completes
      if (fullResponse) speakText(fullResponse);

    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Kuch error aa gaya. Please dobara try karein.", streaming: false }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (input.trim()) sendMessageText(input.trim());
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions: { hi: string; en: string }[] = [
    { hi: "Admissions kab hoti hain?", en: "When do admissions open?" },
    { hi: "School ki timings kya hain?", en: "What are school timings?" },
    { hi: "Kaunse streams hain?", en: "Which streams are available?" },
    { hi: "Documents kya chahiye?", en: "What documents are needed?" },
  ];

  return (
    <>
      {/* FAB */}
      <button
        className={`dc-fab${open ? " dc-fab-open" : ""}${pulse ? " dc-fab-pulse" : ""}`}
        onClick={() => setOpen((o) => !o)}
        title="Chat with Diyana"
        aria-label="Open AI chat"
      >
        <span className="dc-fab-icon">{open ? "✕" : "💬"}</span>
        {!open && pulse && <span className="dc-fab-dot" />}
      </button>

      {open && (
        <div className="dc-panel">
          {/* Header */}
          <div className="dc-header">
            <div className="dc-header-info">
              <img src="/ai-robot.png" alt="Diyana" className="dc-avatar" />
              <div>
                <div className="dc-name">Diyana</div>
                <div className="dc-status">
                  {speaking ? (
                    <><span className="dc-speaking-dot" /> Speaking...</>
                  ) : (
                    <><span className="dc-online-dot" /> HGSS AI Assistant</>
                  )}
                </div>
              </div>
            </div>
            <div className="dc-header-actions">
              {/* Language toggle */}
              <button
                className={`dc-lang-btn${lang === "hi-IN" ? " dc-lang-active" : ""}`}
                onClick={() => setLang((l) => l === "hi-IN" ? "en-US" : "hi-IN")}
                title="Toggle Hindi / English"
              >
                {lang === "hi-IN" ? "HI" : "EN"}
              </button>
              {/* Stop speaking */}
              {speaking && (
                <button className="dc-stop-btn" onClick={stopSpeaking} title="Stop speaking">
                  ■
                </button>
              )}
              <button className="dc-close" onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>

          {/* Messages */}
          <div className="dc-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`dc-msg dc-msg-${msg.role}`}>
                {msg.role === "assistant" && (
                  <img src="/ai-robot.png" alt="Diyana" className="dc-msg-avatar" />
                )}
                <div className="dc-bubble">
                  {msg.content || (msg.streaming ? <span className="dc-typing"><span /><span /><span /></span> : "")}
                  {msg.streaming && msg.content && <span className="dc-cursor-blink">|</span>}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 1 && (
            <div className="dc-quick">
              {quickQuestions.map((q) => {
                const label = lang === "hi-IN" ? q.hi : q.en;
                return (
                  <button
                    key={label}
                    className="dc-quick-btn"
                    onClick={() => sendMessageText(label)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Live transcript */}
          {transcript && (
            <div className="dc-transcript">
              <span className="dc-transcript-dot" />
              {transcript}
            </div>
          )}

          {/* Input row */}
          <div className="dc-input-row">
            {voiceSupported && (
              <button
                className={`dc-mic-btn${recording ? " dc-mic-active" : ""}`}
                onClick={toggleRecording}
                title={recording ? "Stop recording" : "Speak your question"}
                disabled={loading}
              >
                {recording ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-1 18.93V21h2v-1.07A8.001 8.001 0 0 0 20 12h-2a6 6 0 0 1-12 0H4a8.001 8.001 0 0 0 7 7.93z" />
                  </svg>
                )}
                {recording && <span className="dc-mic-ring" />}
              </button>
            )}
            <input
              ref={inputRef}
              className="dc-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={recording ? "Bol rahi hoon... sun rahi hoon..." : lang === "hi-IN" ? "Apna sawaal yahan likhein..." : "Type your question here..."}
              disabled={loading || recording}
              maxLength={500}
            />
            <button
              className="dc-send"
              onClick={sendMessage}
              disabled={loading || !input.trim() || recording}
              title="Send"
            >
              {loading ? <span className="dc-send-spinner" /> : "➤"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
