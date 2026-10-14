import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { LogOut } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();

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
    navigate('/login');
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content animate-fade-in">
        <div className="top-header">
          <div>
            <h2>Dashboard</h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Welcome back, <strong style={{ color: 'var(--text-main)' }}>{username}</strong>!
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#ffffff',
                boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)',
              }}
              title={username}
            >
              {username.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-glass btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              title="Sign out of your account"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
