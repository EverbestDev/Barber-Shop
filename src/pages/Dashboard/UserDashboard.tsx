import React, { useEffect, useState } from 'react';
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
  ChevronRight,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchMyBookings } from '../../api/bookings';
import { createCheckoutSession } from '../../api/payments';
import type { Booking } from '../../api/types';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const data = await fetchMyBookings();
        setBookings(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getBookings();
  }, []);

  const handlePayment = async (bookingId: string) => {
    try {
      const { url } = await createCheckoutSession(bookingId);
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed. Please try again.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' && b.payment_status !== 'paid');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.payment_status === 'paid');

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <img src="/images/logo.jpeg" alt="Logo" className="sidebar-logo-img" />
          <span>BAZE 2 BARBERS</span>
        </div>
        
        <nav className="sidebar-nav">
          <button className="nav-item active"><TrendingUp size={20} /> Overview</button>
          <button className="nav-item" onClick={() => navigate('/booking')}><Calendar size={20} /> New Booking</button>
          <button className="nav-item" onClick={() => navigate('/services')}><Scissors size={20} /> My Services</button>
          <button className="nav-item" onClick={() => navigate('/profile')}><User size={20} /> Profile Settings</button>
          <button className="nav-item"><Settings size={20} /> Notifications</button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <motion.header 
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="dashboard-card active-bookings">
            <div className="card-header">
              <h2><Calendar size={20} /> Upcoming Appointment</h2>
            </div>
            {loading ? (
              <p>Loading your appointments...</p>
            ) : upcomingBookings.length > 0 ? (
              upcomingBookings.map(app => (
                <div key={app.id} className="appointment-banner">
                  <div className="app-main-info">
                    <div className="app-service">{app.service}</div>
                    <div className="app-detail"><User size={14} /> Barber: {app.barber}</div>
                    <div className="app-detail"><Clock size={14} /> {new Date(app.date).toLocaleString()}</div>
                  </div>
                  <div className="app-actions">
                    {app.payment_status === 'pending' && (
                      <button className="pay-now-btn" onClick={() => handlePayment(app.id!)}>
                        <CreditCard size={14} /> Pay Now
                      </button>
                    )}
                    <div className="app-badge">
                      <CheckCircle2 size={16} /> {app.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No pending appointments found.</p>
                <button className="btn-filled" onClick={() => navigate('/booking')}>Book Now</button>
              </div>
            )}
          </div>

          <div className="dashboard-card recent-history">
            <h2>Grooming History</h2>
            <div className="history-list">
              {pastBookings.length > 0 ? (
                pastBookings.map(booking => (
                  <div key={booking.id} className="history-item">
                    <div className="history-info">
                      <span className="history-service">{booking.service}</span>
                      <span className="history-meta">{new Date(booking.date).toLocaleDateString()} • {booking.payment_status === 'paid' ? 'Paid' : 'Unpaid'}</span>
                    </div>
                    <ChevronRight size={18} className="history-arrow" />
                  </div>
                ))
              ) : (
                <p>No history found.</p>
              )}
            </div>
          </div>

          <div className="dashboard-card loyalty-card text-center">
            <Crown size={40} className="text-gold mx-auto mb-4" />
            <h3>Gold Tier Member</h3>
            <p className="mb-4">You're 50 points away from a flat <span className="text-gold">10% discount</span>!</p>
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

export default UserDashboard;
