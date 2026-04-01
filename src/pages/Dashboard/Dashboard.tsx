import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  TrendingUp, 
  Crown,
  Scissors,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const activeAppointments = [
    {
      id: 1,
      service: "Signature Haircut & Beard",
      barber: "Master J",
      date: "Tomorrow, 2:00 PM",
      status: "Confirmed",
      price: "£55"
    }
  ];

  const pastCuts = [
    { id: 101, service: "Skin Fade", date: "12 Mar 2024", barber: "Dexter" },
    { id: 102, service: "Signature Haircut", date: "15 Feb 2024", barber: "Master J" }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <img src="/images/logo.jpeg" alt="Logo" className="sidebar-logo-img" />
          <span>BAZE 2 BARBERS</span>
        </div>
        
        <nav className="sidebar-nav">
          <button className="nav-item active"><TrendingUp size={20} /> Overview</button>
          <button className="nav-item" onClick={() => navigate('/booking')}><Calendar size={20} /> New Booking</button>
          <button className="nav-item"><Scissors size={20} /> My Services</button>
          <button className="nav-item" onClick={() => navigate('/profile')}><User size={20} /> Profile Settings</button>
          <button className="nav-item"><Settings size={20} /> Notifications</button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <motion.header 
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-greeting">
            <h1>Welcome back, <span className="text-gold">{user?.name || 'Champ'}</span></h1>
            <p>Your next transformation is just a click away.</p>
          </div>
          <div className="header-stats-row">
            <div className="mini-stat-card">
              <span className="stat-label">Loyalty Points</span>
              <div className="stat-value"><Crown size={18} className="text-gold" /> 450</div>
            </div>
            <div className="mini-stat-card">
              <span className="stat-label">Member Since</span>
              <div className="stat-value">Oct 2023</div>
            </div>
          </div>
        </motion.header>

        <motion.section 
          className="dashboard-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Active Bookings */}
          <div className="dashboard-card active-bookings">
            <div className="card-header">
              <h2><Calendar size={20} /> Upcoming Appointment</h2>
              <button className="text-gold-btn" onClick={() => navigate('/booking')}>Modify</button>
            </div>
            {activeAppointments.length > 0 ? (
              activeAppointments.map(app => (
                <div key={app.id} className="appointment-banner">
                  <div className="app-main-info">
                    <div className="app-service">{app.service}</div>
                    <div className="app-detail"><User size={14} /> {app.barber}</div>
                    <div className="app-detail"><Clock size={14} /> {app.date}</div>
                  </div>
                  <div className="app-badge">
                    <CheckCircle2 size={16} /> {app.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No upcoming appointments found.</p>
                <button className="btn-filled" onClick={() => navigate('/booking')}>Book Now</button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button className="action-tile" onClick={() => navigate('/services')}>
                <Scissors size={24} />
                <span>View Menu</span>
              </button>
              <button className="action-tile">
                <MapPin size={24} />
                <span>Directions</span>
              </button>
              <button className="action-tile" onClick={() => navigate('/contact')}>
                <Clock size={24} />
                <span>Support</span>
              </button>
            </div>
          </div>

          {/* Recent History */}
          <div className="dashboard-card recent-history">
            <h2>Grooming History</h2>
            <div className="history-list">
              {pastCuts.map(cut => (
                <div key={cut.id} className="history-item">
                  <div className="history-info">
                    <span className="history-service">{cut.service}</span>
                    <span className="history-meta">{cut.date} • {cut.barber}</span>
                  </div>
                  <ChevronRight size={18} className="history-arrow" />
                </div>
              ))}
            </div>
            <button className="view-more-btn">View All History</button>
          </div>

          {/* Loyalty Banner */}
          <div className="dashboard-card loyalty-card text-center">
            <Crown size={40} className="text-gold mx-auto mb-4" />
            <h3>Gold Tier Member</h3>
            <p className="mb-4">You're 50 points away from a flat <span className="text-gold">10% discount</span> on your next visit!</p>
            <div className="progress-bar-container">
              <div className="progress-fill" style={{ width: '85%' }}></div>
            </div>
            <span className="progress-text">85% Complete</span>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;
