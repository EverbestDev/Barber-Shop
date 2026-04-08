import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import { fetchMyBookings } from '../../api/bookings';
import type { Booking } from '../../api/types';
import './Dashboard.css';

const UserBookings: React.FC = () => {
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
    
    // Polling every 5 seconds to ensure real-time updates from Admin actions
    const intervalId = setInterval(getBookings, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="dashboard-content-main">
      <main className="dashboard-main-view">
        <motion.header className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="header-greeting">
            <h1>Booking <span className="text-gold">History</span></h1>
            <p>Your complete record of all scheduled sessions.</p>
          </div>
        </motion.header>

        <motion.section className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="dashboard-card premium-card-bg">
            <div className="card-header">
              <h2><Calendar size={20} /> All Bookings</h2>
            </div>
            {loading ? (
              <div className="loading-state">Loading history...</div>
            ) : bookings.length > 0 ? (
              <div className="history-list">
                {bookings.map(app => (
                  <div key={app.id} className="history-item" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="history-info">
                      <span className="history-service text-lg">{app.service}</span>
                      <span className="history-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <User size={12} /> {app.barber} | <Clock size={12} /> {new Date(app.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <span style={{ 
                         padding: '6px 12px', 
                         borderRadius: '20px', 
                         fontSize: '0.75rem', 
                         fontWeight: 'bold', 
                         backgroundColor: app.status === 'completed' ? 'rgba(46, 204, 113, 0.15)' : app.status === 'cancelled' ? 'rgba(235, 87, 87, 0.15)' : 'rgba(243, 156, 18, 0.15)',
                         color: app.status === 'completed' ? '#2ecc71' : app.status === 'cancelled' ? '#eb5757' : '#f39c12'
                       }}>
                         {app.status?.toUpperCase() || 'PENDING'}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-ritual">
                <div className="empty-icon"><Calendar size={32} /></div>
                <h3>No Bookings Yet</h3>
                <p>You haven't made any bookings yet.</p>
              </div>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default UserBookings;
