const facilities = [
  { ic: "🏛", title: "Spacious Campus",     desc: "Sprawling building with bright airy classrooms and large open assembly grounds." },
  { ic: "🔬", title: "Science Laboratories", desc: "Dedicated Physics, Chemistry and Biology labs with modern apparatus and safety gear." },
  { ic: "💻", title: "Computer Lab",         desc: "Networked desktop lab with broadband internet — used from Class III upwards." },
  { ic: "📚", title: "Library & Reading Room", desc: "Over 12,000 titles in English, Hindi and Sanskrit, plus periodicals and reference books." },
  { ic: "🎨", title: "Art & Craft Studio",   desc: "A dedicated space for painting, sketching, clay and craft — taught by trained artists." },
  { ic: "🎵", title: "Music & Dance Hall",   desc: "Vocal and instrumental music plus classical, folk and contemporary dance." },
  { ic: "🥋", title: "Indoor Sports Hall",   desc: "Judo, table tennis, carrom, chess and yoga — with qualified coaches." },
  { ic: "⚽", title: "Outdoor Playgrounds",   desc: "Volleyball, basketball, kabaddi and athletics tracks for daily PE periods." },
  { ic: "🏥", title: "Medical Room",         desc: "On-campus medical room with a trained nurse and tie-up with a nearby hospital." },
  { ic: "🚌", title: "School Transport",      desc: "Safe, GPS-tracked buses covering all major routes in and around Kaithal." },
  { ic: "🍱", title: "Hygienic Canteen",      desc: "Freshly prepared, supervised meals and snacks at student-friendly prices." },
  { ic: "🛡", title: "Safety & Surveillance",  desc: "CCTV-monitored corridors, lady security staff and visitor verification at the gate." },
];

export default function FacilitiesPage() {
  return (
    <>
      <section className="page-banner">
        <div className="crumb">Campus Life · Facilities</div>
        <h1>A Campus Built to Help Every Student Thrive</h1>
        <p>Modern infrastructure, traditional values — purpose-built for a girls' school environment.</p>
      </section>

      <section className="section">
        <div className="facilities-grid">
          {facilities.map((f) => (
            <div key={f.title} className="fac-card reveal">
              <div className="ic">{f.ic}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
