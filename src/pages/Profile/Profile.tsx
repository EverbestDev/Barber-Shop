import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, History, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const appointments = [
  { id: 1, service: "Signature Haircut", barber: "Master J", date: "April 15, 2026", time: "2:00 PM", status: "Upcoming" }
];

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page-wrapper">
      <div className="container profile-layout">
        
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="user-profile-header">
            <div className="avatar-large">JD</div>
            <div className="user-info">
              <h3>John Doe</h3>
              <span>Gold Member</span>
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
              <History size={18} /> Past Session
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
              <h2 className="view-title">Welcome back, John</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Total Visits</span>
                  <span className="stat-value">12</span>
                </div>
                <div className="stat-card gold-border">
                  <span className="stat-label">Member Points</span>
                  <span className="stat-value">450</span>
                </div>
              </div>

              <div className="upcoming-preview">
                <div className="section-header-row">
                  <h3>Next Session</h3>
                  <button className="text-btn" onClick={() => setActiveTab('appointments')}>View All</button>
                </div>
                {appointments.map(app => (
                  <div key={app.id} className="appointment-mini-card">
                    <div className="app-main-info">
                      <span className="app-service">{app.service}</span>
                      <span className="app-barber">with {app.barber}</span>
                    </div>
                    <div className="app-time-info">
                      <span className="app-date">{app.date}</span>
                      <span className="app-time">{app.time}</span>
                    </div>
                    <div className="app-status-badge">{app.status}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="appointments-view">
              <h2 className="view-title">Upcoming Bookings</h2>
              <div className="full-list">
                {appointments.map(app => (
                  <div key={app.id} className="appointment-wide-card">
                    <div className="wide-info">
                      <h4>{app.service}</h4>
                      <p>{app.date} at {app.time} • {app.barber}</p>
                    </div>
                    <div className="wide-actions">
                      <button className="btn-outlined slim">Reschedule</button>
                      <button className="text-btn danger">Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="settings-view">
              <h2 className="view-title">Account Settings</h2>
              <form className="settings-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue="John Doe" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue="john@example.com" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" defaultValue="+44 7700 900123" />
                </div>
                <button className="btn-filled">Save Changes</button>
              </form>
            </motion.div>
          )}

        </main>

      </div>
    </div>
  );
};

export default Profile;
