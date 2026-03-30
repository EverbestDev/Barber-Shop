import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
      <div className="mobile-nav-links">
        <NavLink to="/" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={onClose}>Home</NavLink>
        <NavLink to="/services" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={onClose}>Services</NavLink>
        <NavLink to="/pricing" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={onClose}>Pricing</NavLink>
        <NavLink to="/gallery" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={onClose}>Gallery</NavLink>
        <NavLink to="/contact" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={onClose}>Contact</NavLink>
        
        <div className="mobile-actions">
          <button className="book-now-btn" onClick={() => { onClose(); }}>Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
