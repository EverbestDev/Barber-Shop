import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { 
  Bell, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  Calendar,
  Scissors,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import MobileNav from '../common/Navbar/MobileNav';
import './DashboardLayout.css';

const DashboardLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="dashboard-layout">
            <aside className="d-sidebar desktop-only">
                <div className="d-sidebar-header">
                    <Link to="/" className="d-logo">
                        <img src="/images/logo.jpeg" alt="Logo" />
                        <span>BAZE 2 BARBERS</span>
                    </Link>
                </div>
                
                <nav className="d-sidebar-nav">
                    <Link to="/dashboard" className="d-nav-item active">
                        <LayoutDashboard size={20} /> Overview
                    </Link>
                    <Link to="/booking" className="d-nav-item">
                        <Calendar size={20} /> New Booking
                    </Link>
                    <Link to="/services" className="d-nav-item">
                        <Scissors size={20} /> My Services
                    </Link>
                    <Link to="/profile" className="d-nav-item">
                        <User size={20} /> Profile
                    </Link>
                </nav>

                <div className="d-sidebar-footer">
                    <button className="d-logout-btn" onClick={handleLogout}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            <div className="d-main-wrapper">
                <header className="d-topbar">
                    <div className="d-topbar-left">
                        <button className="d-menu-trigger mobile-only" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h2 className="d-page-title desktop-only">Executive Dashboard</h2>
                    </div>

                    <div className="d-topbar-actions">
                        <button className="d-icon-btn">
                            <Bell size={20} />
                            <span className="notif-dot"></span>
                        </button>
                        
                        <div className="d-profile-wrapper">
                            <button className="d-profile-trigger" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                <div className="d-avatar">{user?.name?.charAt(0) || 'U'}</div>
                                <span className="d-user-name desktop-only">{user?.name}</span>
                            </button>

                            {isProfileOpen && (
                                <div className="d-profile-dropdown">
                                    <div className="dropdown-header">
                                        <p>{user?.email}</p>
                                    </div>
                                    <button onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}>
                                        <Settings size={16} /> Profile Settings
                                    </button>
                                    <div className="divider"></div>
                                    <button onClick={handleLogout} className="logout-link">
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="d-content">
                    <Outlet />
                </main>
            </div>

            <MobileNav 
                isOpen={isMobileMenuOpen} 
                onClose={() => setIsMobileMenuOpen(false)} 
                onAuthOpen={() => {}} 
            />
        </div>
    );
};

export default DashboardLayout;
