import React from 'react';

const DesktopNav: React.FC = () => {
  return (
    <div className="nav-links desktop-only">
      <a href="#home" className="nav-link">Home</a>
      <a href="#services" className="nav-link">Services</a>
      <a href="#pricing" className="nav-link">Pricing</a>
      <a href="#gallery" className="nav-link">Gallery</a>
      <a href="#contact" className="nav-link">Contact</a>
    </div>
  );
};

export default DesktopNav;
