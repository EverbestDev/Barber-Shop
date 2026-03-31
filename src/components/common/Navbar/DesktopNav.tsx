import React from 'react';
import { NavLink } from 'react-router-dom';

const DesktopNav: React.FC = () => {
  return (
    <div className="nav-links desktop-only">
      <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
      <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
      <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Services</NavLink>
      <NavLink to="/pricing" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Pricing</NavLink>
      <NavLink to="/gallery" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Gallery</NavLink>
      <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
    </div>
  );
};

export default DesktopNav;
