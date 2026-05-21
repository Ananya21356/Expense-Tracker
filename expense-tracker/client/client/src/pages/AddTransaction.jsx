import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import Header from '../components/Header';
import { MdArrowBack } from 'react-icons/md';
import './AddTransaction.css';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Others'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Others'];

export default function AddTransaction() {
  const navigate = useNavigate();
  const { addTransaction } = useApp();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category) {
      setError('Amount and category are required.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await addTransaction({ type, amount: parseFloat(amount), category, description, date });
    setLoading(false);
    if (result.success) {
      navigate('/transactions');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="page">
      <Header title="Add Transaction" />
      <div className="page-content">
        <div className="form-card">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <MdArrowBack /> Back
          </button>
          <h2 className="form-title">Add Transaction</h2>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="txn-form">
            {/* Type Toggle */}
            <div className="form-group">
              <label className="form-label">Type</label>
              <div className="type-toggle">
                <button
                  type="button"
                  className={`type-btn ${type === 'income' ? 'active-income' : ''}`}
                  onClick={() => { setType('income'); setCategory(''); }}
                >
                  Income
                </button>
                <button
                  type="button"
                  className={`type-btn ${type === 'expense' ? 'active-expense' : ''}`}
                  onClick={() => { setType('expense'); setCategory(''); }}
                >
                  Expense
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="form-group">
              <label className="form-label">Amount</label>
              <div className="input-prefix">
                <span className="prefix">₹</span>
                <input
                  type="number"
                  className="form-input with-prefix"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Category & Date */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Transaction'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
