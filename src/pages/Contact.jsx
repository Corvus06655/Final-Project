import { useState } from "react";
import s from "./Contact.module.css";

const STATUS = [
  ["API Server",           "var(--lime)"  ],
  ["ML Prediction Engine", "var(--lime)"  ],
  ["MongoDB Cluster",      "var(--lime)"  ],
  ["Alert System",         "var(--amber)" ],
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", company:"", interest:"", message:"" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className={`pg ${s.pg}`}>
      <div className={s.layout}>

        {/* ── Left info column ── */}
        <div className={s.left}>
          <span className="stag">// Get in Touch</span>
          <h2 className={s.h2}>Let's Talk<br /><span style={{ color:"var(--violet)" }}>Inventory.</span></h2>
          <p className={s.intro}>
            Have questions about PredictiveSys or want a live demo?
            Our team responds within 24 hours.
          </p>

          {[["📍","New Delhi, India"],["📧","hello@predictivesys.ai"],["📞","+91 98765 43210"]].map(([icon, val]) => (
            <div className={s.detail} key={val}>
              <div className={s.dIcon}>{icon}</div>
              <span>{val}</span>
            </div>
          ))}

          <div className={s.statusBox}>
            <div className={s.stTitle}>// System Status</div>
            {STATUS.map(([label, color]) => (
              <div className={s.stRow} key={label}>
                <span className={s.stLabel}>{label}</span>
                <span className={s.stVal} style={{ color }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:color, display:"inline-block" }} />
                  Operational
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form ── */}
        <div className={s.formBox}>
          <div className={s.row2}>
            <div className={s.fg}>
              <label>Your Name</label>
              <input type="text" placeholder="Arjun Sharma" value={form.name} onChange={set("name")} />
            </div>
            <div className={s.fg}>
              <label>Email</label>
              <input type="email" placeholder="arjun@company.com" value={form.email} onChange={set("email")} />
            </div>
          </div>
          <div className={s.row2}>
            <div className={s.fg}>
              <label>Company</label>
              <input type="text" placeholder="Acme Corp" value={form.company} onChange={set("company")} />
            </div>
            <div className={s.fg}>
              <label>I'm interested in</label>
              <select value={form.interest} onChange={set("interest")}>
                <option value="">Select topic...</option>
                <option>Live Demo</option>
                <option>Enterprise Plan</option>
                <option>Technical Questions</option>
                <option>Partnership</option>
                <option>College / Academic Use</option>
              </select>
            </div>
          </div>
          <div className={s.fg}>
            <label>Message</label>
            <textarea placeholder="Tell us about your inventory challenges..." value={form.message} onChange={set("message")} />
          </div>
          <button
            className={`${s.submit} ${sent ? s.sent : ""}`}
            onClick={() => { if (!form.name || !form.email || !form.message) return; setSent(true); setTimeout(() => setSent(false), 3500); }}
          >
            {sent ? "✓ Message Sent! We'll respond within 24h" : "Send Message →"}
          </button>
        </div>
      </div>
    </div>
  );
}
