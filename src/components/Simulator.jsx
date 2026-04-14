import{useState}from"react";
import s from"./Simulator.module.css";
export default function Simulator(){
  const[avg,setAvg]=useState(250);
  const[gr,setGr]=useState(15);
  const[sea,setSea]=useState(12);
  const pred=Math.round(avg*(1+gr/100)*(sea/10));
  const safe=Math.round(pred*.25);
  const reo=Math.round(pred*.35);
  return(
    <div>
      <span className="stag">// Live Demo</span>
      <h2 className="sh">Demand Prediction <span style={{color:"var(--lime)"}}>Simulator</span></h2>
      <p className="sp">Drag the sliders — our forecasting engine calculates optimal stock levels in real time.</p>
      <div className={s.wrap}>
        <div className={s.sliders}>
          <div className={s.sl}><label>Avg Monthly Sales</label>
            <input type="range" min="50" max="1000" step="1" value={avg} onChange={e=>setAvg(+e.target.value)}/>
            <span className={s.val}>{avg} units / mo</span></div>
          <div className={s.sl}><label>Growth Rate</label>
            <input type="range" min="-20" max="60" step="1" value={gr} onChange={e=>setGr(+e.target.value)}/>
            <span className={s.val}>{gr>0?"+":""}{gr}%</span></div>
          <div className={s.sl}><label>Seasonal Factor</label>
            <input type="range" min="5" max="25" step="1" value={sea} onChange={e=>setSea(+e.target.value)}/>
            <span className={s.val}>{(sea/10).toFixed(1)}×</span></div>
        </div>
        <div className={s.out}>
          {[[pred,"Predicted Demand","var(--lime)"],[safe,"Safety Stock","var(--amber)"],[reo,"Reorder Point","var(--violet)"]].map(([n,l,c])=>(
            <div className={s.oc} key={l}>
              <span className={s.on} style={{color:c}}>{n.toLocaleString()}</span>
              <span className={s.ol}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
