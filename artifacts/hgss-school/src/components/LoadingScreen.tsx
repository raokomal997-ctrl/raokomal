import { useEffect, useState } from "react";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2200);
    const doneTimer = setTimeout(onDone, 2900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className={`ls-backdrop${fading ? " ls-fade-out" : ""}`}>
      <div className="ls-card">
        <div className="ls-logo-ring">
          <img src="/photos/school-logo.jpeg" alt="HGSS Logo" className="ls-logo" />
        </div>
        <h1 className="ls-name">Hindu Girls Sr. Sec. School</h1>
        <p className="ls-tagline">Kaithal · Estd. 1974 · CISCE Affiliated</p>
        <div className="ls-bar-track">
          <div className="ls-bar-fill" />
        </div>
      </div>
    </div>
  );
}
