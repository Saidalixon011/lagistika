import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LogOut,
  MapPin,
  PackageSearch,
  Users,
  WalletCards,
  Wrench,
  X,
} from 'lucide-react';
import { routes } from '../route/Route';
import './Sidebar.css';

const iconMap = {
  '/': <PackageSearch size={20} />,
  '/drivers': <Users size={20} />,
  '/debtors': <WalletCards size={20} />,
  '/mechanics': <Wrench size={20} />,
  '/locations': <MapPin size={20} />,
};

export default function Sidebar({
  isOpen,
  onClose,
  currentUser,
  onRequestLogout,
}) {
  const menuItems = routes.filter((item) => item.showInMenu);

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div>
          <div className="sidebar-header">
            <span>BO‘LIMLAR</span>
            <button
              type="button"
              className="close-btn"
              onClick={onClose}
              aria-label="Yopish"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-icon">{iconMap[item.path]}</span>
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          {currentUser && (
            <div className="sidebar-user-box">
              <div className="sidebar-user-name">{currentUser.fullName}</div>
              <div className="sidebar-user-phone">+998 {currentUser.phone}</div>
            </div>
          )}

          <button
            type="button"
            className="logout-btn"
            onClick={() => onRequestLogout && onRequestLogout()}
          >
            <LogOut size={17} />
            <span>Tizimdan chiqish</span>
          </button>
        </div>
      </aside>
    </>
  );
}