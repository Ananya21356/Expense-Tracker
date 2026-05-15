import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { MdCalendarToday } from 'react-icons/md';
import './Reports.css';

const COLORS = ['#6c63ff', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];
const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function Reports() {
  const { fetchSummary } = useApp();
  const [summary, setSummary] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchSummary(month, year);
      setSummary(data);
      setLoading(false);
    };
    load();
  }, [month, year]);

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  return (
    <div className="page">
      <Header title="Reports" subtitle="Detailed financial analysis" />
      <div className="page-content">
        {/* Date Filter */}
        <div className="card report-filter">
          <MdCalendarToday className="filter-icon" />
          <select
            className="form-input filter-select"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {months.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            className="form-input filter-select"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {[2023, 2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="report-summary">
              <div className="summary-card income-card">
                <div className="summary-label">Income</div>
                <div className="summary-value">{fmt(summary?.totalIncome)}</div>
              </div>
              <div className="summary-card expense-card">
                <div className="summary-label">Expenses</div>
                <div className="summary-value">{fmt(summary?.totalExpenses)}</div>
              </div>
              <div className="summary-card savings-card">
                <div className="summary-label">Savings</div>
                <div className="summary-value">{fmt(summary?.balance)}</div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="report-charts">
              <div className="card">
                <h3 className="card-title">Category Breakdown</h3>
                <div className="breakdown-layout">
                  <ResponsiveContainer width="50%" height={220}>
                    <PieChart>
                      <Pie
                        data={summary?.categoryBreakdown?.length ? summary.categoryBreakdown : [{ category: 'No data', amount: 1 }]}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="amount"
                        nameKey="category"
                      >
                        {(summary?.categoryBreakdown?.length ? summary.categoryBreakdown : [{}]).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="breakdown-list">
                    {(summary?.categoryBreakdown || []).map((item, i) => (
                      <div key={item.category} className="breakdown-item">
                        <div className="breakdown-dot" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="breakdown-cat">{item.category}</span>
                        <span className="breakdown-amount">{fmt(item.amount)}</span>
                        <span className="breakdown-pct text-muted">({item.percentage}%)</span>
                      </div>
                    ))}
                    {!summary?.categoryBreakdown?.length && (
                      <p className="empty-msg">No expense data for this period.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
