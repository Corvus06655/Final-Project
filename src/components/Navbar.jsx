import { useAuth } from '../context/AuthContext.jsx';
import s from './Navbar.module.css';

const LINKS = [
  { id:'home',      l:'Home'      },
  { id:'dashboard', l:'Dashboard' },
  { id:'inventory', l:'Inventory' },
  { id:'about',     l:'About'     },
  { id:'contact',   l:'Contact'   },
];

export default function Navbar({ page, setPage }) {
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); setPage('home'); };

  return (
    <nav className={s.nav}>
      <button className={s.logo} onClick={() => setPage('home')}>
        <span className={s.dot} />PredictiveSys
      </button>
      <div className={s.links}>
        {LINKS.map(l => (
          <button key={l.id} className={`${s.btn}${page===l.id?' '+s.active:''}`} onClick={() => setPage(l.id)}>{l.l}</button>
        ))}
        {user ? (
          <div className={s.user}>
            <span className={s.uname}>{user.name}</span>
            <span className={s.urole}>{user.role}</span>
            <button className={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
          </div>
        ) : (
          <button className={s.pill} onClick={() => setPage('login')}>Sign In</button>
        )}
      </div>
    </nav>
  );
}
