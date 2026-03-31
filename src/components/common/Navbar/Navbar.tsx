import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import './Navbar.css';

interface NavbarProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { isLoggedIn } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <img src="/images/logo.jpeg" alt="Baze 2 Barbers" className="logo-img" />
          <span>BAZE 2 BARBERS</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-only">
          <DesktopNav />
        </div>

        {/* Right Side Actions */}
        <div className="nav-actions">
          
          <button className="book-now-btn desktop-only" onClick={() => navigate('/booking')}>Book Now</button>

          {/* Notifications */}
          <div className="nav-notif-wrapper">
            <button className="nav-icon-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <Bell size={20} />
              {isLoggedIn && <span className="notif-badge"></span>}
            </button>
            
            {isNotifOpen && (
              <div className="notif-dropdown">
                <div className="notif-header">Notifications</div>
                <div className="notif-list">
                  {isLoggedIn ? (
                    <div className="notif-item unread">
                      <p>Your appointment with Master J is confirmed for tomorrow at 2:00 PM.</p>
                      <span>2 hours ago</span>
                    </div>
                  ) : (
                    <div className="notif-empty">
                      <p>Please <Link to="/auth" onClick={() => setIsNotifOpen(false)}>Login</Link> to view your notifications.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="nav-icon-btn" onClick={handleProfileClick}>
            <User size={20} />
          </button>

          {/* Mobile Menu Trigger */}
          <button className="nav-mobile-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Sidebar */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </nav>
  );
};

export default Navbar;
