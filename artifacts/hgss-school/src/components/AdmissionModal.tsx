import { useEffect, useState } from "react";

type Props = { onClose: () => void };

type FormData = {
  studentName: string; dob: string; gender: string; classApplying: string;
  parentName: string; phone: string; email: string; address: string; prevSchool: string;
};
const empty: FormData = {
  studentName: "", dob: "", gender: "", classApplying: "",
  parentName: "", phone: "", email: "", address: "", prevSchool: "",
};
function generateRefNo() {
  const yy = String(new Date().getFullYear()).slice(-2);
  return `HGSS-${yy}-${Math.floor(100000 + Math.random() * 900000)}`;
}

type Tab = "apply" | "process" | "documents" | "payment" | "contact";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "apply",     label: "Apply Now",   icon: "✏️" },
  { id: "process",   label: "Process",     icon: "🪜" },
  { id: "documents", label: "Documents",   icon: "📄" },
  { id: "payment",   label: "Payment",     icon: "💳" },
  { id: "contact",   label: "Contact",     icon: "📍" },
];

const PROCESS_STEPS = [
  { icon: "🖊️", title: "Fill Online Form",       desc: "Complete the application form on this page. Submit to receive your unique Reference Number instantly." },
  { icon: "📞", title: "School Calls You",        desc: "Our admissions team will call you within 2–3 working days to confirm receipt and schedule your visit." },
  { icon: "🏫", title: "Visit the School",        desc: "Visit the school with all original documents during office hours (Mon–Sat, 8:30 am – 2:30 pm)." },
  { icon: "👩‍💼", title: "Principal Interaction",  desc: "A brief, friendly interaction with the student and parents. No written test for classes Pre-Primary to II." },
  { icon: "📬", title: "Admission Letter",        desc: "If selected, you receive an official Admission Letter within 1–2 days of the interaction." },
  { icon: "💰", title: "Fee Payment",             desc: "Pay the admission and first-term fee at the school counter or via bank transfer to confirm the seat." },
  { icon: "🎒", title: "Enrollment Complete",     desc: "Collect the uniform, ID card, and book list. Your child is officially enrolled at HGSS Kaithal!" },
];

const DOCS_GENERAL = [
  "Birth Certificate (original + 1 photocopy)",
  "Aadhaar Card of student (original + 1 photocopy)",
  "Aadhaar Card of parent / guardian (original + 1 photocopy)",
  "4 recent passport-size photographs of student",
  "Caste / Category Certificate (if applicable — SC/BC/OBC)",
  "Income Certificate (for EWS concession)",
  "Residential address proof (electricity bill / ration card / voter ID)",
];
const DOCS_TRANSFER = [
  "Transfer Certificate (TC) from previous school — mandatory for Class II onwards",
  "School Leaving Certificate (SLC) countersigned by BSEH / Education Department",
  "Previous year's mark sheet / report card (original + 1 photocopy)",
  "Character Certificate from the previous school",
];
const DOCS_XI = [
  "Class X Board Marksheet (BSEH / HBSE)",
  "Class X Pass Certificate",
  "Migration Certificate (if from another board)",
];

const PAYMENT_MODES = [
  { icon: "🏦", method: "Cash",           desc: "Pay directly at the school accounts counter. Receipt issued immediately." },
  { icon: "🔁", method: "Bank Transfer (NEFT / IMPS)", desc: "Transfer to school account and submit the transaction screenshot at the counter." },
  { icon: "📝", method: "Demand Draft",   desc: "DD drawn in favour of \"Hindu Girls Senior Secondary School, Kaithal\"." },
  { icon: "📱", method: "UPI / QR Code",  desc: "Scan the school's UPI QR at the accounts counter. Save the payment screenshot." },
];

const BANK_DETAILS = [
  { label: "Account Name",   value: "Hindu Girls Sr. Sec. School" },
  { label: "Account Number", value: "XXXXXXXXXXXXXXXX" },
  { label: "IFSC Code",      value: "XXXXXXXXXX" },
  { label: "Bank & Branch",  value: "Punjab National Bank, Kaithal" },
];

const SCHEDULE = [
  { label: "Admission Fee",       note: "One-time, due at time of enrollment" },
  { label: "April Instalment",    note: "First-half tuition + annual charges" },
  { label: "October Instalment",  note: "Second-half tuition fee" },
  { label: "Monthly Fee",         note: "Due by 10th of each month; ₹50/day late fine after that" },
];

