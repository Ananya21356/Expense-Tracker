import { useState, useEffect } from 'react';
import { useApp } from '../context/useApp';
import Header from '../components/Header';
import { MdDelete, MdFilterList } from 'react-icons/md';
import './Transactions.css';

const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚌', Shopping: '🛍️', Bills: '⚡',
  Entertainment: '🎬', Income: '💰', Others: '📦', Salary: '💼',
  Freelance: '💻', Investment: '📈', Gift: '🎁',
};

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function Transactions() {
  const { fetchTransactions, deleteTransaction } = useApp();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = async (type) => {
    setLoading(true);
    const filters = type !== 'all' ? { type } : {};
    const data = await fetchTransactions(filters);
    setTransactions(data);
    setLoading(false);
  };

  useEffect(() => { load(filter); }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    await deleteTransaction(id);
    load(filter);
  };

  return (
    <div className="page">
      <Header title="Transactions" subtitle="All your income and expenses" />
      <div className="page-content">
        <div className="card">
          <div className="txn-page-header">
            <div className="filter-tabs">
              {['all', 'income', 'expense'].map((f) => (
                <button
                  key={f}
                  className={`filter-tab ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions found.</p>
            </div>
          ) : (
            <table className="txn-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <div className="txn-cell">
                        <span className="txn-emoji">{CATEGORY_ICONS[t.category] || '💳'}</span>
                        <span className="txn-desc-text">{t.description || t.category}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`cat-badge cat-${t.type}`}>{t.category}</span>
                    </td>
                    <td className="date-cell">
                      {new Date(t.date).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td>
                      <span className={t.type === 'income' ? 'text-income font-semibold' : 'text-expense font-semibold'}>
                        {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(t._id)}
                        aria-label="Delete transaction"
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
