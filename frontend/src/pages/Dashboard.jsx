import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react';

const CATEGORY_COLORS = [
  '#8b5cf6',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#a855f7',
  '#6366f1',
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
  });
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(num);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch summary from API
      const res = await api.get('/dashboard/summary');
      const data = res.data || {};

      let calculatedExpenses = 0;
      if (typeof data.monthlyExpense === 'number' || (typeof data.monthlyExpense === 'string' && !isNaN(data.monthlyExpense))) {
        calculatedExpenses = Number(data.monthlyExpense);
      } else if (typeof data.totalExpenses === 'number' || (typeof data.totalExpenses === 'string' && !isNaN(data.totalExpenses))) {
        calculatedExpenses = Number(data.totalExpenses);
      } else if (typeof data.totalExpense === 'number' || (typeof data.totalExpense === 'string' && !isNaN(data.totalExpense))) {
        calculatedExpenses = Number(data.totalExpense);
      } else if (Array.isArray(data.monthlyExpenses) && data.monthlyExpenses.length > 0) {
        calculatedExpenses = Number(data.monthlyExpenses[data.monthlyExpenses.length - 1]?.total || 0);
      }

      let calculatedIncome = 0;
      if (typeof data.monthlyIncome === 'number' || (typeof data.monthlyIncome === 'string' && !isNaN(data.monthlyIncome))) {
        calculatedIncome = Number(data.monthlyIncome);
      } else if (typeof data.totalIncome === 'number' || (typeof data.totalIncome === 'string' && !isNaN(data.totalIncome))) {
        calculatedIncome = Number(data.totalIncome);
      } else if (Array.isArray(data.monthlyIncomes) && data.monthlyIncomes.length > 0) {
        calculatedIncome = Number(data.monthlyIncomes[data.monthlyIncomes.length - 1]?.total || 0);
      }

      let calculatedBalance = 0;
      if (typeof data.balance === 'number' || (typeof data.balance === 'string' && !isNaN(data.balance))) {
        calculatedBalance = Number(data.balance);
      } else {
        calculatedBalance = calculatedIncome - calculatedExpenses;
      }

      setSummary({
        totalBalance: calculatedBalance,
        monthlyIncome: calculatedIncome,
        monthlyExpenses: calculatedExpenses,
      });

      // Also fetch expenses & incomes for fallback aggregation if needed
      let rawMonthly =
        data.monthlyData ||
        data.monthlyBreakdown ||
        data.monthlyStats ||
        data.monthlySummary ||
        data.chartData;

      let rawCategories =
        data.categoryBreakdown ||
        data.categoryExpenses ||
        data.categories ||
        data.categorySummary;

      // If either chart data is missing from summary response, fetch list endpoints
      let expensesList = [];
      let incomesList = [];

      if (!rawMonthly || !rawCategories) {
        try {
          const [expRes, incRes] = await Promise.allSettled([
            api.get('/expenses'),
            api.get('/incomes'),
          ]);
          if (expRes.status === 'fulfilled' && Array.isArray(expRes.value.data)) {
            expensesList = expRes.value.data;
          }
          if (incRes.status === 'fulfilled' && Array.isArray(incRes.value.data)) {
            incomesList = incRes.value.data;
          }
        } catch {
          // ignore secondary fetch errors
        }
      }

      // Process Monthly Bar Chart Data
      if (Array.isArray(rawMonthly) && rawMonthly.length > 0) {
        setMonthlyChartData(
          rawMonthly.map((item) => ({
            name: item.name || item.month || item.monthName || item.label || '',
            income: Number(item.income ?? item.totalIncome ?? 0),
            expense: Number(item.expense ?? item.expenses ?? item.totalExpense ?? item.totalExpenses ?? 0),
          }))
        );
      } else if (expensesList.length > 0 || incomesList.length > 0) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthMap = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          monthMap[key] = {
            name: `${monthNames[d.getMonth()]}`,
            income: 0,
            expense: 0,
          };
        }
        expensesList.forEach((e) => {
          if (e.date) {
            const ym = e.date.substring(0, 7);
            if (monthMap[ym]) {
              monthMap[ym].expense += Number(e.amount || 0);
            }
          }
        });
        incomesList.forEach((inc) => {
          if (inc.date) {
            const ym = inc.date.substring(0, 7);
            if (monthMap[ym]) {
              monthMap[ym].income += Number(inc.amount || 0);
            }
          }
        });
        setMonthlyChartData(Object.values(monthMap));
      } else {
        // Default zero months for empty display
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        setMonthlyChartData(
          monthNames.map((name) => ({
            name,
            income: 0,
            expense: 0,
          }))
        );
      }

      // Process Category Pie Chart Data
      let parsedCategories = [];
      if (Array.isArray(rawCategories) && rawCategories.length > 0) {
        parsedCategories = rawCategories.map((item, idx) => ({
          name: item.name || item.category || item.categoryName || `Category ${idx + 1}`,
          value: Number(item.value ?? item.amount ?? item.total ?? 0),
          color: item.color || CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
        })).filter((c) => c.value > 0);
      } else if (rawCategories && typeof rawCategories === 'object') {
        parsedCategories = Object.entries(rawCategories).map(([key, val], idx) => ({
          name: key,
          value: Number(typeof val === 'object' ? val.amount ?? val.value ?? 0 : val),
          color: (typeof val === 'object' && val.color) || CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
        })).filter((c) => c.value > 0);
      } else if (expensesList.length > 0) {
        const map = {};
        expensesList.forEach((exp) => {
          const catName = exp.category?.name || exp.categoryName || 'Other';
          const catColor = exp.category?.color;
          if (!map[catName]) {
            map[catName] = { name: catName, value: 0, color: catColor };
          }
          map[catName].value += Number(exp.amount || 0);
        });
        parsedCategories = Object.values(map).map((item, idx) => ({
          ...item,
          color: item.color || CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
        })).filter((c) => c.value > 0);
      }

      setCategoryChartData(parsedCategories);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to load dashboard summary. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container animate-fade-in" style={{ minHeight: '400px' }}>
        <div className="spinner" />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading financial dashboard...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {error && (
        <div className="alert alert-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
          <button className="btn btn-sm btn-glass" onClick={fetchDashboardData}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3">
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <p style={{ margin: 0, fontWeight: 500 }}>Total Balance</p>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(139, 92, 246, 0.2)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DollarSign size={20} />
            </div>
          </div>
          <h2 style={{ color: summary.totalBalance >= 0 ? 'var(--text-main)' : 'var(--danger)' }}>
            {formatCurrency(summary.totalBalance)}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current overall balance</span>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <p style={{ margin: 0, fontWeight: 500 }}>Monthly Income</p>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={20} />
            </div>
          </div>
          <h2 style={{ color: 'var(--success)' }}>
            +{formatCurrency(summary.monthlyIncome)}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total earnings this month</span>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <p style={{ margin: 0, fontWeight: 500 }}>Monthly Expense</p>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.2)',
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingDown size={20} />
            </div>
          </div>
          <h2 style={{ color: 'var(--danger)' }}>
            -{formatCurrency(summary.monthlyExpenses)}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total spent this month</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2" style={{ marginTop: '2rem' }}>
        {/* Income vs Expenses Bar Chart */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Financial Overview</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monthly Trend</span>
          </div>

          <div className="chart-container" style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{
                    backgroundColor: 'var(--bg-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'var(--text-main)',
                  }}
                  formatter={(val) => formatCurrency(val)}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="income" name="Income" fill="var(--success)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="var(--danger)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Category Breakdown</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Expense Distribution</span>
          </div>

          <div className="chart-container" style={{ height: '320px' }}>
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-dark)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                    }}
                    formatter={(val) => [formatCurrency(val), 'Spent']}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p>No expense category data recorded yet.</p>
                <span style={{ fontSize: '0.85rem' }}>Add some expenses to see category breakdown.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
