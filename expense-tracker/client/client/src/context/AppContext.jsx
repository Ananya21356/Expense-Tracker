import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (user?.darkMode !== undefined) {
      setDarkMode(user.darkMode);
    }
  }, [user]);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [txRes, sumRes, trendRes, budRes] = await Promise.all([
        api.get('/transactions?limit=10'),
        api.get('/transactions/summary'),
        api.get('/transactions/trend'),
        api.get('/budgets'),
      ]);
      setTransactions(txRes.data);
      setSummary(sumRes.data);
      setTrend(trendRes.data);
      setBudgets(budRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addTransaction = async (data) => {
    try {
      const res = await api.post('/transactions', data);
      await fetchAll();
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add' };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      await fetchAll();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete' };
    }
  };

  const fetchTransactions = async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/transactions?${params}`);
      return res.data;
    } catch (err) {
      return [];
    }
  };

  const upsertBudget = async (data) => {
    try {
      await api.post('/budgets', data);
      await fetchAll();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed' };
    }
  };

  const deleteBudget = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      await fetchAll();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed' };
    }
  };

  const fetchSummary = async (month, year) => {
    try {
      const res = await api.get(`/transactions/summary?month=${month}&year=${year}`);
      return res.data;
    } catch (err) {
      return null;
    }
  };

  return (
    <AppContext.Provider value={{
      transactions, budgets, summary, trend, loading, darkMode, setDarkMode,
      addTransaction, deleteTransaction, fetchTransactions,
      upsertBudget, deleteBudget, fetchSummary, fetchAll,
    }}>
      {children}
    </AppContext.Provider>
  );
};
