import { useState } from "react";
import type { Route } from "../App";
import PolicyModal from "./PolicyModal";
import { SOCIALS } from "../lib/socials";

type PolicyType = "privacy" | "terms" | null;
type Props = { navigate: (r: Route) => void; openApply: () => void };

function IconPin() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-10 7L2 7"/>
    </svg>
  );
}

export default function Footer({ navigate, openApply }: Props) {
  const [policy, setPolicy] = useState<PolicyType>(null);

  return (
    <>
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div className="footer-logo"><img src="/photos/school-logo.jpeg" alt="HGSS logo" /></div>
              <h3>Hindu Girls Sr. Sec. School</h3>
            </div>
            <p>
              Established 1974 · HBSE Affiliated · Kaithal, Haryana.<br/>
              Empowering girls through Education, Values & Excellence for over 50 years.
            </p>
            <div className="footer-social">
              {SOCIALS.map(s => (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`footer-social-icon fs-${s.key}`}
                  aria-label={s.label}
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><button onClick={() => navigate("home")}>Home</button></li>
              <li><button onClick={() => navigate("our-history")}>About</button></li>
              <li><button onClick={() => navigate("curriculum")}>Academics</button></li>
              <li><button onClick={() => navigate("events-activities")}>Campus Life</button></li>
              <li><button onClick={() => navigate("school-gallery")}>Gallery</button></li>
              <li><button onClick={() => navigate("contact")}>Contact</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Admissions</h4>
            <ul>
              <li><button onClick={openApply}>Apply Online</button></li>
              <li><button onClick={() => navigate("admissions")}>Eligibility</button></li>
              <li><button onClick={() => navigate("admissions")}>Fee Details</button></li>
              <li><button onClick={() => navigate("notices")}>Notices</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Reach Us</h4>
            <div className="footer-contact-line">
              <span className="ic"><IconPin /></span>
              <span>Ambala Road, Model Town,<br/>Kaithal – 136027, Haryana</span>
            </div>
            <div className="footer-contact-line">
              <span className="ic"><IconPhone /></span>
              <span>+91 1746 234 336</span>
            </div>
            <div className="footer-contact-line">
              <span className="ic"><IconMail /></span>
              <span>hinduschoolktl@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="footer-bar">
          <span>© {new Date().getFullYear()} Hindu Girls Sr. Sec. School, Kaithal. <em>विद्या ददाति विनयम्</em></span>
          <div className="footer-bar-right">
            <a href="mailto:hinduschoolktl@gmail.com" className="footer-mail-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-10 7L2 7"/>
              </svg>
              hinduschoolktl@gmail.com
            </a>
            <span className="footer-legal-sep">·</span>
            <button className="footer-legal-link" onClick={() => setPolicy("privacy")}>Privacy Policy</button>
            <span className="footer-legal-sep">·</span>
            <button className="footer-legal-link" onClick={() => setPolicy("terms")}>Terms of Use</button>
          </div>
        </div>
      </footer>

      {policy && <PolicyModal type={policy} onClose={() => setPolicy(null)} />}
    </>
  );
}
