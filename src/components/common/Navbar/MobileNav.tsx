import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, User, Home, Info, Scissors, Tag, Image, Phone, BookOpen } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthOpen: () => void;
}

const navItems = [
  { to: '/', label: 'Home', icon: <Home size={18} /> },
  { to: '/about', label: 'About Us', icon: <Info size={18} /> },
  { to: '/services', label: 'Services', icon: <Scissors size={18} /> },
  { to: '/pricing', label: 'Pricing', icon: <Tag size={18} /> },
  { to: '/gallery', label: 'Gallery', icon: <Image size={18} /> },
  { to: '/contact', label: 'Contact', icon: <Phone size={18} /> },
];

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onAuthOpen }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    onClose();
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      onAuthOpen();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark overlay */}
          <motion.div
            className="mobile-sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar panel sliding in from the left */}
          <motion.div
            className="mobile-sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          >
            {/* Sidebar Header */}
            <div className="mobile-sidebar-header">
              <span className="sidebar-logo">BAZE 2 BARBERS</span>
              <button className="sidebar-close-btn" onClick={onClose}>
                <X size={22} />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="mobile-sidebar-links">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Divider */}
            <div className="sidebar-divider" />

            {/* Notifications Section */}
            <div className="sidebar-notif-section">
              <div className="sidebar-section-title">
                <Bell size={16} />
                <span>Notifications</span>
                {isLoggedIn && <span className="sidebar-notif-badge" />}
              </div>
              <div className="sidebar-notif-body">
                {isLoggedIn ? (
                  <div className="sidebar-notif-item">
                    <p>Your appointment with Master J is confirmed for tomorrow at 2:00 PM.</p>
                    <span>2 hours ago</span>
                  </div>
                ) : (
                  <p className="sidebar-notif-empty">
                    <button className="text-gold-btn" onClick={() => { onClose(); onAuthOpen(); }}>Sign in</button> to view your notifications.
                  </p>
                )}
              </div>
            </div>

            <div className="sidebar-divider" />

            {/* Bottom Actions */}
            <div className="sidebar-actions">
              <button
                className="sidebar-profile-btn"
                onClick={handleProfileClick}
              >
                <User size={18} />
                {isLoggedIn ? 'My Profile' : 'Sign In / Register'}
              </button>
              <NavLink to="/booking" className="btn-filled sidebar-book-btn" onClick={onClose}>
                <BookOpen size={18} /> Book Your Chair
              </NavLink>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
