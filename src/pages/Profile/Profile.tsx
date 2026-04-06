import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, History, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchMyBookings } from '../../api/bookings';
import { updateCurrentUser } from '../../api/auth';
import type { Booking } from '../../api/types';
import './Profile.css';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, login: updateUserContext, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Settings form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      fetchMyBookings()
        .then(setBookings)
        .catch((err) => console.error("Error fetching bookings:", err));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedUser = await updateCurrentUser({ name, email, phone });
      updateUserContext(updatedUser);
      alert('Profile updated successfully!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Update failed';
      alert((err as { response?: { data?: { detail?: string } } }).response?.data?.detail || message);
    } finally {
      setIsSaving(false);
    }
  };

  const upcomingBookings = bookings.filter(b => new Date(b.date) > new Date() && b.status !== 'cancelled');
  const pastBookings = bookings.filter(b => new Date(b.date) <= new Date() || b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="profile-page-wrapper">
      <div className="container profile-layout">
        
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="user-profile-header">
            <div className="avatar-large">{user?.name?.charAt(0) || 'U'}</div>
            <div className="user-info">
              <h3>{user?.name}</h3>
              <span className="capitalize">{user?.role}</span>
            </div>
          </div>

          <nav className="profile-nav">
            <button className={`p-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <User size={18} /> Dashboard
            </button>
            <button className={`p-nav-btn ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
              <Calendar size={18} /> My Bookings
            </button>
            <button className={`p-nav-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
              <History size={18} /> Past Sessions
            </button>
            <button className={`p-nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <Settings size={18} /> Settings
            </button>
          </nav>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="profile-content">
          
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-view">
              <h2 className="view-title">Welcome back, {user?.name?.split(' ')[0]}</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Total Visits</span>
                  <span className="stat-value">{pastBookings.length}</span>
                </div>
                <div className="stat-card gold-border">
                  <span className="stat-label">Upcoming</span>
                  <span className="stat-value">{upcomingBookings.length}</span>
                </div>
              </div>

              <div className="upcoming-preview">
                <div className="section-header-row">
                  <h3>Next Session</h3>
                  <button className="text-btn" onClick={() => setActiveTab('appointments')}>View All</button>
                </div>
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.slice(0, 1).map(app => (
                    <div key={app.id} className="appointment-mini-card">
                      <div className="app-main-info">
                        <span className="app-service">{app.service}</span>
                        <span className="app-barber">with {app.barber}</span>
                      </div>
                      <div className="app-time-info">
                        <span className="app-date">{new Date(app.date).toLocaleDateString()}</span>
                        <span className="app-time">{new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="app-status-badge">{app.status}</div>
                    </div>
                  ))
                ) : (
                  <p>No upcoming sessions.</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="appointments-view">
              <h2 className="view-title">Upcoming Bookings</h2>
              <div className="full-list">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map(app => (
                    <div key={app.id} className="appointment-wide-card">
                      <div className="wide-info">
                        <h4>{app.service}</h4>
                        <p>{new Date(app.date).toLocaleDateString()} at {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {app.barber}</p>
                      </div>
                      <div className="wide-actions">
                        <span className="status-label capitalize">{app.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>You have no upcoming bookings.</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="appointments-view">
              <h2 className="view-title">Past Sessions</h2>
              <div className="full-list">
                {pastBookings.length > 0 ? (
                  pastBookings.map(app => (
                    <div key={app.id} className="appointment-wide-card">
                      <div className="wide-info">
                        <h4>{app.service}</h4>
                        <p>{new Date(app.date).toLocaleDateString()} at {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {app.barber}</p>
                      </div>
                      <div className="wide-actions">
                        <span className={`status-label capitalize ${app.status === 'cancelled' ? 'text-danger' : 'text-success'}`}>{app.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>You have no past sessions.</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="settings-view">
              <h2 className="view-title">Account Settings</h2>
              <form className="settings-form" onSubmit={handleSaveSettings}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    placeholder="+44 7700 900123" 
                  />
                </div>
                <button type="submit" className="btn-filled" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          )}

        </main>

      </div>
    </div>
  );
};

export default Profile;
