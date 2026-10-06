const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'src');

const files = {
  'main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
`,

  'App.jsx': `import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Categories from './pages/Categories';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="income" element={<Income />} />
        <Route path="categories" element={<Categories />} />
      </Route>
    </Routes>
  );
}

export default App;
`,

  'components/Sidebar.jsx': `import { NavLink } from 'react-router-dom';
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
`,

  'components/Layout.jsx': `import { Outlet } from 'react-router-dom';
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
`,

  'pages/Login.jsx': `import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Mock login for now or uncomment to use real API
      // const res = await api.post('/auth/login', { email, password });
      // localStorage.setItem('token', res.data.token);
      localStorage.setItem('token', 'mock-token');
      navigate('/');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            <LogIn size={20} /> Login
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: 0 }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
`,

  'pages/Register.jsx': `import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // await api.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Register
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: 0 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
`,

  'pages/Dashboard.jsx': `import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', expense: 4000, income: 2400 },
  { name: 'Feb', expense: 3000, income: 1398 },
  { name: 'Mar', expense: 2000, income: 9800 },
  { name: 'Apr', expense: 2780, income: 3908 },
  { name: 'May', expense: 1890, income: 4800 },
  { name: 'Jun', expense: 2390, income: 3800 },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-3">
        <div className="glass-card">
          <p>Total Balance</p>
          <h2>$12,450.00</h2>
        </div>
        <div className="glass-card">
          <p>Monthly Income</p>
          <h2 style={{ color: 'var(--success)' }}>+$5,200.00</h2>
        </div>
        <div className="glass-card">
          <p>Monthly Expense</p>
          <h2 style={{ color: 'var(--danger)' }}>-$2,150.00</h2>
        </div>
      </div>
      
      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h3>Financial Overview</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
              <Bar dataKey="income" fill="var(--success)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="var(--danger)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
`,

  'pages/Expenses.jsx': `export default function Expenses() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3>Expense Records</h3>
        <button className="btn btn-primary">+ Add Expense</button>
      </div>
      <div className="glass-card table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2026-10-04</td>
              <td>Grocery shopping</td>
              <td>Food</td>
              <td style={{ color: 'var(--danger)' }}>-$120.00</td>
            </tr>
            <tr>
              <td>2026-10-02</td>
              <td>Internet Bill</td>
              <td>Utilities</td>
              <td style={{ color: 'var(--danger)' }}>-$60.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
`,

  'pages/Income.jsx': `export default function Income() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3>Income Records</h3>
        <button className="btn btn-primary">+ Add Income</button>
      </div>
      <div className="glass-card table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2026-10-01</td>
              <td>Salary</td>
              <td style={{ color: 'var(--success)' }}>+$4,500.00</td>
            </tr>
            <tr>
              <td>2026-09-15</td>
              <td>Freelance</td>
              <td style={{ color: 'var(--success)' }}>+$700.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
`,

  'pages/Categories.jsx': `export default function Categories() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3>Categories</h3>
        <button className="btn btn-primary">+ New Category</button>
      </div>
      <div className="grid grid-cols-4">
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h4>Food & Dining</h4>
          <p>12 Transactions</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h4>Utilities</h4>
          <p>5 Transactions</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h4>Transportation</h4>
          <p>8 Transactions</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h4>Entertainment</h4>
          <p>3 Transactions</p>
        </div>
      </div>
    </div>
  );
}
`
};

for (const [file, content] of Object.entries(files)) {
  const fullPath = path.join(src, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Files generated successfully.');
