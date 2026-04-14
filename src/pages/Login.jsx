import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import s from './Login.module.css';

// Animated data packets falling in background
function Packets() {
  const packets = Array.from({length:12},(_,i)=>({
    left: `${5 + i*8}%`,
    height: `${30+Math.random()*60}px`,
    duration: `${3+Math.random()*4}s`,
    delay: `${Math.random()*5}s`,
    opacity: 0.3+Math.random()*0.4,
  }));
  return <>
    {packets.map((p,i)=>(
      <div key={i} className={s.packet} style={{
        left:p.left, height:p.height,
        animationDuration:p.duration, animationDelay:p.delay, opacity:p.opacity
      }}/>
    ))}
  </>;
}

export default function Login({ onDone }) {
  const { login, register } = useAuth();
  const [mode,  setMode]  = useState('login');
  const [form,  setForm]  = useState({ name:'', email:'', password:'' });
  const [err,   setErr]   = useState('');
  const [busy,  setBusy]  = useState(false);
  const [typed, setTyped] = useState('');

  // Typewriter effect for tagline
  const taglines = ['AI-Powered Inventory Intelligence','Predict. Optimize. Never Run Out.','98.2% Prediction Accuracy'];
  useEffect(()=>{
    let tagIdx=0, charIdx=0, deleting=false;
    const tick=()=>{
      const target=taglines[tagIdx];
      if(!deleting){
        charIdx++;
        setTyped(target.slice(0,charIdx));
        if(charIdx===target.length){deleting=true;setTimeout(tick,1800);return;}
      } else {
        charIdx--;
        setTyped(target.slice(0,charIdx));
        if(charIdx===0){deleting=false;tagIdx=(tagIdx+1)%taglines.length;}
      }
      setTimeout(tick,deleting?50:80);
    };
    const id=setTimeout(tick,600);
    return()=>clearTimeout(id);
  },[]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = async () => {
    setErr(''); setBusy(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      onDone();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };
  const handleKey = e => { if (e.key === 'Enter') submit(); };

  return (
    <div className={s.pg}>
      <div className={s.orb1}/><div className={s.orb2}/><div className={s.orb3}/>
      <Packets/>

      {/* Server rack SVG bg */}
      <svg className={s.serverBg} viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4,5].map(i=>(
          <g key={i}>
            <rect x="10" y={10+i*40} width="180" height="32" rx="4" stroke="white" strokeWidth="1.5"/>
            <rect x="18" y={18+i*40} width="12" height="16" rx="2" fill="rgba(184,255,87,0.5)"/>
            <rect x="36" y={20+i*40} width="60" height="3" rx="1" fill="rgba(255,255,255,0.3)"/>
            <rect x="36" y={28+i*40} width="40" height="2" rx="1" fill="rgba(255,255,255,0.15)"/>
            <circle cx="168" cy={26+i*40} r="3" fill={i%3===0?"rgba(244,63,94,0.8)":i%3===1?"rgba(184,255,87,0.8)":"rgba(34,211,238,0.8)"}/>
            <circle cx="178" cy={26+i*40} r="3" fill="rgba(184,255,87,0.6)"/>
          </g>
        ))}
      </svg>

      <div className={s.card}>
        <div className={s.logo}>
          <span className={s.ldot}/>PredictiveSys
        </div>
        <p className={s.tagline}>{typed}<span style={{opacity:.7,animation:'blink 1s infinite'}}>█</span></p>

        <div className={s.tabs}>
          <button className={`${s.tab} ${mode==='login'?s.on:''}`} onClick={()=>setMode('login')}>Sign In</button>
          <button className={`${s.tab} ${mode==='register'?s.on:''}`} onClick={()=>setMode('register')}>Register</button>
        </div>

        {mode === 'register' && (
          <div className={s.fg}>
            <label>Full Name</label>
            <input type="text" placeholder="Arjun Sharma" value={form.name} onChange={set('name')} onKeyDown={handleKey}/>
          </div>
        )}
        <div className={s.fg}>
          <label>Email</label>
          <input type="email" placeholder="admin@predictivesys.local" value={form.email} onChange={set('email')} onKeyDown={handleKey}/>
        </div>
        <div className={s.fg}>
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={form.password} onChange={set('password')} onKeyDown={handleKey}/>
        </div>

        {err && <div className={s.err}>{err}</div>}

        <button className={s.btn} onClick={submit} disabled={busy}>
          {busy ? 'Authenticating…' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
        </button>

        {mode === 'login' && (
          <div className={s.hint}>
            Demo: <code>admin@predictivesys.local</code> / <code>Admin123!</code>
          </div>
        )}

        <div className={s.livePill}>
          <span className={s.liveDot}/>
          Live system · 3 services operational · 0ms latency
        </div>
      </div>
    </div>
  );
}
