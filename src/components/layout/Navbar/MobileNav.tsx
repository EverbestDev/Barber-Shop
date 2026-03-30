import React from 'react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="mobile-menu">
      <div className="mobile-links">
        <a href="#home" className="mobile-link" onClick={onClose}>Home</a>
        <a href="#services" className="mobile-link" onClick={onClose}>Services</a>
        <a href="#pricing" className="mobile-link" onClick={onClose}>Pricing</a>
        <a href="#gallery" className="mobile-link" onClick={onClose}>Gallery</a>
        <a href="#contact" className="mobile-link" onClick={onClose}>Contact</a>
        <div style={{ marginTop: '2rem' }}>
          <button className="book-now-btn" onClick={onClose} style={{ width: '100%' }}>Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
