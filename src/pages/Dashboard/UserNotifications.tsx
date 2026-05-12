import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { getSafeId } from '../../utils/ids';
import './Dashboard.css';

interface Notification {
  id: string;
  text: string;
  time?: string;
  isNew: boolean;
  created_at?: string;
}

interface OutletContextType {
  notifications: Notification[];
  handleMarkAllAsRead: () => void;
  handleMarkAsRead: (id: string) => void;
  formatRelativeTime: (time?: string, createdAt?: string) => string;
}

const UserNotifications: React.FC = () => {
  const { notifications, handleMarkAllAsRead, handleMarkAsRead, formatRelativeTime } = useOutletContext<OutletContextType>();

  return (
    <div className="dashboard-content-main">
      <main className="dashboard-main-view">
        <motion.header className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="header-greeting" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Your <span className="text-gold">Alerts</span></h1>
              <p>Keep track of your bookings and studio updates.</p>
            </div>
            {notifications.some(n => n.isNew) && (
              <button className="btn-outlined-studio slim mark-read-btn" onClick={handleMarkAllAsRead} title="Mark All as Read">
                <CheckCircle2 size={18} className="mobile-only" />
                <span className="desktop-only">Mark All as Read</span>
              </button>
            )}
          </div>
        </motion.header>

        <motion.section className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="dashboard-card premium-card-bg" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="card-header" style={{ padding: '1.5rem 2.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', marginBottom: 0 }}>
              <h2><Bell size={20} /> Alert Ledger</h2>
            </div>
            
            {notifications.length > 0 ? (
              <div className="notification-list">
                {notifications.map(n => {
                  const nId = getSafeId(n);
                  return (
                    <div 
                      key={nId} 
                      className={`notification-list-item ${n.isNew ? 'unread' : ''}`} 
                      onClick={() => { if(nId) handleMarkAsRead(nId) }}
                    >
                      <div className="notif-list-icon">
                        <Bell size={18} />
                      </div>
                      <div className="notif-list-content">
                        <div className="notif-list-text">{n.text}</div>
                        <div className="notif-list-time">{formatRelativeTime(n.time, n.created_at)}</div>
                      </div>
                      {n.isNew && (
                        <div className="new-badge-standard">
                          <span>NEW</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state-standard" style={{ padding: '4rem 2rem' }}>
                <div className="empty-icon"><CheckCircle2 size={24} /></div>
                <h3>All Caught Up</h3>
                <p>There are no notifications in your log.</p>
              </div>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default UserNotifications;
