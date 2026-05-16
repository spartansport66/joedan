import React, { useState } from 'react';
import './Header.css';

function Header({ onAdminClick, isAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h2>JOEDAN</h2>
          <span className="tagline">Premium Products & Solutions</span>
        </div>

        <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <button className="admin-btn" onClick={onAdminClick}>
            {isAdmin ? 'Exit Admin' : 'Admin'}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
