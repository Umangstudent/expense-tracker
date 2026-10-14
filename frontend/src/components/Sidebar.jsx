import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, DollarSign, Tags, LogOut } from 'lucide-react';

export default function Sidebar() {
  const getUserInfo = () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const parsed = JSON.parse(user);
        return parsed.username || 'User';
      }
    } catch {
      // fallback
    }
    return 'User';
  };

  const username = getUserInfo();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="sidebar glass-panel">
      <div>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
          <DollarSign size={28} /> Tracker
        </h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Finance Dashboard
        </span>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <NavLink to="/" end className="nav-link">
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/expenses" className="nav-link">
          <Receipt size={20} /> Expenses
        </NavLink>
        <NavLink to="/income" className="nav-link">
          <DollarSign size={20} /> Income
        </NavLink>
        <NavLink to="/categories" className="nav-link">
          <Tags size={20} /> Categories
        </NavLink>
      </nav>

      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#ffffff',
              flexShrink: 0,
            }}
          >
            {username.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {username}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Logged in</div>
          </div>
        </div>

        <button
          className="nav-link"
          style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
          onClick={handleLogout}
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
}
