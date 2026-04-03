import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Bell, Menu, X, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import './Navbar.css';

interface NavbarProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onAuthOpen: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled, isMobileMenuOpen, setIsMobileMenuOpen, onAuthOpen }) => {
  const { isLoggedIn, user, logout } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setIsProfileOpen(!isProfileOpen);
    } else {
      onAuthOpen();
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        <Link to="/" className="nav-logo">
          <img src="/images/logo.jpeg" alt="Baze 2 Barbers" className="logo-img" />
          <span>BAZE 2 BARBERS</span>
        </Link>

        <div className="desktop-only">
          <DesktopNav />
        </div>

        <div className="nav-actions">
          
          <button className="book-now-btn desktop-only" onClick={() => navigate('/booking')}>Book Now</button>

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
                      <p>Please <button className="text-gold-btn" onClick={() => { onAuthOpen(); setIsNotifOpen(false); }}>Login</button> to view your notifications.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="nav-profile-wrapper">
            <button className={`nav-icon-btn ${isProfileOpen ? 'active' : ''}`} onClick={handleProfileClick}>
              <User size={20} />
            </button>

            {isLoggedIn && isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-email">{user?.email}</span>
                </div>
                <div className="profile-dropdown-links">
                  <button onClick={() => { navigate('/dashboard'); setIsProfileOpen(false); }}>
                    <LayoutDashboard size={16} /> Dashboard
                  </button>
                  <button onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}>
                    <Settings size={16} /> Settings
                  </button>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="logout-link">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="nav-mobile-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} onAuthOpen={onAuthOpen} />
    </nav>
  );
};

export default Navbar;
