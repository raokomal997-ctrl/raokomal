import type { Route } from "../App";

type Props = { navigate: (r: Route) => void; openApply: () => void };

export default function Footer({ navigate, openApply }: Props) {
  return (
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
            <button title="Facebook">Fb</button>
            <button title="Instagram">Ig</button>
            <button title="YouTube">Yt</button>
            <button title="X / Twitter">𝕏</button>
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
          <div className="footer-contact-line"><span className="ic">📞</span><span>+91 1746 222 333</span></div>
          <div className="footer-contact-line"><span className="ic">✉</span><span>info@hgsskaithal.edu.in</span></div>
        </div>
      </div>

      <div className="footer-bar">
        © {new Date().getFullYear()} Hindu Girls Sr. Sec. School, Kaithal. <em>विद्या ददाति विनयम्</em>
      </div>
    </footer>
  );
}
