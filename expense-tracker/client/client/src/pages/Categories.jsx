import { useApp } from '../context/useApp';
import Header from '../components/Header';
import './Categories.css';

const EXPENSE_CATEGORIES = [
  { name: 'Food', icon: '🍔', color: '#6c63ff' },
  { name: 'Transport', icon: '🚌', color: '#22c55e' },
  { name: 'Shopping', icon: '🛍️', color: '#f59e0b' },
  { name: 'Bills', icon: '⚡', color: '#ef4444' },
  { name: 'Entertainment', icon: '🎬', color: '#3b82f6' },
  { name: 'Others', icon: '📦', color: '#ec4899' },
];

const INCOME_CATEGORIES = [
  { name: 'Salary', icon: '💼', color: '#22c55e' },
  { name: 'Freelance', icon: '💻', color: '#6c63ff' },
  { name: 'Investment', icon: '📈', color: '#f59e0b' },
  { name: 'Gift', icon: '🎁', color: '#3b82f6' },
  { name: 'Others', icon: '💰', color: '#ec4899' },
];

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function Categories() {
  const { summary } = useApp();
  const breakdown = summary?.categoryBreakdown || [];

  const getAmount = (name) => breakdown.find((b) => b.category === name)?.amount || 0;

  return (
    <div className="page">
      <Header title="Categories" subtitle="Manage your spending categories" />
      <div className="page-content">
        <div className="cat-section">
          <h3 className="section-title">Expense Categories</h3>
          <div className="cat-grid">
            {EXPENSE_CATEGORIES.map((cat) => (
              <div key={cat.name} className="cat-card">
                <div className="cat-card-icon" style={{ background: `${cat.color}20` }}>
                  <span>{cat.icon}</span>
                </div>
                <div className="cat-card-name">{cat.name}</div>
                <div className="cat-card-amount" style={{ color: cat.color }}>
                  {fmt(getAmount(cat.name))}
                </div>
                <div className="cat-card-label text-muted text-sm">This month</div>
              </div>
            ))}
          </div>
        </div>

        <div className="cat-section">
          <h3 className="section-title">Income Categories</h3>
          <div className="cat-grid">
            {INCOME_CATEGORIES.map((cat) => (
              <div key={cat.name} className="cat-card">
                <div className="cat-card-icon" style={{ background: `${cat.color}20` }}>
                  <span>{cat.icon}</span>
                </div>
                <div className="cat-card-name">{cat.name}</div>
                <div className="cat-card-amount" style={{ color: cat.color }}>
                  {fmt(getAmount(cat.name))}
                </div>
                <div className="cat-card-label text-muted text-sm">This month</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
