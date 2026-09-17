import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Navigation.css';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home', id: 'home' },
    { path: '/map', icon: '🗺️', label: 'Map', id: 'map' },
    { path: '/uzbekistan', icon: '🇺🇿', label: 'Uzbekistan', id: 'uzbekistan' },
    { path: '/ecology', icon: '🌿', label: 'Ecology', id: 'ecology' },
    { path: '/game', icon: '🎮', label: 'Game', id: 'game' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="main-navigation">
      {/* Desktop Navigation */}
      <div className="nav-desktop">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-icon ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            title={item.label}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="nav-mobile">
        <button
          className="nav-hamburger"
          onClick={() => setShowMenu(!showMenu)}
          title="Menu"
        >
          <span className="hamburger-icon">☰</span>
        </button>

        {showMenu && (
          <div className="nav-mobile-menu">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-mobile-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => {
                  navigate(item.path);
                  setShowMenu(false);
                }}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
