export default function TimetablePage() {
  const schedule = [
    { time: "7:30 – 7:50", activity: "Morning Assembly", type: "assembly" },
    { time: "7:50 – 8:35", activity: "Period 1", type: "class" },
    { time: "8:35 – 9:20", activity: "Period 2", type: "class" },
    { time: "9:20 – 10:05", activity: "Period 3", type: "class" },
    { time: "10:05 – 10:20", activity: "Short Break", type: "break" },
    { time: "10:20 – 11:05", activity: "Period 4", type: "class" },
    { time: "11:05 – 11:50", activity: "Period 5", type: "class" },
    { time: "11:50 – 12:35", activity: "Period 6", type: "class" },
    { time: "12:35 – 13:05", activity: "Lunch Break", type: "break" },
    { time: "13:05 – 13:50", activity: "Period 7", type: "class" },
    { time: "13:50 – 14:35", activity: "Period 8 / Lab / Activity", type: "class" },
    { time: "14:35 – 14:45", activity: "Dispersal & Announcements", type: "assembly" },
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const subjects = {
    Monday:    ["Assembly", "English", "Mathematics", "Science", "Break", "Hindi", "Social Studies", "Computer", "Lunch", "Art & Craft", "P.E.", "Dispersal"],
    Tuesday:   ["Assembly", "Mathematics", "English", "Hindi", "Break", "Science", "Sanskrit", "Social Studies", "Lunch", "Library", "GK", "Dispersal"],
    Wednesday: ["Assembly", "Science", "Hindi", "Mathematics", "Break", "English", "Art", "Sanskrit", "Lunch", "P.E.", "Music", "Dispersal"],
    Thursday:  ["Assembly", "Hindi", "Science", "English", "Break", "Mathematics", "Computer", "Social Studies", "Lunch", "GK", "Sanskrit", "Dispersal"],
    Friday:    ["Assembly", "Social Studies", "Mathematics", "Science", "Break", "English", "Hindi", "Computer", "Lunch", "Art", "P.E.", "Dispersal"],
    Saturday:  ["Assembly", "English", "Mathematics", "Hindi", "Break", "Science", "Social Studies", "GK", "Lunch", "Sports", "Clubs", "Dispersal"],
  };

  const typeColors: Record<string, string> = {
    assembly: "#2C3E50",
    class: "#fff",
    break: "#F4D03F",
  };
  const typeText: Record<string, string> = {
    assembly: "#fff",
    class: "var(--ink)",
    break: "var(--ink)",
  };

  return (
    <>
      <section className="page-banner">
        <div className="crumb">Academics · Timetable</div>
        <h1>School Timetable</h1>
        <p>Our daily schedule is structured to balance rigorous academics with breaks, sports, and co-curricular activities.</p>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Daily Schedule</span>
          <h2>A Day at HGSS</h2>
          <p>School hours: 7:30 AM – 2:45 PM (Monday – Saturday)</p>
        </div>

        <div style={{ maxWidth: 600, margin: "0 auto 60px", display: "flex", flexDirection: "column", gap: 4 }} className="reveal">
          {schedule.map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 0,
              background: typeColors[s.type],
              color: typeText[s.type],
              borderRadius: 8,
              overflow: "hidden",
              border: s.type === "class" ? "1px solid var(--border)" : "none",
              boxShadow: s.type !== "class" ? "0 2px 8px rgba(0,0,0,.08)" : "none",
            }}>
              <div style={{ padding: "11px 16px", fontFamily: "monospace", fontSize: ".82rem", fontWeight: 700, minWidth: 148, borderRight: "1px solid rgba(0,0,0,.07)", background: "rgba(0,0,0,.04)", flexShrink: 0 }}>
                {s.time}
              </div>
              <div style={{ padding: "11px 20px", fontWeight: s.type !== "class" ? 700 : 500 }}>
                {s.activity}
              </div>
            </div>
          ))}
        </div>

        <div className="section-head reveal">
          <div className="divider"></div>
          <span className="eyebrow">Weekly Overview — Middle School Sample</span>
          <h2>Subject Rotation (Classes VI–VIII)</h2>
          <p>Subjects rotate across the week to ensure balanced exposure and prevent fatigue.</p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", maxWidth: 1000, margin: "0 auto", borderCollapse: "collapse", fontSize: ".88rem" }} className="reveal">
            <thead>
              <tr style={{ background: "var(--ink)", color: "#fff" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", borderRadius: "8px 0 0 0", fontWeight: 600 }}>Period / Day</th>
                {days.map(d => <th key={d} style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600 }}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {schedule.map((slot, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "var(--cream)" }}>
                  <td style={{ padding: "10px 16px", fontWeight: 700, fontSize: ".8rem", fontFamily: "monospace", borderRight: "1px solid var(--border)" }}>{slot.time}</td>
                  {days.map(d => (
                    <td key={d} style={{
                      padding: "10px 16px",
                      textAlign: "center",
                      background: (subjects[d as keyof typeof subjects][i] === "Break" || subjects[d as keyof typeof subjects][i] === "Lunch") ? "rgba(244,208,63,.2)" :
                                   (subjects[d as keyof typeof subjects][i] === "Assembly" || subjects[d as keyof typeof subjects][i] === "Dispersal") ? "rgba(44,62,80,.07)" : undefined,
                      fontWeight: (subjects[d as keyof typeof subjects][i] === "Break" || subjects[d as keyof typeof subjects][i] === "Lunch" || subjects[d as keyof typeof subjects][i] === "Assembly") ? 700 : 400,
                    }}>
                      {subjects[d as keyof typeof subjects][i]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: ".83rem", marginTop: 16 }}>* Timetable is indicative. Actual schedules are issued at the start of each academic session.</p>
      </section>
    </>
  );
}
