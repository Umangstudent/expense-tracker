import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
