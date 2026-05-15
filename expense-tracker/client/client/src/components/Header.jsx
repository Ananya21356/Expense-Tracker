import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { MdMenu, MdNotifications, MdDarkMode, MdLightMode } from 'react-icons/md';
import './Header.css';

export default function Header({ title, subtitle }) {
  const { user } = useAuth();
  const { darkMode, setDarkMode } = useApp();

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
      <div className="header-right">
        <button
          className="icon-btn"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <MdLightMode /> : <MdDarkMode />}
        </button>
        <div className="user-chip">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="user-name">{user?.name || 'User'}</span>
        </div>
      </div>
    </header>
  );
}
