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
              <h1>System <span className="text-gold">Notifications</span></h1>
              <p>Your transparent transmission log from the studio.</p>
            </div>
            {notifications.some(n => n.isNew) && (
              <button className="btn-outlined-studio slim" onClick={handleMarkAllAsRead}>
                Mark All as Read
              </button>
            )}
          </div>
        </motion.header>

        <motion.section className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="dashboard-card premium-card-bg">
            <div className="card-header">
              <h2><Bell size={20} /> Alert History</h2>
            </div>
            
            {notifications.length > 0 ? (
              <div className="transaction-list">
                {notifications.map(n => (
                  <div key={n.id} className="transaction-item" style={{ cursor: n.isNew ? 'pointer' : 'default', backgroundColor: n.isNew ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255, 255, 255, 0.015)' }} onClick={() => { if(n.isNew) handleMarkAsRead(n.id) }}>
                    <div className="tx-icon" style={{ backgroundColor: n.isNew ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.05)' }}>
                       <Bell size={18} className={n.isNew ? 'text-gold' : 'text-muted'} />
                    </div>
                    <div className="tx-info">
                      <div className="tx-service" style={{ color: n.isNew ? '#fff' : 'var(--text-secondary)' }}>{n.text}</div>
                      <div className="tx-date">{n.time}</div>
                    </div>
                    {n.isNew && (
                       <div className="tx-amount-status text-right">
                         <div className="tx-status" style={{ color: 'var(--gold)' }}>UNREAD</div>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-ritual small">
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
