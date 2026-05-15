import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { MdAdd, MdDelete } from 'react-icons/md';
import './Budgets.css';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Others'];
const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚌', Shopping: '🛍️', Bills: '⚡',
  Entertainment: '🎬', Others: '📦',
};
const COLORS = ['#6c63ff', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function Budgets() {
  const { budgets, upsertBudget, deleteBudget } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const now = new Date();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!category || !limit) { setError('All fields required'); return; }
    setLoading(true);
    const result = await upsertBudget({
      category, limit: parseFloat(limit),
      month: now.getMonth() + 1, year: now.getFullYear(),
    });
    setLoading(false);
    if (result.success) {
      setShowForm(false);
      setCategory('');
      setLimit('');
      setError('');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="page">
      <Header title="Budgets" subtitle="Track your spending limits" />
      <div className="page-content">
        <div className="budget-header">
          <h3 className="section-title">
            {now.toLocaleString('default', { month: 'long' })} {now.getFullYear()} Budgets
          </h3>
          <button className="add-budget-btn" onClick={() => setShowForm(!showForm)}>
            <MdAdd /> Add Budget
          </button>
        </div>

        {showForm && (
          <div className="card budget-form-card">
            <h4 className="form-title">New Budget</h4>
            {error && <div className="form-error">{error}</div>}
            <form onSubmit={handleAdd} className="budget-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select Category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Budget Limit (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 5000"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Budget'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="budget-list">
          {budgets.length === 0 ? (
            <div className="card empty-state">
              <p>No budgets set. Click "Add Budget" to get started.</p>
            </div>
          ) : (
            budgets.map((b, i) => {
              const pct = Math.min(b.percentage || 0, 100);
              const color = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : COLORS[i % COLORS.length];
              return (
                <div key={b._id} className="card budget-item">
                  <div className="budget-item-header">
                    <div className="budget-cat">
                      <span className="budget-icon">{CATEGORY_ICONS[b.category] || '📦'}</span>
                      <span className="budget-cat-name">{b.category}</span>
                    </div>
                    <div className="budget-amounts">
                      <span className="budget-spent">{fmt(b.spent)}</span>
                      <span className="budget-sep"> / </span>
                      <span className="budget-limit">{fmt(b.limit)}</span>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => deleteBudget(b._id)}
                      aria-label="Delete budget"
                    >
                      <MdDelete />
                    </button>
                  </div>
                  <div className="budget-bar-wrap">
                    <div
                      className="budget-bar"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <div className="budget-footer">
                    <span className="budget-pct" style={{ color }}>{pct}% used</span>
                    <span className="budget-remaining text-muted text-sm">
                      {fmt(Math.max(0, b.limit - (b.spent || 0)))} remaining
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
