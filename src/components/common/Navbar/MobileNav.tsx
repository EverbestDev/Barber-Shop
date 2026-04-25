import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Home, Info, Scissors, Tag, Image, Phone, BookOpen, LogOut, LayoutDashboard, User, Users } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthOpen: () => void;
  onLogoutRequest?: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onLogoutRequest }) => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogoutRequest) {
      onLogoutRequest();
    } else {
      logout();
      onClose();
      navigate('/');
    }
  };

  const userItems = [
    { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { to: '/booking', label: 'New Booking', icon: <BookOpen size={18} /> },
    { to: '/dashboard/history', label: 'Booking History', icon: <BookOpen size={18} /> },
    { to: '/dashboard/transactions', label: 'Transactions', icon: <Tag size={18} /> },
    { to: '/dashboard/notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { to: '/profile', label: 'Profile Settings', icon: <User size={18} /> },
  ];

  const adminItems = [
    { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { to: '/dashboard/bookings', label: 'All Bookings', icon: <BookOpen size={18} /> },
    { to: '/dashboard/users', label: 'Membership Registry', icon: <Users size={18} /> },
    { to: '/dashboard/transactions-library', label: 'Transaction Library', icon: <Tag size={18} /> },
    { to: '/dashboard/notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { to: '/profile', label: 'Profile Settings', icon: <User size={18} /> },
  ];

  const publicItems = [
    { to: '/', label: 'Home', icon: <Home size={18} /> },
    { to: '/about', label: 'About Us', icon: <Info size={18} /> },
    { to: '/services', label: 'Services', icon: <Scissors size={18} /> },
    { to: '/pricing', label: 'Pricing', icon: <Tag size={18} /> },
    { to: '/gallery', label: 'Gallery', icon: <Image size={18} /> },
    { to: '/contact', label: 'Contact', icon: <Phone size={18} /> },
  ];

  const getNavItems = () => {
    if (!isLoggedIn) return publicItems;
    return user?.role === 'admin' ? adminItems : userItems;
  };

  const currentNavItems = getNavItems();

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
                <span className="sidebar-logo">BAZETWO BARBERS</span>
                {isLoggedIn && user && (
                  <div className="sidebar-user-minimal" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {user.avatar_url && <img src={user.avatar_url} alt="Profile" className="nav-avatar-img" style={{ width: '20px', height: '20px' }} />}
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
                  end={item.to === '/' || item.to === '/dashboard'}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="sidebar-divider" />

            <div className="sidebar-actions">
              {!isLoggedIn && (
                <NavLink to="/booking" className="btn-filled sidebar-book-btn" onClick={onClose}>
                  <BookOpen size={18} /> Book Your Chair
                </NavLink>
              )}
              
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
