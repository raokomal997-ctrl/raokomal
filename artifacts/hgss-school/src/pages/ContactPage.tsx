import { useState } from "react";

const SCHOOL_EMAIL   = "hinduschoolktl@gmail.com";
const PHONE_MAIN     = "+91 1746 234 336";
const PHONE_WA       = "917015672075";
const PHONE_ALT1     = "+91 70156 72075";
const PHONE_ALT2     = "+91 99920 65231";

type Form = { name: string; phone: string; subject: string; message: string };
const empty: Form = { name: "", phone: "", subject: "", message: "" };

export default function ContactPage() {
  const [data, setData]     = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent]     = useState(false);

  const set = (k: keyof Form, v: string) => {
    setData(d => ({ ...d, [k]: v }));
    if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!data.name.trim())                              e.name    = "Name is required";
    if (!/^[+0-9 ()-]{7,15}$/.test(data.phone.trim())) e.phone   = "Enter a valid phone number";
    if (!data.subject.trim())                           e.subject = "Subject is required";
    if (data.message.trim().length < 10)                e.message = "Please write at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    const body = [
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      ``,
      `${data.message}`,
    ].join("\n");

    const mailto = `mailto:${SCHOOL_EMAIL}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_blank");

    setSent(true);
    setData(empty);
  };

  const waMsg = encodeURIComponent("Hello, I would like to enquire about Hindu Girls Sr. Sec. School Kaithal.");

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Contact</div>
        <h1>Get in Touch With Us</h1>
        <p>For admissions, academic queries or to schedule a campus visit — we are happy to help.</p>
      </section>

      <section className="section">
        <div className="contact-grid">

          {/* ── LEFT: Contact Info ── */}
          <div className="contact-info reveal">
            <h3>Reach Out Directly</h3>
            <p>Our office is open Monday to Saturday, 8:30 am to 2:30 pm.</p>

            <div className="contact-block">
              <div className="ic">📍</div>
              <div>
                <strong>Address</strong>
                <span>Hindu Girls Sr. Sec. School,<br/>Ambala Road, Model Town,<br/>Kaithal – 136027, Haryana, India</span>
              </div>
            </div>

            <div className="contact-block">
              <div className="ic">📞</div>
              <div>
                <strong>Phone</strong>
                <span>
                  <a href={`tel:${PHONE_MAIN.replace(/\s/g,"")}`} className="contact-link">{PHONE_MAIN}</a>
                </span>
              </div>
            </div>

            <div className="contact-block">
              <div className="ic">📱</div>
              <div>
                <strong>Mobile / WhatsApp</strong>
                <span>
                  <a href={`tel:+91${PHONE_ALT1.replace(/\D/g,"").slice(-10)}`} className="contact-link">{PHONE_ALT1}</a>
                  <br/>
                  <a href={`tel:+91${PHONE_ALT2.replace(/\D/g,"").slice(-10)}`} className="contact-link">{PHONE_ALT2}</a>
                </span>
              </div>
            </div>

            <div className="contact-block">
              <div className="ic">✉</div>
              <div>
                <strong>Email</strong>
                <span>
                  <a href={`mailto:${SCHOOL_EMAIL}`} className="contact-link">{SCHOOL_EMAIL}</a>
                </span>
              </div>
            </div>

            <div className="contact-block">
              <div className="ic">⏰</div>
              <div>
                <strong>Office Hours</strong>
                <span>Mon – Sat · 8:30 am – 2:30 pm<br/>Sunday & Public Holidays — Closed</span>
              </div>
            </div>

            {/* Quick-action buttons */}
            <div className="contact-quick-actions">
              <a
                href={`https://wa.me/${PHONE_WA}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
              <a
                href={`mailto:${SCHOOL_EMAIL}`}
                className="btn btn-outline-dark"
              >
                ✉ Send Email
              </a>
              <a
                href="https://www.google.com/maps/search/Hindu+Girls+Senior+Secondary+School+Ambala+Road+Kaithal+Haryana"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-dark"
              >
                📍 View on Maps
              </a>
            </div>
          </div>

          {/* ── RIGHT: Contact Form ── */}
          <div className="reveal">
            {sent ? (
              <div className="form-success">
                <div className="check">✓</div>
                <h3>Email Client Opened</h3>
                <p>Your message has been prepared and your email app has opened. Please click <strong>Send</strong> in your email app to deliver your message to the school.</p>
                <p style={{ marginTop: 8, fontSize: ".88rem", color: "var(--muted)" }}>
                  Or email us directly at{" "}
                  <a href={`mailto:${SCHOOL_EMAIL}`} style={{ color: "var(--gold-dk)", fontWeight: 600 }}>{SCHOOL_EMAIL}</a>
                </p>
                <button className="btn btn-gold" onClick={() => setSent(false)} style={{ marginTop: 16 }}>Send Another Message</button>
              </div>
            ) : (
              <form className="form-card" onSubmit={submit} noValidate>
                <div className="form-card-head">
                  <h3>Send Us a Message</h3>
                  <p>Fill in the details below and your email app will open with the message ready to send.</p>
                </div>

                <div className="form-row">
                  <div className={`form-field ${errors.name ? "invalid" : ""}`}>
                    <label>Your Name <span className="req">*</span></label>
                    <input value={data.name} onChange={e => set("name", e.target.value)} placeholder="Full name" />
                    <span className="err">{errors.name}</span>
                  </div>
                  <div className={`form-field ${errors.phone ? "invalid" : ""}`}>
                    <label>Phone Number <span className="req">*</span></label>
                    <input value={data.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 …" />
                    <span className="err">{errors.phone}</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className={`form-field full ${errors.subject ? "invalid" : ""}`}>
                    <label>Subject <span className="req">*</span></label>
                    <input value={data.subject} onChange={e => set("subject", e.target.value)} placeholder="What is this about?" />
                    <span className="err">{errors.subject}</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className={`form-field full ${errors.message ? "invalid" : ""}`}>
                    <label>Message <span className="req">*</span></label>
                    <textarea rows={5} value={data.message} onChange={e => set("message", e.target.value)} placeholder="Write your message here…" />
                    <span className="err">{errors.message}</span>
                  </div>
                </div>

                <div className="form-meta">
                  <span>📧 Will be sent to <strong>{SCHOOL_EMAIL}</strong></span>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-gold">✉ Send Email</button>
                  <a
                    href={`https://wa.me/${PHONE_WA}?text=${waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp Instead
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* GOOGLE MAPS EMBED */}
      <section className="maps-section">
        <div className="maps-header">
          <span className="maps-eyebrow">📍 Find Us</span>
          <h2>Our Location</h2>
          <p>Hindu Girls Sr. Sec. School, Ambala Road, Model Town, Kaithal – 136027, Haryana</p>
        </div>
        <div className="maps-frame-wrap">
          <iframe
            title="HGSS Kaithal Location"
            src="https://maps.google.com/maps?q=Hindu+Girls+Senior+Secondary+School+Kaithal+Haryana&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="maps-frame"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="maps-footer-btn">
          <a
            className="btn btn-gold"
            href="https://www.google.com/maps/search/Hindu+Girls+Senior+Secondary+School+Ambala+Road+Kaithal+Haryana"
            target="_blank"
            rel="noopener noreferrer"
          >
            📍 Open in Google Maps
          </a>
        </div>
      </section>
    </>
  );
}
