import React, { useState } from 'react';
import './Header.css';

function Header({ onAdminClick, isAdmin, onNavClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (event, target) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    onNavClick?.(target);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <button type="button" className="logo-link" onClick={(e) => handleNav(e, 'home')}>
            <h2>JOEDAN</h2>
            <span className="tagline">Premium Products & Solutions</span>
          </button>
        </div>

        <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#products" onClick={(e) => handleNav(e, 'products')}>Products</a>
          <a href="#about" onClick={(e) => handleNav(e, 'about')}>About</a>
          <a href="#contact" onClick={(e) => handleNav(e, 'contact')}>Contact</a>
          <button className="admin-btn" onClick={onAdminClick}>
            {isAdmin ? 'Exit Admin' : 'Admin'}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
