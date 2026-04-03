import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Home, Info, Scissors, Tag, Image, Phone, BookOpen, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthOpen: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onAuthOpen }) => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const dashboardItems = [
    { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { to: '/booking', label: 'New Booking', icon: <BookOpen size={18} /> },
    { to: '/profile', label: 'Profile Settings', icon: <User size={18} /> },
    { to: '/pricing', label: 'Pricing Table', icon: <Tag size={18} /> },
    { to: '/contact', label: 'Support', icon: <Phone size={18} /> },
  ];

  const publicItems = [
    { to: '/', label: 'Home', icon: <Home size={18} /> },
    { to: '/about', label: 'About Us', icon: <Info size={18} /> },
    { to: '/services', label: 'Services', icon: <Scissors size={18} /> },
    { to: '/pricing', label: 'Pricing', icon: <Tag size={18} /> },
    { to: '/gallery', label: 'Gallery', icon: <Image size={18} /> },
    { to: '/contact', label: 'Contact', icon: <Phone size={18} /> },
  ];

  const currentNavItems = isLoggedIn ? dashboardItems : publicItems;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="mobile-sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="mobile-sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          >
            <div className="mobile-sidebar-header">
              <div className="sidebar-header-content">
                <span className="sidebar-logo">BAZE 2 BARBERS</span>
                {isLoggedIn && user && (
                  <div className="sidebar-user-minimal">
                    <span className="user-name">{user.name}</span>
                  </div>
                )}
              </div>
              <button className="sidebar-close-btn" onClick={onClose}>
                <X size={22} />
              </button>
            </div>

            <nav className="mobile-sidebar-links">
              {currentNavItems.map((item) => (
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

            <div className="sidebar-divider" />

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
                  <div className="sidebar-notif-empty">
                    <p>Sign in to view your notifications.</p>
                    <button className="text-gold-btn" onClick={() => { onClose(); onAuthOpen(); }}>Sign in</button>
                  </div>
                )}
              </div>
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-actions">
              <NavLink to="/booking" className="btn-filled sidebar-book-btn" onClick={onClose}>
                <BookOpen size={18} /> Book Your Chair
              </NavLink>
              
              {isLoggedIn && (
                <button className="sidebar-logout-btn" onClick={handleLogout}>
                   <LogOut size={18} /> Logout
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
