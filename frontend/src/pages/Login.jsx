import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const [successMsg] = useState(location.state?.message || '');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { username, password });
      
      const token = res.data?.token || res.data?.jwt || res.data?.accessToken || (typeof res.data === 'string' ? res.data : null);
      if (!token) {
        throw new Error('Invalid authentication response from server.');
      }
      
      localStorage.setItem('token', token);

      const userInfo = res.data?.user || {
        username: res.data?.username || username,
        email: res.data?.email || '',
        id: res.data?.id || res.data?.userId,
      };
      localStorage.setItem('user', JSON.stringify(userInfo));

      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error || (typeof err.response?.data === 'string' ? err.response?.data : null);
      setError(serverMsg || 'Login failed. Please check your username and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', marginBottom: '1.75rem' }}>Sign in to manage your finances</p>

        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-sm" /> Logging in...
              </>
            ) : (
              <>
                <LogIn size={20} /> Login
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', marginBottom: 0 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
