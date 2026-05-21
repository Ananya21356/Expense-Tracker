import { useApp } from '../context/useApp';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { MdTrendingUp, MdTrendingDown, MdAccountBalance, MdCalendarToday } from 'react-icons/md';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const COLORS = ['#6c63ff', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];
const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚌', Shopping: '🛍️', Bills: '⚡',
  Entertainment: '🎬', Income: '💰', Others: '📦', Salary: '💼',
};

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function Dashboard() {
  const { user } = useAuth();
  const { transactions, summary, trend, loading } = useApp();

  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long' });
  const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();

  const statCards = [
    {
      label: 'Total Income',
      value: fmt(summary?.totalIncome),
      icon: <MdTrendingUp />,
      color: 'income',
      change: '+12.5% from last month',
    },
    {
      label: 'Total Expenses',
      value: fmt(summary?.totalExpenses),
      icon: <MdTrendingDown />,
      color: 'expense',
      change: '-8.3% from last month',
    },
    {
      label: 'Balance',
      value: fmt(summary?.balance),
      icon: <MdAccountBalance />,
      color: 'info',
      change: '+20.8% from last month',
    },
    {
      label: 'This Month',
      value: `${monthName} ${now.getFullYear()}`,
      icon: <MdCalendarToday />,
      color: 'warning',
      change: `${daysLeft} days left`,
    },
  ];

  const pieData = summary?.categoryBreakdown?.slice(0, 6) || [];
  const topCategories = [...(summary?.categoryBreakdown || [])]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="page">
      <Header
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name?.split(' ')[0]} 👋`}
      />
      <div className="page-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="stat-grid">
              {statCards.map((card) => (
                <div key={card.label} className={`stat-card stat-${card.color}`}>
                  <div className="stat-header">
                    <span className="stat-label">{card.label}</span>
                    <span className={`stat-icon icon-${card.color}`}>{card.icon}</span>
                  </div>
                  <div className="stat-value">{card.value}</div>
                  <div className={`stat-change change-${card.color}`}>{card.change}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="charts-row">
              {/* Pie Chart */}
              <div className="card chart-card">
                <h3 className="card-title">Expense Overview</h3>
                <div className="pie-wrapper">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData.length ? pieData : [{ category: 'No data', amount: 1 }]}
                        cx="40%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        dataKey="amount"
                        nameKey="category"
                      >
                        {(pieData.length ? pieData : [{}]).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pie-center-label">
                    <div className="pie-amount">{fmt(summary?.totalExpenses)}</div>
                    <div className="pie-sub">Total Expenses</div>
                  </div>
                  <div className="pie-legend">
                    {pieData.map((item, i) => (
                      <div key={item.category} className="legend-item">
                        <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="legend-name">{item.category}</span>
                        <span className="legend-pct">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="card chart-card">
                <div className="card-header">
                  <h3 className="card-title">Monthly Trend</h3>
                  <span className="badge">This Year</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={trend} barSize={10} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip formatter={(v) => fmt(v)} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="bottom-row">
              {/* Recent Transactions */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Recent Transactions</h3>
                  <Link to="/transactions" className="view-all">View All</Link>
                </div>
                <div className="txn-list">
                  {transactions.slice(0, 5).map((t) => (
                    <div key={t._id} className="txn-item">
                      <div className="txn-icon">{CATEGORY_ICONS[t.category] || '💳'}</div>
                      <div className="txn-info">
                        <div className="txn-desc">{t.description || t.category}</div>
                        <div className="txn-cat text-muted text-sm">{t.category}</div>
                      </div>
                      <div className="txn-right">
                        <div className={`txn-amount ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                          {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                        </div>
                        <div className="txn-date text-muted text-sm">
                          {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <p className="empty-msg">No transactions yet. <Link to="/add">Add one!</Link></p>
                  )}
                </div>
              </div>

              {/* Top Categories */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Top Categories</h3>
                  <span className="badge">This Month</span>
                </div>
                <div className="cat-list">
                  {topCategories.map((cat, i) => (
                    <div key={cat.category} className="cat-item">
                      <div className="cat-icon">{CATEGORY_ICONS[cat.category] || '📦'}</div>
                      <div className="cat-info">
                        <div className="cat-name">{cat.category}</div>
                        <div className="cat-bar-wrap">
                          <div
                            className="cat-bar"
                            style={{ width: `${cat.percentage}%`, background: COLORS[i % COLORS.length] }}
                          />
                        </div>
                      </div>
                      <div className="cat-right">
                        <div className="cat-amount">{fmt(cat.amount)}</div>
                        <div className="cat-pct text-muted text-sm">{cat.percentage}%</div>
                      </div>
                    </div>
                  ))}
                  {topCategories.length === 0 && (
                    <p className="empty-msg">No expense data yet.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
