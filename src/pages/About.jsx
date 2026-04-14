import { TEAM } from "../data.js";
import s from "./About.module.css";

const CARDS = [
  { icon:"🧠", bg:"rgba(139,92,246,.14)", title:"Machine Learning Logic",  text:"Moving average and trend prediction in pure Node.js. No external ML libraries — tailored to your seasonality and patterns, improving with every cycle." },
  { icon:"📡", bg:"rgba(34,211,238,.11)",  title:"Live Data Feeds",         text:"Integrates with your POS and warehouse systems. Every stock movement tracked 24/7 — with automatic alerts before you run out." },
  { icon:"📈", bg:"rgba(184,255,87,.09)",  title:"Visual Analytics",        text:"Interactive demand charts, KPI dashboards, and trend reports. Your full supply chain in one visual workspace — clear, actionable, always live." },
  { icon:"🔒", bg:"rgba(244,63,94,.09)",   title:"Enterprise Security",     text:"JWT authentication, end-to-end encryption, and role-based access control keep your inventory data safe and your business compliant." },
];

const TECH = ["MongoDB","Express.js","React 18","Node.js","Vite","React Router v6","REST API","JWT Auth","Mongoose ODM","CORS","dotenv","Axios"];

const STEPS = [
  ["01","Data Input",  "MongoDB stores products & sales"    ],
  ["02","Processing",  "Express + Node reads history"        ],
  ["03","Prediction",  "Moving avg calculates demand"        ],
  ["04","API Layer",   "REST pushes insights live"           ],
  ["05","Dashboard",   "React renders alerts & charts"       ],
];

export default function About() {
  return (
    <div className={`pg ${s.pg}`}>

      {/* Hero */}
      <div className={s.hero}>
        <div className={s.orb1} /><div className={s.orb2} />
        <span className="stag">// About the System</span>
        <h1 className="sh" style={{ margin:"0 auto 1rem", maxWidth:600 }}>
          Built for Modern <span style={{ color:"var(--violet)" }}>Supply Chains</span>
        </h1>
        <p className={s.heroSub}>
          PredictiveSys uses Node.js prediction logic and real-time data integration to
          forecast inventory needs before shortages occur — keeping your business running
          without disruption.
        </p>
      </div>

      {/* Pipeline */}
      <div className={s.pipeSection}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <span className="stag">// System Workflow</span>
          <h2 className="sh" style={{ margin:"0 auto" }}>
            How It <span style={{ color:"var(--lime)" }}>Works</span>
          </h2>
        </div>
        <div className={s.pipe}>
          <div className={s.pipeLine} />
          <div className={s.steps}>
            {STEPS.map(([n, h, p]) => (
              <div className={s.step} key={n}>
                <div className={s.num}>{n}</div>
                <h4>{h}</h4>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className={s.cards}>
        {CARDS.map(c => (
          <div className={s.card} key={c.title}>
            <div className={s.cIcon} style={{ background: c.bg }}>{c.icon}</div>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </div>
        ))}
      </div>

      {/* Tech + Team */}
      <div className="sec" style={{ paddingBottom:"3rem" }}>
        <span className="stag">// Technology Stack</span>
        <h2 className="sh" style={{ marginBottom:"1.5rem" }}>
          Pure <span style={{ color:"var(--lime)" }}>MERN Stack</span>
        </h2>
        <div className={s.techRow}>
          {TECH.map(t => <span className={s.techTag} key={t}>{t}</span>)}
        </div>

        <span className="stag" style={{ marginTop:"4rem" }}>// The Team</span>
        <h2 className="sh" style={{ marginBottom:"2rem" }}>
          Meet the <span style={{ color:"var(--violet)" }}>Builders</span>
        </h2>
        <div className={s.teamGrid}>
          {TEAM.map(t => (
            <div className={s.tmCard} key={t.nm}>
              <div className={s.tmAv} style={{ background:t.g, color:"#080810" }}>{t.av}</div>
              <div className={s.tmName}>{t.nm}</div>
              <div className={s.tmRole}>{t.rl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
