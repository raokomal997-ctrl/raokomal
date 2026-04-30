import { useState } from "react";

type Form = { name: string; email: string; phone: string; subject: string; message: string };
const empty: Form = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactPage() {
  const [data, setData] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof Form, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = "Enter a valid email";
    if (!/^[+0-9 ()-]{7,15}$/.test(data.phone.trim())) e.phone = "Enter a valid phone";
    if (!data.subject.trim()) e.subject = "Subject is required";
    if (!data.message.trim() || data.message.trim().length < 10) e.message = "Please write at least 10 characters";
    setErrors(e);
    if (Object.keys(e).length) return;
    try {
      const prev = JSON.parse(localStorage.getItem("hgss_messages") || "[]");
      prev.push({ ...data, sentAt: new Date().toISOString() });
      localStorage.setItem("hgss_messages", JSON.stringify(prev));
    } catch { /* ignore */ }
    setSent(true);
    setData(empty);
  };

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Contact</div>
        <h1>Get in Touch With Us</h1>
        <p>For admissions, academic queries or to schedule a campus visit — we are happy to help.</p>
      </section>

      <section className="section">
        <div className="contact-grid">
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
                <span>+91 1746 222 333<br/>+91 98123 45678 (Admissions)</span>
              </div>
            </div>
            <div className="contact-block">
              <div className="ic">✉</div>
              <div>
                <strong>Email</strong>
                <span>info@hgsskaithal.edu.in<br/>admissions@hgsskaithal.edu.in</span>
              </div>
            </div>
            <div className="contact-block">
              <div className="ic">⏰</div>
              <div>
                <strong>Office Hours</strong>
                <span>Mon – Sat · 8:30 am – 2:30 pm<br/>Sunday & Public Holidays — Closed</span>
              </div>
            </div>
          </div>

          <div className="reveal">
            {sent ? (
              <div className="form-success">
                <div className="check">✓</div>
                <h3>Message Sent</h3>
                <p>Thank you for reaching out. We'll get back to you within 1 – 2 working days.</p>
                <button className="btn btn-gold" onClick={() => setSent(false)} style={{ marginTop: 12 }}>Send Another Message</button>
              </div>
            ) : (
              <form className="form-card" onSubmit={submit} noValidate>
                <div className="form-row">
                  <div className={`form-field ${errors.name ? "invalid" : ""}`}>
                    <label>Your Name <span className="req">*</span></label>
                    <input value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" />
                    <span className="err">{errors.name}</span>
                  </div>
                  <div className={`form-field ${errors.phone ? "invalid" : ""}`}>
                    <label>Phone <span className="req">*</span></label>
                    <input value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 …" />
                    <span className="err">{errors.phone}</span>
                  </div>
                </div>
                <div className="form-row">
                  <div className={`form-field full ${errors.email ? "invalid" : ""}`}>
                    <label>Email <span className="req">*</span></label>
                    <input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
                    <span className="err">{errors.email}</span>
                  </div>
                </div>
                <div className="form-row">
                  <div className={`form-field full ${errors.subject ? "invalid" : ""}`}>
                    <label>Subject <span className="req">*</span></label>
                    <input value={data.subject} onChange={(e) => set("subject", e.target.value)} placeholder="What is this about?" />
                    <span className="err">{errors.subject}</span>
                  </div>
                </div>
                <div className="form-row">
                  <div className={`form-field full ${errors.message ? "invalid" : ""}`}>
                    <label>Message <span className="req">*</span></label>
                    <textarea value={data.message} onChange={(e) => set("message", e.target.value)} placeholder="Write your message here…" />
                    <span className="err">{errors.message}</span>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-gold">Send Message</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
