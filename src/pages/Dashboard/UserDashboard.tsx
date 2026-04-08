import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Settings, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight,
  CreditCard,
  Scissors,
  Wallet,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchMyBookings } from '../../api/bookings';
import { createCheckoutSession } from '../../api/payments';
import type { Booking } from '../../api/types';
import toast from 'react-hot-toast';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
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

  const showcaseImages1 = ['/images/LuxuryLounge.jpg', '/images/premiumtools.jpg', '/images/InTheBarbershop.jpg'];
  const showcaseImages2 = ['/images/herobeard.jpg', '/images/viphomevisit.jpg', '/images/taperfade.jpg'];
  
  const [imgIndex1, setImgIndex1] = useState(0);
  const [imgIndex2, setImgIndex2] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setImgIndex1(prev => (prev + 1) % showcaseImages1.length);
      setImgIndex2(prev => (prev + 1) % showcaseImages2.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePayment = async (bookingId: string) => {
    try {
      const { url } = await createCheckoutSession(bookingId);
      window.location.href = url;
    } catch (err) {
      console.error(err);
      toast.error("Payment initiation failed. Please try again.");
    }
  };

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' && b.payment_status !== 'paid');
  const pendingBookings = bookings.filter(b => b.payment_status === 'pending');
  const totalInvested = bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.amount || 0), 0);
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.payment_status === 'paid');

  // Format member since month/year
  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'New Member';

  return (
    <div className="dashboard-content-main">
      <main className="dashboard-main-view">
        <motion.header 
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="header-greeting">
            <h1>Welcome back, <span className="text-gold">{user?.name?.split(' ')[0] || 'Champ'}</span></h1>
            <p>Your next transformation is just a booking away.</p>
          </div>
          <div className="header-stats-row">
            <div className="mini-stat-card">
              <div className="stat-icon-chamber"><Scissors size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Bookings</span>
                <div className="stat-value">{bookings.length}</div>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber"><Clock size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Pending</span>
                <div className="stat-value">{pendingBookings.length}</div>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber"><Wallet size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Payments</span>
                <div className="stat-value">£{totalInvested.toFixed(2)}</div>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber"><UserCheck size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Member Since</span>
                <div className="stat-value">{memberSince}</div>
              </div>
            </div>
          </div>
        </motion.header>

        <motion.section 
          className="dashboard-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Active Appointments */}
          <div className="dashboard-card active-bookings premium-card-bg">
            <div className="card-header">
              <h2><Calendar size={20} /> Upcoming Session</h2>
            </div>
            {loading ? (
              <div className="loading-state">Loading schedule...</div>
            ) : upcomingBookings.length > 0 ? (
              upcomingBookings.map(app => (
                <div key={app.id} className="appointment-banner">
                  <div className="app-main-info">
                    <div className="app-service">{app.service}</div>
                    <div className="app-detail"><User size={14} /> Barber: {app.barber}</div>
                    <div className="app-detail"><Clock size={14} /> {new Date(app.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
                  </div>
                  <div className="app-actions">
                    {app.payment_status === 'pending' && (
                      <button className="btn-filled-gold" onClick={() => handlePayment(app.id!)}>
                        <CreditCard size={14} /> Pay Now
                      </button>
                    )}
                    <div className="action-row">
                      <button className="btn-outlined-studio" onClick={() => navigate('/booking')}>Reschedule</button>
                      <button className="btn-outlined-studio" onClick={() => toast.success("Support request initiated.")}>Support</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state-ritual">
                <div className="empty-icon"><Calendar size={32} /></div>
                <h3>Quiet in the Studio</h3>
                <p>Your calendar is currently clear. It's time to secure your next transformation.</p>
                <button className="btn-filled-gold" onClick={() => navigate('/booking')}>Book Now</button>
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div className="dashboard-card transactions-card premium-card-bg">
            <div className="card-header">
              <h2><CreditCard size={20} /> Transaction History</h2>
            </div>
            {bookings.length > 0 ? (
              <div className="transaction-list">
                {bookings.slice(0, 3).map(booking => (
                  <div key={booking.id} className="transaction-item">
                    <div className="tx-icon">
                      <CheckCircle2 size={18} className={booking.payment_status === 'paid' ? 'text-gold' : 'text-muted'} />
                    </div>
                    <div className="tx-info">
                      <div className="tx-service">{booking.service}</div>
                      <div className="tx-date">{new Date(booking.date).toLocaleDateString()}</div>
                    </div>
                    <div className="tx-amount-status text-right">
                      <div className="tx-amount">£{booking.amount?.toFixed(2) || '30.00'}</div>
                      <div className={`tx-status ${booking.payment_status}`}>{booking.payment_status.toUpperCase()}</div>
                    </div>
                  </div>
                ))}
                <button className="btn-outlined-studio w-full mt-4" onClick={() => navigate('/dashboard/transactions')}>See History</button>
              </div>
            ) : (
              <div className="empty-state-ritual small">
                <div className="empty-icon"><CreditCard size={24} /></div>
                <p>No transaction history yet. Complete your first booking to see transactions.</p>
                <button className="btn-filled-gold mt-2" onClick={() => navigate('/booking')}>Book Now</button>
              </div>
            )}
          </div>

          {/* Quick Actions / Help */}
          <div className="dashboard-card support-card premium-card-bg">
            <div className="card-header">
              <h2><Settings size={20} /> Studio Support</h2>
            </div>
            <p className="mb-6 text-sm text-gray-400">Feedback or concerns? Our master team is here to ensure absolute satisfaction.</p>
            <div className="support-actions">
              <button className="btn-filled-gold" onClick={() => toast.success("Complaint recorded.")}>Make a Complaint</button>
              <button className="btn-outlined-studio" onClick={() => toast.success("Refund requested.")}>Request Refund</button>
            </div>
          </div>

          {/* Booking History */}
          <div className="dashboard-card recent-history premium-card-bg">
            <div className="card-header">
              <h2><TrendingUp size={20} /> Booking History</h2>
            </div>
            {pastBookings.length > 0 ? (
              <div className="history-list">
                {pastBookings.slice(0, 4).map(booking => (
                  <div key={booking.id} className="history-item">
                    <div className="history-info">
                      <span className="history-service">{booking.service}</span>
                      <span className="history-meta">{new Date(booking.date).toLocaleDateString()} • {booking.barber}</span>
                    </div>
                    <ChevronRight size={18} className="history-arrow" />
                  </div>
                ))}
                <button className="btn-outlined-studio w-full mt-4" onClick={() => navigate('/dashboard/history')}>View All Past Bookings</button>
              </div>
            ) : (
              <div className="empty-state-ritual small">
                <div className="empty-icon"><TrendingUp size={24} /></div>
                <p>Your studio legacy is waiting to be written.</p>
                <button className="btn-filled-gold mt-2" onClick={() => navigate('/booking')}>Start Your History</button>
              </div>
            )}
          </div>

          {/* Studio Showcase */}
          <div className="showcase-grid">
            <div className="showcase-card">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={showcaseImages1[imgIndex1]}
                  src={showcaseImages1[imgIndex1]} 
                  alt="Studio Showcase 1" 
                  className="showcase-img"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              </AnimatePresence>
            </div>
            <div className="showcase-card">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={showcaseImages2[imgIndex2]}
                  src={showcaseImages2[imgIndex2]} 
                  alt="Studio Showcase 2" 
                  className="showcase-img"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              </AnimatePresence>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default UserDashboard;
