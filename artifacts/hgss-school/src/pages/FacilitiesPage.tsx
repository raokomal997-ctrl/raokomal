const UP = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=72&h=72&fit=crop&q=80`;

const IC: React.CSSProperties = {
  width: 56, height: 56, objectFit: "cover",
  borderRadius: 12, marginBottom: 12, display: "block",
};

import React from "react";

const facilities = [
  { img: UP("1523050854058-8df90110c9f1"), title: "Spacious Campus",      desc: "Sprawling building with bright airy classrooms and large open assembly grounds." },
  { img: UP("1532094349884-543bc11b234d"), title: "Science Laboratories",  desc: "Dedicated Physics, Chemistry and Biology labs with modern apparatus and safety gear." },
  { img: UP("1516321318423-f06f85e504b3"), title: "Computer Lab",          desc: "Networked desktop lab with broadband internet — used from Class III upwards." },
  { img: UP("1481627834876-b7833e8f5570"), title: "Library & Reading Room", desc: "Over 12,000 titles in English, Hindi and Sanskrit, plus periodicals and reference books." },
  { img: UP("1513364776144-60967b0f800f"), title: "Art & Craft Studio",    desc: "A dedicated space for painting, sketching, clay and craft — taught by trained artists." },
  { img: UP("1511379938547-c1f69419868d"), title: "Music & Dance Hall",    desc: "Vocal and instrumental music plus classical, folk and contemporary dance." },
  { img: UP("1568702846914-96b305d2aaeb"), title: "Indoor Sports Hall",    desc: "Judo, table tennis, carrom, chess and yoga — with qualified coaches." },
  { img: UP("1461894228951-5e36d52059a1"), title: "Outdoor Playgrounds",   desc: "Volleyball, basketball, kabaddi and athletics tracks for daily PE periods." },
  { img: UP("1584982751601-97dcc096659c"), title: "Medical Room",          desc: "On-campus medical room with a trained nurse and tie-up with a nearby hospital." },
  { img: UP("1544620347-c4fd4a3d5957"),   title: "School Transport",       desc: "Safe, GPS-tracked buses covering all major routes in and around Kaithal." },
  { img: UP("1567521464027-f127ff144326"), title: "Hygienic Canteen",      desc: "Freshly prepared, supervised meals and snacks at student-friendly prices." },
  { img: UP("1558618666-fcd25c85cd64"),   title: "Safety & Surveillance",  desc: "CCTV-monitored corridors, lady security staff and visitor verification at the gate." },
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
              <img src={f.img} alt={f.title} style={IC} />
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
