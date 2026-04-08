import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import './Dashboard.css';

interface Notification {
  id: number;
  text: string;
  time: string;
  isNew: boolean;
}

interface OutletContextType {
  notifications: Notification[];
  handleMarkAllAsRead: () => void;
  handleMarkAsRead: (id: number) => void;
}

const UserNotifications: React.FC = () => {
  const { notifications, handleMarkAllAsRead, handleMarkAsRead } = useOutletContext<OutletContextType>();

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
              <button className="btn-outlined-studio slim" onClick={handleMarkAllAsRead}>
                Mark All as Read
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
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    className={`notification-list-item ${n.isNew ? 'unread' : ''}`} 
                    onClick={() => { if(n.id) handleMarkAsRead(n.id) }}
                  >
                    <div className="notif-list-icon">
                      <Bell size={18} />
                    </div>
                    <div className="notif-list-content">
                      <div className="notif-list-text">{n.text}</div>
                      <div className="notif-list-time">{n.time}</div>
                    </div>
                    {n.isNew && (
                       <div className="new-badge-ritual">
                        <span>NEW</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-ritual" style={{ padding: '4rem 2rem' }}>
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
