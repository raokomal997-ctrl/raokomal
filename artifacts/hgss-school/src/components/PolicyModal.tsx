type PolicyType = "privacy" | "terms";

type Props = { type: PolicyType; onClose: () => void };

const CONTENT: Record<PolicyType, { title: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "Information We Collect",
        body: "We collect personal information such as name, contact number, email address, and student details when you fill out our admission enquiry or contact forms. We do not collect any sensitive financial data.",
      },
      {
        heading: "How We Use Your Information",
        body: "The information collected is used solely for admission processing, school communications, event notifications, and academic updates. We do not use your data for marketing or commercial purposes.",
      },
      {
        heading: "Data Sharing",
        body: "We do not sell, trade, or share your personal information with any third party. Information may be shared with relevant government bodies or CISCE as required for academic and affiliation purposes.",
      },
      {
        heading: "Data Security",
        body: "We take reasonable precautions to protect your information from unauthorized access, alteration, or disclosure. Our systems are reviewed periodically to ensure compliance with school data protection standards.",
      },
      {
        heading: "Cookies",
        body: "This website may use cookies to enhance user experience. You may choose to disable cookies through your browser settings; however, some features of the website may not function properly as a result.",
      },
      {
        heading: "Children's Privacy",
        body: "As a school website, we are aware that children may visit our site. We do not knowingly collect personal data directly from students without parental consent. All student data is collected through parents or guardians.",
      },
      {
        heading: "Contact",
        body: "For any queries regarding this privacy policy, please contact us at info@hgsskaithal.edu.in or call +91 1746 222 333.",
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    sections: [
      {
        heading: "Acceptance of Terms",
        body: "By accessing and using this website, you agree to comply with and be bound by the following terms and conditions. If you do not agree with any part of these terms, please refrain from using this website.",
      },
      {
        heading: "Use of Website",
        body: "This website is intended for informational purposes about Hindu Girls Senior Secondary School, Kaithal. All content on this website is the exclusive property of the school. Unauthorized reproduction or distribution is prohibited.",
      },
      {
        heading: "Accuracy of Information",
        body: "While we strive to keep all information on this website accurate and up-to-date, the school reserves the right to make changes without prior notice. Dates, fees, and schedules are subject to change as per school policy.",
      },
      {
        heading: "Intellectual Property",
        body: "All images, logos, text, and other content on this website are protected by copyright. The school logo, name, and associated marks are registered trademarks of Hindu Girls Sr. Sec. School, Kaithal.",
      },
      {
        heading: "Links to External Sites",
        body: "This website may contain links to third-party websites for reference purposes. We do not endorse or take responsibility for the content, privacy policies, or practices of any external site.",
      },
      {
        heading: "Limitation of Liability",
        body: "The school shall not be liable for any damages arising from the use or inability to use this website, including but not limited to errors, interruptions, or data loss.",
      },
      {
        heading: "Governing Law",
        body: "These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from the use of this website shall be subject to the jurisdiction of courts in Kaithal, Haryana.",
      },
      {
        heading: "Changes to Terms",
        body: "Hindu Girls Sr. Sec. School reserves the right to modify these terms at any time. Continued use of the website after changes are posted constitutes your acceptance of the revised terms.",
      },
    ],
  },
};

export default function PolicyModal({ type, onClose }: Props) {
  const { title, sections } = CONTENT[type];

  return (
    <div className="policy-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="policy-modal">
        <div className="policy-header">
          <div>
            <p className="policy-eyebrow">Hindu Girls Sr. Sec. School · Kaithal</p>
            <h2 className="policy-title">{title}</h2>
          </div>
          <button className="policy-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="policy-body">
          <p className="policy-date">Last updated: May 2026</p>
          {sections.map(s => (
            <div className="policy-section" key={s.heading}>
              <h3>{s.heading}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
