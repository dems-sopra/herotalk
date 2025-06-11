import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="layout-container">
      <nav className="sidebar">
        <h2 className="sidebar-title">HeroTalk</h2>
        <ul className="nav-links">
          <li className={location.pathname === '/translator' ? 'active' : ''}>
            <Link to="/translator">Translator</Link>
          </li>
          <li className={location.pathname === '/navigation' ? 'active' : ''}>
            <Link to="/navigation">Navigation</Link>
          </li>
          <li className={location.pathname === '/rewards' ? 'active' : ''}>
            <Link to="/rewards">Rewards</Link>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
