import { SOCIALS } from "../lib/socials";

export default function SocialSidebar() {
  return (
    <div className="social-sidebar" aria-label="Social media links">
      {SOCIALS.map(s => (
        <a
          key={s.key}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`social-sidebar-item ss-${s.key}`}
          aria-label={s.label}
          title={s.label}
        >
          <span className="ss-icon">{s.icon}</span>
          <span className="ss-label">{s.label}</span>
        </a>
      ))}
    </div>
  );
}
