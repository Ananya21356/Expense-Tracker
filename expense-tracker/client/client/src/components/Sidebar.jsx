import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdDashboard, MdSwapHoriz, MdAddCircleOutline,
  MdAccountBalanceWallet, MdCategory, MdBarChart,
  MdSettings, MdLogout
} from 'react-icons/md';
import './Sidebar.css';

const navItems = [
  { to: '/', icon: <MdDashboard />, label: 'Dashboard' },
  { to: '/transactions', icon: <MdSwapHoriz />, label: 'Transactions' },
  { to: '/add', icon: <MdAddCircleOutline />, label: 'Add Transaction' },
  { to: '/budgets', icon: <MdAccountBalanceWallet />, label: 'Budgets' },
  { to: '/categories', icon: <MdCategory />, label: 'Categories' },
  { to: '/reports', icon: <MdBarChart />, label: 'Reports' },
  { to: '/settings', icon: <MdSettings />, label: 'Settings' },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">ET</div>
        <span className="logo-text">ExpenseTracker</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" onClick={logout}>
        <MdLogout />
        <span>Logout</span>
      </button>
    </aside>
  );
}