export default function AdmissionModal({ onClose }: Props) {
  const [tab, setTab]     = useState<Tab>("apply");
  const [data, setData]   = useState<FormData>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<{ refNo: string; name: string } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const set = (k: keyof FormData, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!data.studentName.trim()) e.studentName = "Student name is required";
    if (!data.dob)                 e.dob         = "Date of birth is required";
    if (!data.gender)              e.gender      = "Please select";
    if (!data.classApplying)       e.classApplying = "Please choose a class";
    if (!data.parentName.trim())   e.parentName  = "Parent / Guardian name is required";
    if (!/^[+0-9 ()-]{7,15}$/.test(data.phone.trim())) e.phone = "Enter a valid phone number";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = "Enter a valid email";
    if (!data.address.trim())      e.address     = "Residential address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const refNo = generateRefNo();
    try {
      const prev = JSON.parse(localStorage.getItem("hgss_applications") || "[]");
      prev.push({ ...data, refNo, submittedAt: new Date().toISOString() });
      localStorage.setItem("hgss_applications", JSON.stringify(prev));
    } catch { /* ignore */ }
    setSubmitted({ refNo, name: data.studentName });
  };

  const waMsg = encodeURIComponent("Hello, I would like to enquire about admission at Hindu Girls Sr. Sec. School, Kaithal.");

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card modal-card--wide" role="dialog" aria-modal="true" aria-labelledby="apply-title">

        {/* ── Header ── */}
        <div className="modal-head">
          <div>
            <h3 id="apply-title">Admissions · Session 2026 – 27</h3>
            <p>Hindu Girls Sr. Sec. School, Kaithal · HBSE / BSEH Affiliated</p>
          </div>
          <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
        </div>

        {/* ── Tab Bar ── */}
        <div className="modal-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`modal-tab${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span className="tab-icon">{t.icon}</span>
              <span className="tab-label">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="modal-body">

          {/* ═══ APPLY FORM ═══ */}
          {tab === "apply" && (
            <>
              {submitted ? (
                <div className="form-success">
                  <div className="check">✓</div>
                  <h3>Application Received!</h3>
                  <p>Thank you, <strong>{submitted.name}</strong>. Your application is recorded for Session 2026–27.</p>
                  <div style={{ marginBottom: 10, color: "var(--muted)", fontSize: ".9rem" }}>Your Reference Number</div>
                  <div className="ref-no">{submitted.refNo}</div>
                  <p style={{ marginTop: 16, fontSize: ".88rem", color: "var(--text)", lineHeight: 1.7 }}>
                    Please save this number. Our team will call you within <strong>2–3 working days</strong>.<br />
                    Next step: visit the school with your documents. See the <button onClick={() => setTab("documents")} style={{ background: "none", border: "none", color: "var(--gold-dk)", fontWeight: 700, cursor: "pointer", padding: 0, fontSize: "inherit" }}>Documents tab</button> for the checklist.
                  </p>
                  <button className="btn btn-gold" style={{ marginTop: 18 }} onClick={onClose}>Done</button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <div className="form-section-label">Student Information</div>
                  <div className="form-row">
                    <div className={`form-field ${errors.studentName ? "invalid" : ""}`}>
                      <label>Student Name <span className="req">*</span></label>
                      <input value={data.studentName} onChange={(e) => set("studentName", e.target.value)} placeholder="Full name as on birth certificate" />
                      <span className="err">{errors.studentName}</span>
                    </div>
                    <div className={`form-field ${errors.dob ? "invalid" : ""}`}>
                      <label>Date of Birth <span className="req">*</span></label>
                      <input type="date" value={data.dob} onChange={(e) => set("dob", e.target.value)} />
                      <span className="err">{errors.dob}</span>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className={`form-field ${errors.gender ? "invalid" : ""}`}>
                      <label>Gender <span className="req">*</span></label>
                      <select value={data.gender} onChange={(e) => set("gender", e.target.value)}>
                        <option value="">— Select —</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <span className="err">{errors.gender}</span>
                    </div>
                    <div className={`form-field ${errors.classApplying ? "invalid" : ""}`}>
                      <label>Class Applying For <span className="req">*</span></label>
                      <select value={data.classApplying} onChange={(e) => set("classApplying", e.target.value)}>
                        <option value="">— Select —</option>
                        <option value="Pre-Primary">Pre-Primary (Nursery / KG)</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={`Class ${i + 1}`}>{`Class ${i + 1}`}</option>
                        ))}
                      </select>
                      <span className="err">{errors.classApplying}</span>
                    </div>
                  </div>

                  <div className="form-section-label">Parent / Guardian Information</div>
                  <div className="form-row">
                    <div className={`form-field ${errors.parentName ? "invalid" : ""}`}>
                      <label>Parent / Guardian Name <span className="req">*</span></label>
                      <input value={data.parentName} onChange={(e) => set("parentName", e.target.value)} placeholder="Father / Mother / Guardian" />
                      <span className="err">{errors.parentName}</span>
                    </div>
                    <div className={`form-field ${errors.phone ? "invalid" : ""}`}>
                      <label>Mobile Number <span className="req">*</span></label>
                      <input value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 …" />
                      <span className="err">{errors.phone}</span>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className={`form-field full ${errors.email ? "invalid" : ""}`}>
                      <label>Email Address (optional)</label>
                      <input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="parent@example.com" />
                      <span className="err">{errors.email}</span>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className={`form-field full ${errors.address ? "invalid" : ""}`}>
                      <label>Residential Address <span className="req">*</span></label>
                      <textarea value={data.address} onChange={(e) => set("address", e.target.value)} placeholder="House No., Street, Locality, City, District, PIN Code" />
                      <span className="err">{errors.address}</span>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field full">
                      <label>Previous School (if any)</label>
                      <input value={data.prevSchool} onChange={(e) => set("prevSchool", e.target.value)} placeholder="Name of previous school attended" />
                    </div>
                  </div>

                  <div className="modal-tip">
                    💡 After submitting, check the <button type="button" onClick={() => setTab("documents")} style={{ background: "none", border: "none", color: "var(--gold-dk)", fontWeight: 700, cursor: "pointer", padding: 0 }}>Documents tab</button> to prepare what you need to bring on your school visit.
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-outline-dark" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-gold">Submit Application →</button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* ═══ PROCESS ═══ */}
          {tab === "process" && (
            <div className="tab-content">
              <div className="tab-intro">
                <h4>How Admission Works at HGSS</h4>
                <p>A simple 7-step process from application to enrollment. The entire process typically takes 5–7 working days.</p>
              </div>
              <div className="process-steps">
                {PROCESS_STEPS.map((s, i) => (
                  <div key={i} className="process-step">
                    <div className="step-bubble">
                      <span className="step-icon">{s.icon}</span>
                      <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    {i < PROCESS_STEPS.length - 1 && <div className="step-line" />}
                    <div className="step-body">
                      <div className="step-title">{s.title}</div>
                      <div className="step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="tab-cta">
                <button className="btn btn-gold" onClick={() => setTab("apply")}>Start Application →</button>
              </div>
            </div>
          )}

          {/* ═══ DOCUMENTS ═══ */}
          {tab === "documents" && (
            <div className="tab-content">
              <div className="tab-intro">
                <h4>Documents Required at Admission</h4>
                <p>Bring originals and photocopies of all documents listed below when you visit the school. Missing documents may delay enrollment.</p>
              </div>

              <div className="doc-section">
                <div className="doc-section-head">📋 Required for All Students</div>
                {DOCS_GENERAL.map((d, i) => (
                  <div key={i} className="doc-item">
                    <span className="doc-check">✓</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>

              <div className="doc-section">
                <div className="doc-section-head">🔄 For Students Transferring from Another School</div>
                {DOCS_TRANSFER.map((d, i) => (
                  <div key={i} className="doc-item">
                    <span className="doc-check">✓</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>

              <div className="doc-section">
                <div className="doc-section-head">🎓 Additional for Class XI Admission</div>
                {DOCS_XI.map((d, i) => (
                  <div key={i} className="doc-item">
                    <span className="doc-check">✓</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>

              <div className="modal-tip" style={{ marginTop: 20 }}>
                📌 <strong>Tip:</strong> Get all documents photocopied (self-attested) before your visit to save time at the counter.
              </div>
            </div>
          )}

          {/* ═══ PAYMENT ═══ */}
          {tab === "payment" && (
            <div className="tab-content">
              <div className="tab-intro">
                <h4>Fee Payment Methods</h4>
                <p>Fees can be paid through any of the following modes. Always collect and keep the official receipt issued by the school.</p>
              </div>

              <div className="payment-modes">
                {PAYMENT_MODES.map((m, i) => (
                  <div key={i} className="payment-mode">
                    <span className="payment-icon">{m.icon}</span>
                    <div>
                      <div className="payment-method">{m.method}</div>
                      <div className="payment-desc">{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bank-box">
                <div className="bank-box-head">🏦 Bank Account Details (for NEFT / IMPS)</div>
                <div className="bank-details">
                  {BANK_DETAILS.map((b) => (
                    <div key={b.label} className="bank-row">
                      <span className="bank-label">{b.label}</span>
                      <span className="bank-value">{b.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: ".82rem", color: "var(--muted)", marginTop: 10 }}>
                  After transfer, WhatsApp the screenshot to <strong>+91 70156 72075</strong> with your student's name and Reference Number.
                </div>
              </div>

              <div className="payment-schedule">
                <div className="bank-box-head" style={{ marginBottom: 14 }}>📅 Payment Schedule</div>
                {SCHEDULE.map((s, i) => (
                  <div key={i} className="schedule-row">
                    <span className="schedule-label">{s.label}</span>
                    <span className="schedule-note">{s.note}</span>
                  </div>
                ))}
              </div>

              <div className="modal-tip">
                💡 Annual fees can be paid in <strong>two installments</strong> — April and October — at no extra charge.
              </div>
            </div>
          )}

          {/* ═══ CONTACT ═══ */}
          {tab === "contact" && (
            <div className="tab-content">
              <div className="tab-intro">
                <h4>Contact & Address</h4>
                <p>Visit us, call, or message on WhatsApp for any admission-related queries. Our team is happy to help.</p>
              </div>

              <div className="contact-cards">
                <div className="contact-card">
                  <span className="contact-card-icon">📍</span>
                  <div>
                    <div className="contact-card-label">School Address</div>
                    <div className="contact-card-value">
                      Hindu Girls Sr. Sec. School<br />
                      Ambala Road, Model Town<br />
                      Kaithal – 136027, Haryana, India
                    </div>
                    <a
                      href="https://www.google.com/maps/search/Hindu+Girls+Senior+Secondary+School+Ambala+Road+Kaithal+Haryana"
                      target="_blank" rel="noopener noreferrer"
                      className="contact-card-link"
                    >View on Google Maps →</a>
                  </div>
                </div>

                <div className="contact-card">
                  <span className="contact-card-icon">📞</span>
                  <div>
                    <div className="contact-card-label">Phone (Office)</div>
                    <a href="tel:+9117462343336" className="contact-card-value contact-card-link">+91 1746 234 336</a>
                    <div className="contact-card-label" style={{ marginTop: 10 }}>Mobile / WhatsApp</div>
                    <a href="tel:+917015672075" className="contact-card-value contact-card-link">+91 70156 72075</a>
                    <br />
                    <a href="tel:+919992065231" className="contact-card-value contact-card-link">+91 99920 65231</a>
                  </div>
                </div>

                <div className="contact-card">
                  <span className="contact-card-icon">✉️</span>
                  <div>
                    <div className="contact-card-label">Email</div>
                    <a href="mailto:hinduschoolktl@gmail.com" className="contact-card-value contact-card-link">hinduschoolktl@gmail.com</a>
                  </div>
                </div>

                <div className="contact-card">
                  <span className="contact-card-icon">🕐</span>
                  <div>
                    <div className="contact-card-label">Office Hours</div>
                    <div className="contact-card-value">Monday – Saturday<br />8:30 am – 2:30 pm</div>
                    <div style={{ fontSize: ".82rem", color: "var(--muted)", marginTop: 6 }}>Closed on Sundays & Public Holidays</div>
                  </div>
                </div>
              </div>

              <div className="contact-quick">
                <a
                  href={`https://wa.me/917015672075?text=${encodeURIComponent("Hello, I would like to enquire about admission at Hindu Girls Sr. Sec. School, Kaithal.")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-wa"
                  style={{ flex: 1 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Us
                </a>
                <a href="mailto:hinduschoolktl@gmail.com" className="btn btn-outline-dark" style={{ flex: 1 }}>
                  ✉️ Send Email
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
