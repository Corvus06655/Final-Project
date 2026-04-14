import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar    from './components/Navbar.jsx';
import Footer    from './components/Footer.jsx';
import Home      from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Inventory from './pages/Inventory.jsx';
import About     from './pages/About.jsx';
import Contact   from './pages/Contact.jsx';
import Login     from './pages/Login.jsx';
import './index.css';
import './App.css';

function AppInner() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('home');

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'var(--ink)'}}>
      <div style={{width:40,height:40,border:'3px solid rgba(255,255,255,.1)',borderTopColor:'var(--lime)',borderRadius:'50%',animation:'spin .8s linear infinite'}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // Protected pages — redirect to login if not authenticated
  const PROTECTED = ['dashboard','inventory'];
  const activePage = PROTECTED.includes(page) && !user ? 'login' : page;

  const renderPage = () => {
    switch (activePage) {
      case 'home':      return <Home      nav={setPage} />;
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'about':     return <About     />;
      case 'contact':   return <Contact   />;
      case 'login':     return <Login     onDone={() => setPage(page === 'login' ? 'dashboard' : page)} />;
      default:          return <Home      nav={setPage} />;
    }
  };

  return (
    <>
      {activePage !== 'login' && <Navbar page={activePage} setPage={setPage} />}
      <main>{renderPage()}</main>
      {activePage !== 'login' && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
