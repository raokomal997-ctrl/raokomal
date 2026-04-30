import { useEffect, useState } from "react";

type Props = { onClose: () => void };

type FormData = {
  studentName: string;
  dob: string;
  gender: string;
  classApplying: string;
  parentName: string;
  phone: string;
  email: string;
  address: string;
  prevSchool: string;
};

const empty: FormData = {
  studentName: "", dob: "", gender: "", classApplying: "",
  parentName: "", phone: "", email: "", address: "", prevSchool: "",
};

function generateRefNo() {
  const yy = String(new Date().getFullYear()).slice(-2);
  const n = Math.floor(100000 + Math.random() * 900000);
  return `HGSS-${yy}-${n}`;
}

export default function AdmissionModal({ onClose }: Props) {
  const [data, setData] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<{ refNo: string; name: string } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const set = (k: keyof FormData, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!data.studentName.trim()) e.studentName = "Student name is required";
    if (!data.dob) e.dob = "Date of birth is required";
    if (!data.gender) e.gender = "Please select";
    if (!data.classApplying) e.classApplying = "Please choose a class";
    if (!data.parentName.trim()) e.parentName = "Parent / Guardian name is required";
    if (!/^[+0-9 ()-]{7,15}$/.test(data.phone.trim())) e.phone = "Enter a valid phone number";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = "Enter a valid email";
    if (!data.address.trim()) e.address = "Residential address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const refNo = generateRefNo();
    const record = { ...data, refNo, submittedAt: new Date().toISOString() };
    try {
      const prev = JSON.parse(localStorage.getItem("hgss_applications") || "[]");
      prev.push(record);
      localStorage.setItem("hgss_applications", JSON.stringify(prev));
    } catch { /* localStorage may be unavailable */ }
    setSubmitted({ refNo, name: data.studentName });
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="apply-title">
        <div className="modal-head">
          <div>
            <h3 id="apply-title">Online Admission Form</h3>
            <p>Session 2026 – 27 · CISCE Curriculum</p>
          </div>
          <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {submitted ? (
            <div className="form-success">
              <div className="check">✓</div>
              <h3>Application Received</h3>
              <p>Thank you, <strong>{submitted.name}</strong>. Your application has been recorded.</p>
              <div style={{ marginBottom: 12 }}>Your reference number:</div>
              <div className="ref-no">{submitted.refNo}</div>
              <p style={{ marginTop: 18, fontSize: ".9rem" }}>
                Please save this reference number. Our admissions team will contact you on the
                given phone number within 2 – 3 working days.
              </p>
              <button className="btn btn-gold" style={{ marginTop: 18 }} onClick={onClose}>Done</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="form-row">
                <div className={`form-field ${errors.studentName ? "invalid" : ""}`}>
                  <label>Student Name <span className="req">*</span></label>
                  <input value={data.studentName} onChange={(e) => set("studentName", e.target.value)} placeholder="Full name" />
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
                    <option value="Pre-Primary">Pre-Primary</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={`Class ${i + 1}`}>{`Class ${i + 1}`}</option>
                    ))}
                  </select>
                  <span className="err">{errors.classApplying}</span>
                </div>
              </div>

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
                  <label>Email (optional)</label>
                  <input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="parent@example.com" />
                  <span className="err">{errors.email}</span>
                </div>
              </div>

              <div className="form-row">
                <div className={`form-field full ${errors.address ? "invalid" : ""}`}>
                  <label>Residential Address <span className="req">*</span></label>
                  <textarea value={data.address} onChange={(e) => set("address", e.target.value)} placeholder="House, Street, Locality, City, PIN" />
                  <span className="err">{errors.address}</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field full">
                  <label>Previous School (if any)</label>
                  <input value={data.prevSchool} onChange={(e) => set("prevSchool", e.target.value)} placeholder="Name of previous school" />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline-dark" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-gold">Submit Application</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
