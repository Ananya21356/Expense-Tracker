import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/useApp';
import Header from '../components/Header';
import {
  MdPerson, MdLock, MdCurrencyRupee, MdNotifications,
  MdDarkMode, MdDownload, MdInfo, MdChevronRight
} from 'react-icons/md';
import './Settings.css';

export default function Settings() {
  const { user, updateSettings } = useAuth();
  const { darkMode, setDarkMode } = useApp();
  const [notifications, setNotifications] = useState(user?.notifications ?? true);
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [showProfile, setShowProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const [showPassword, setShowPassword] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');

  const handleToggleDark = async () => {
    const next = !darkMode;
    setDarkMode(next);
    await updateSettings({ darkMode: next });
  };

  const handleToggleNotif = async () => {
    const next = !notifications;
    setNotifications(next);
    await updateSettings({ notifications: next });
  };

  const handleCurrencyChange = async (val) => {
    setCurrency(val);
    await updateSettings({ currency: val });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateSettings({ name, email });
    setSaving(false);
    setMsg(result.success ? 'Profile updated!' : result.message);
    setTimeout(() => setMsg(''), 3000);
    setShowProfile(false);
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!newPwd) return;
    setSaving(true);
    const result = await updateSettings({ password: newPwd });
    setSaving(false);
    setMsg(result.success ? 'Password changed!' : result.message);
    setTimeout(() => setMsg(''), 3000);
    setShowPassword(false);
    setCurrentPwd('');
    setNewPwd('');
  };

  const settingRows = [
    {
      icon: <MdPerson />,
      label: 'Profile Settings',
      action: () => setShowProfile(!showProfile),
      type: 'arrow',
    },
    {
      icon: <MdLock />,
      label: 'Change Password',
      action: () => setShowPassword(!showPassword),
      type: 'arrow',
    },
    {
      icon: <MdCurrencyRupee />,
      label: 'Currency',
      type: 'select',
      value: currency,
      onChange: handleCurrencyChange,
      options: ['INR', 'USD', 'EUR', 'GBP'],
    },
    {
      icon: <MdNotifications />,
      label: 'Notifications',
      type: 'toggle',
      value: notifications,
      onChange: handleToggleNotif,
    },
    {
      icon: <MdDarkMode />,
      label: 'Dark Mode',
      type: 'toggle',
      value: darkMode,
      onChange: handleToggleDark,
    },
    {
      icon: <MdDownload />,
      label: 'Data Export',
      action: () => alert('Export feature coming soon!'),
      type: 'arrow',
    },
    {
      icon: <MdInfo />,
      label: 'About Us',
      action: () => alert('Smart Expense Tracker v1.0'),
      type: 'arrow',
    },
  ];

  return (
    <div className="page">
      <Header title="Settings" subtitle="Manage your preferences" />
      <div className="page-content">
        {msg && <div className="settings-msg">{msg}</div>}

        <div className="card settings-card">
          <h3 className="settings-section-title">Settings</h3>
          <div className="settings-list">
            {settingRows.map((row) => (
              <div key={row.label} className="settings-row">
                <div className="settings-row-left">
                  <span className="settings-icon">{row.icon}</span>
                  <span className="settings-label">{row.label}</span>
                </div>
                <div className="settings-row-right">
                  {row.type === 'arrow' && (
                    <button className="settings-arrow-btn" onClick={row.action}>
                      <MdChevronRight />
                    </button>
                  )}
                  {row.type === 'toggle' && (
                    <button
                      className={`toggle-btn ${row.value ? 'on' : ''}`}
                      onClick={row.onChange}
                      aria-label={row.label}
                    >
                      <span className="toggle-thumb" />
                    </button>
                  )}
                  {row.type === 'select' && (
                    <select
                      className="settings-select"
                      value={row.value}
                      onChange={(e) => row.onChange(e.target.value)}
                    >
                      {row.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showProfile && (
          <div className="card settings-form-card">
            <h4 className="form-title">Edit Profile</h4>
            <form onSubmit={handleProfileSave} className="txn-form">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowProfile(false)}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}

        {showPassword && (
          <div className="card settings-form-card">
            <h4 className="form-title">Change Password</h4>
            <form onSubmit={handlePasswordSave} className="txn-form">
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowPassword(false)}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
