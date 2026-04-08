import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation, NavLink } from 'react-router-dom';
import { 
  Bell, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  Calendar,
  Menu,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../../api/notifications';
import type { Notification } from '../../api/notifications';
import MobileNav from '../common/Navbar/MobileNav';
import ChatBot from '../common/ChatBot/ChatBot';
import './DashboardLayout.css';

const DashboardLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (!user) return;
        const fetchContextNotifs = async () => {
            try {
                const data = await fetchNotifications();
                setNotifications(data);
            } catch (err) {
                console.error("Error syncing notifications.");
            }
        };
        fetchContextNotifs();
        const interval = setInterval(fetchContextNotifs, 10000);
        return () => clearInterval(interval);
    }, [user]);

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
            setIsNotifOpen(false);
        } catch (e) {}
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isNew: false } : n));
            navigate('/dashboard/notifications');
            setIsNotifOpen(false);
        } catch (e) {}
    };

    const hasUnread = notifications.some(n => n.isNew);
    const unreadCount = notifications.filter(n => n.isNew).length;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/dashboard') return location.pathname === '/dashboard';
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className={`dashboard-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
            <aside className={`d-sidebar desktop-only ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="d-sidebar-header">
                    <Link to="/" className="d-logo">
                        <img src="/images/logo.jpeg" alt="Logo" />
                        {!isCollapsed && <span>BAZE 2 BARBERS</span>}
                    </Link>
                    <button className="d-collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>
                
                <nav className="d-sidebar-nav">
                    <NavLink to="/dashboard" end className={({ isActive }) => `d-nav-item ${isActive ? 'active' : ''}`} title="Overview">
                        <LayoutDashboard size={20} /> 
                        {!isCollapsed && <span>Overview</span>}
                    </NavLink>
                    {user?.role === 'user' && (
                        <>
                            <NavLink to="/booking" className={({ isActive }) => `d-nav-item ${isActive ? 'active' : ''}`} title="New Booking">
                                <Calendar size={20} /> 
                                {!isCollapsed && <span>New Booking</span>}
                            </NavLink>
                            <NavLink to="/dashboard/history" className={({ isActive }) => `d-nav-item ${isActive ? 'active' : ''}`} title="Booking History">
                                <Clock size={20} /> 
                                {!isCollapsed && <span>Booking History</span>}
                            </NavLink>
                            <NavLink to="/dashboard/transactions" className={({ isActive }) => `d-nav-item ${isActive ? 'active' : ''}`} title="Transactions">
                                <CreditCard size={20} /> 
                                {!isCollapsed && <span>Transactions</span>}
                            </NavLink>
                        </>
                    )}
                    {user?.role === 'admin' && (
                        <>
                            <NavLink to="/dashboard/bookings" className={({ isActive }) => `d-nav-item ${isActive ? 'active' : ''}`} title="All Bookings">
                                <Calendar size={20} /> 
                                {!isCollapsed && <span>All Bookings</span>}
                            </NavLink>
                            <NavLink to="/dashboard/users" className={({ isActive }) => `d-nav-item ${isActive ? 'active' : ''}`} title="Membership">
                                <Users size={20} /> 
                                {!isCollapsed && <span>Membership Registry</span>}
                            </NavLink>
                            <NavLink to="/dashboard/transactions-library" className={({ isActive }) => `d-nav-item ${isActive ? 'active' : ''}`} title="Transactions Library">
                                <CreditCard size={20} /> 
                                {!isCollapsed && <span>Transaction Library</span>}
                            </NavLink>
                        </>
                    )}
                    <Link to="/dashboard/notifications" className={`d-nav-item ${isActive('/dashboard/notifications') ? 'active' : ''}`} title="Notifications">
                        <Bell size={20} /> 
                        {!isCollapsed && <span>Notifications</span>}
                        {hasUnread && !isCollapsed && <span style={{ marginLeft: 'auto', backgroundColor: 'var(--gold)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 800 }}>{unreadCount}</span>}
                        {hasUnread && isCollapsed && <span style={{ position: 'absolute', right: '10px', top: '10px', width: '8px', height: '8px', backgroundColor: 'var(--gold)', borderRadius: '50%' }}></span>}
                    </Link>
                    <Link to="/profile" className={`d-nav-item ${isActive('/profile') ? 'active' : ''}`} title="Profile">
                        <User size={20} /> 
                        {!isCollapsed && <span>Profile Settings</span>}
                    </Link>
                </nav>

                <div className="d-sidebar-footer">
                    <button className="d-logout-btn" onClick={handleLogout} title="Logout">
                        <LogOut size={20} /> 
                        {!isCollapsed && <span>Logout</span>}
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
                        <div style={{ position: 'relative' }}>
                            <button className="d-icon-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
                                <Bell size={20} />
                                {hasUnread && <span className="notif-dot"></span>}
                            </button>
                            
                            {isNotifOpen && (
                                <div className="d-profile-dropdown" style={{ right: 0, width: '280px', padding: 0 }}>
                                    <div className="dropdown-header" style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Notifications</p>
                                    </div>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {notifications.slice(0, 3).length > 0 ? notifications.slice(0, 3).map(n => (
                                          <div 
                                              key={n.id} 
                                              style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: n.isNew ? 'rgba(212, 175, 55, 0.05)' : 'transparent', cursor: 'pointer' }}
                                              onClick={() => { if(n.id) handleMarkAsRead(n.id) }}
                                            >
                                                <p style={{ fontSize: '0.8125rem', marginBottom: '0.25rem', color: '#fff', fontWeight: n.isNew ? 600 : 400 }}>{n.text}</p>
                                                <span style={{ fontSize: '0.625rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>{n.time}</span>
                                            </div>
                                        )) : (
                                            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                                               No notifications available.
                                            </div>
                                        )}
                                        {notifications.length > 0 && (
                                            <button 
                                              onClick={() => { navigate('/dashboard/notifications'); setIsNotifOpen(false); }}
                                              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}
                                            >
                                              View All
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="d-profile-wrapper">
                            <button className="d-profile-trigger" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                <div className="d-avatar">{user?.name?.charAt(0) || 'U'}</div>
                                <span className="d-user-name desktop-only">{user?.name}</span>
                            </button>

                            {isProfileOpen && (
                                <div className="d-profile-dropdown">
                                    <div className="dropdown-header">
                                        <p title={user?.email}>{user?.email && user.email.length > 20 ? user.email.substring(0, 17) + '...' : user?.email}</p>
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
                    <Outlet context={{ notifications, handleMarkAllAsRead, handleMarkAsRead }} />
                </main>
            </div>

            <MobileNav 
                isOpen={isMobileMenuOpen} 
                onClose={() => setIsMobileMenuOpen(false)} 
                onAuthOpen={() => {}} 
            />
            <ChatBot />
        </div>
    );
};

export default DashboardLayout;
