import { useState } from "react";
import type { Route } from "../App";
import PolicyModal from "./PolicyModal";
import { SOCIALS } from "../lib/socials";

type PolicyType = "privacy" | "terms" | null;
type Props = { navigate: (r: Route) => void; openApply: () => void };

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
              Established 1974 · CISCE Affiliated · Kaithal, Haryana.<br/>
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
              <li><button onClick={() => navigate("story")}>About</button></li>
              <li><button onClick={() => navigate("programs-primary")}>Academics</button></li>
              <li><button onClick={() => navigate("gallery")}>Gallery</button></li>
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
            <div className="footer-contact-line"><span className="ic">📍</span><span>Ambala Road, Model Town,<br/>Kaithal – 136027, Haryana</span></div>
            <div className="footer-contact-line"><span className="ic">📞</span><span>+91 1746 234 336</span></div>
            <div className="footer-contact-line"><span className="ic">✉</span><span>hinduschoolktl@gmail.com</span></div>
          </div>
        </div>

        <div className="footer-bar">
          <span>© {new Date().getFullYear()} Hindu Girls Sr. Sec. School, Kaithal. <em>विद्या ददाति विनयम्</em></span>
          <div className="footer-legal">
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
