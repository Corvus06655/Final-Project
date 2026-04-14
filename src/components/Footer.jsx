import s from"./Footer.module.css";
export default function Footer(){
  return(
    <footer className={s.f}>
      <span>© 2026 PredictiveSys · Predictive Inventory Intelligence</span>
      <span className={s.r}>MERN Stack · AI-Powered · Real-Time</span>
    </footer>
  );
}
