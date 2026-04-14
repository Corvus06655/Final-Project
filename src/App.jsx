import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Inventory from './pages/Inventory.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import { useAuth } from './context/AuthContext.jsx';
import './App.css';

export default function App() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState('home');

  const nav = (p) => setPage(p);

  if (!user) return <Login onDone={() => setPage('home')} />;

  return (
    <>
      {/* Global atmospheric layers */}
      <div className="stars" aria-hidden="true"/>
      <div className="grain" aria-hidden="true"/>
      <Navbar page={page} nav={nav} logout={logout} user={user} />
      {page === 'home'      && <Home nav={nav} />}
      {page === 'about'     && <About />}
      {page === 'dashboard' && <Dashboard />}
      {page === 'inventory' && <Inventory />}
      {page === 'contact'   && <Contact />}
      <Footer nav={nav} />
    </>
  );
}
