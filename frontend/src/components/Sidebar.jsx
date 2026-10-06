import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, DollarSign, Tags, LogOut } from 'lucide-react';

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="sidebar glass-panel">
      <div>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <DollarSign size={28} /> Tracker
        </h2>
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
      <button className="nav-link" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }} onClick={handleLogout}>
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
}
