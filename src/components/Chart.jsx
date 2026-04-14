export default function Chart({data}){
  const W=360,H=130,PL=4,PR=4,PT=12,PB=20;
  const n=data.length;
  const vals=data.flatMap(d=>[d.a??0,d.p]);
  const max=Math.max(...vals)*1.12;
  const x=i=>PL+(i/(n-1))*(W-PL-PR);
  const y=v=>PT+(1-v/max)*(H-PT-PB);
  const mkPath=k=>data.filter(d=>d[k]!=null).map(d=>{
    const i=data.indexOf(d);
    return`${data.slice(0,i).every(dd=>dd[k]==null)?"M":"L"} ${x(i).toFixed(1)} ${y(d[k]).toFixed(1)}`;
  }).join(" ");
  const mkArea=k=>{
    const pts=data.filter(d=>d[k]!=null);
    if(!pts.length)return"";
    const fi=data.indexOf(pts[0]),li=data.indexOf(pts[pts.length-1]);
    return mkPath(k)+` L${x(li).toFixed(1)} ${y(0).toFixed(1)} L${x(fi).toFixed(1)} ${y(0).toFixed(1)}Z`;
  };
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:130,overflow:"visible"}}>
      <defs>
        <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8ff57" stopOpacity=".18"/><stop offset="100%" stopColor="#b8ff57" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity=".14"/><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[.25,.5,.75].map(v=><line key={v} x1={PL} y1={y(max*v)} x2={W-PR} y2={y(max*v)} stroke="rgba(255,255,255,.05)" strokeWidth="1"/>)}
      <path d={mkArea("a")} fill="url(#ga)"/><path d={mkArea("p")} fill="url(#gp)"/>
      <path d={mkPath("a")} fill="none" stroke="#b8ff57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={mkPath("p")} fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((d,i)=>d.a!=null&&<circle key={i} cx={x(i)} cy={y(d.a)} r="3" fill="#080810" stroke="#b8ff57" strokeWidth="1.5"/>)}
      {data.map((d,i)=><text key={i} x={x(i)} y={H-3} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,.25)" fontFamily="JetBrains Mono,monospace">{d.m}</text>)}
      <line x1={W-100} y1="8" x2={W-88} y2="8" stroke="#b8ff57" strokeWidth="2"/>
      <text x={W-84} y="12" fontSize="8" fill="rgba(255,255,255,.45)" fontFamily="JetBrains Mono,monospace">Actual</text>
      <line x1={W-50} y1="8" x2={W-38} y2="8" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 2"/>
      <text x={W-34} y="12" fontSize="8" fill="rgba(255,255,255,.45)" fontFamily="JetBrains Mono,monospace">Pred</text>
    </svg>
  );
}
