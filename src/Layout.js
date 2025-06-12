import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMessageSquare, FiGift, FiMap } from 'react-icons/fi';
import './Layout.css';
import CountdownTimer from './CountdownTimer';

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="layout-wrapper">
      <main className="main-content">
        <CountdownTimer />
        {children}
      </main>

      <nav className="bottom-nav">
        <Link to="/translator" className={location.pathname === '/translator' ? 'active' : ''}>
          <FiMessageSquare size={24} />
        </Link>
        <Link to="/rewards" className={location.pathname === '/rewards' ? 'active' : ''}>
          <FiGift size={24} />
        </Link>
        <Link to="/navigation" className={location.pathname === '/navigation' ? 'active' : ''}>
          <FiMap size={24} />
        </Link>
      </nav>
    </div>
  );
}

export default Layout;