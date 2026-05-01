import { useState } from "react";

const NOTICES = [
  "🎓 Admissions Open 2026–27 — Apply Now for Pre-Primary to XII",
  "🏆 Board Results Declared — 99.2% Pass Rate, School Tops District!",
  "🎭 Annual Function: 15 May 2026 — All parents are cordially invited",
  "📅 Holiday Notice: School closed on 5th May 2026 (Public Holiday)",
  "📚 New Academic Batch Starting Soon — Limited Seats Available",
  "🥇 Judo Championship: Our students win Gold at State Level",
  "📢 NCC Enrollment Open — Join the Cadets Programme Today",
];

type Speed = "slow" | "normal" | "fast";
const SPEED_DURATION: Record<Speed, string> = {
  slow:   "55s",
  normal: "32s",
  fast:   "18s",
};

type Props = { visible: boolean; onClose: () => void };

export default function NotificationTicker({ visible, onClose }: Props) {
  const [speed, setSpeed] = useState<Speed>("normal");

  if (!visible) return null;

  const text = NOTICES.join("   ·   ");

  return (
    <div className="ticker-bar">
      <div className="ticker-live">
        <span className="ticker-dot" />
        <span className="ticker-live-text">LIVE</span>
      </div>

      <div className="ticker-track">
        <div
          className="ticker-content"
          style={{ animationDuration: SPEED_DURATION[speed] }}
        >
          <span>{text}</span>
          <span aria-hidden="true">&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{text}</span>
        </div>
      </div>

      <div className="ticker-controls">
        <button
          className={`ticker-speed${speed === "slow" ? " active" : ""}`}
          onClick={() => setSpeed("slow")}
          title="Slow"
        >
          ‹‹
        </button>
        <button
          className={`ticker-speed${speed === "normal" ? " active" : ""}`}
          onClick={() => setSpeed("normal")}
          title="Normal"
        >
          ›
        </button>
        <button
          className={`ticker-speed${speed === "fast" ? " active" : ""}`}
          onClick={() => setSpeed("fast")}
          title="Fast"
        >
          ››
        </button>
        <button className="ticker-close" onClick={onClose} aria-label="Dismiss ticker">
          ✕
        </button>
      </div>
    </div>
  );
}
