import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import s from './Login.module.css';

export default function Login({ onDone }) {
  const { login, register } = useAuth();
  const [mode,  setMode]  = useState('login'); // 'login' | 'register'
  const [form,  setForm]  = useState({ name:'', email:'', password:'' });
  const [err,   setErr]   = useState('');
  const [busy,  setBusy]  = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setErr(''); setBusy(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      onDone();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleKey = e => { if (e.key === 'Enter') submit(); };

  return (
    <div className={s.pg}>
      <div className={s.orb1}/><div className={s.orb2}/>
      <div className={s.card}>
        {/* Logo */}
        <div className={s.logo}>
          <span className={s.ldot}/>PredictiveSys
        </div>
        <p className={s.tagline}>AI-Powered Inventory Intelligence</p>

        {/* Tabs */}
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
          {busy ? 'Please wait…' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
        </button>

        {mode === 'login' && (
          <div className={s.hint}>
            Demo: <code>admin@predictivesys.local</code> / <code>Admin123!</code>
          </div>
        )}
      </div>
    </div>
  );
}
