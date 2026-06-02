import React from 'react';
import './Footer.css';

function Footer({ contactEmail, contactPhone, contactAddress }) {
  const currentYear = new Date().getFullYear();
  const email = contactEmail || 'info@joedan.com';
  const phone = contactPhone || '+1 (555) 123-4567';
  const address = contactAddress || '123 Main Street, City, State';

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>JOEDAN</h3>
          <p>Premium products and solutions for your lifestyle</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#products">Products</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li><a href="#products">Featured</a></li>
            <li><a href="#products">New Arrivals</a></li>
            <li><a href="#products">Best Sellers</a></li>
            <li><a href="#products">Special Offers</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <ul>
            <li>Email: {email}</li>
            <li>Phone: {phone}</li>
            <li>Address: {address}</li>
          </ul>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} JOEDAN. All rights reserved.</p>
        <div className="footer-links">
          <a href="#terms">Terms of Service</a>
          <span>•</span>
          <a href="#privacy">Privacy Policy</a>
          <span>•</span>
          <a href="#sitemap">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
