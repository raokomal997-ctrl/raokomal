import { useEffect, useRef, useState } from "react";
import "../styles/diyana-chat.css";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
};

const BASE_URL = import.meta.env.BASE_URL ?? "/";

export default function DiyanaChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState<number | null>(null);
  const [pulse, setPulse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
  }, [open]);

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

      const greetId = crypto.randomUUID();
      setMessages([{
        id: greetId,
        role: "assistant",
        content: "Namaste! 😊 Main Diyana hoon — Hindu Girls Sr. Sec. School, Kaithal ki AI assistant. Aap school ke baare mein kuch bhi pooch sakti hain — admissions, fees, classes, events — main yahan hoon aapki madad ke liye!",
      }]);
    } catch {
      setMessages([{
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Namaste! Abhi server se connect nahi ho pa raha. Please thodi der baad try karein.",
      }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || convId === null) return;
    const userText = input.trim();
    setInput("");

    const userId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: userId, role: "user", content: userText }]);
    setLoading(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "", streaming: true }]);

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
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + data.content }
                    : m
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

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "Admissions kab hoti hain?",
    "School ki timings kya hain?",
    "Kaunse subjects hain?",
    "School kahan hai?",
  ];

  return (
    <>
      <button
        className={`dc-fab${open ? " dc-fab-open" : ""}${pulse ? " dc-fab-pulse" : ""}`}
        onClick={() => setOpen((o) => !o)}
        title="Chat with Diyana"
        aria-label="Open AI chat"
      >
        {open ? (
          <span className="dc-fab-icon">✕</span>
        ) : (
          <span className="dc-fab-icon">💬</span>
        )}
        {!open && pulse && <span className="dc-fab-dot" />}
      </button>

      {open && (
        <div className="dc-panel">
          <div className="dc-header">
            <div className="dc-header-info">
              <img src="/ai-robot.png" alt="Diyana" className="dc-avatar" />
              <div>
                <div className="dc-name">Diyana</div>
                <div className="dc-status">
                  <span className="dc-online-dot" />
                  HGSS AI Assistant
                </div>
              </div>
            </div>
            <button className="dc-close" onClick={() => setOpen(false)}>✕</button>
          </div>

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

          {messages.length <= 1 && (
            <div className="dc-quick">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  className="dc-quick-btn"
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="dc-input-row">
            <input
              ref={inputRef}
              className="dc-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Apna sawaal yahan likhein..."
              disabled={loading}
              maxLength={500}
            />
            <button
              className="dc-send"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
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
