import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content animate-fade-in">
        <div className="top-header">
          <h2>Overview</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Welcome Back!</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>U</div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
