import React, { useState, useMemo } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return notifications.slice(startIndex, startIndex + itemsPerPage);
  }, [notifications, currentPage]);

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
              <>
                <div className="notification-list">
                  {paginatedNotifications.map(n => {
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

                {/* Pagination Controls */}
                {notifications.length > itemsPerPage && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-white/5">
                    <div className="text-xs text-neutral-400 font-medium">
                      Showing <span className="text-white font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="text-white font-semibold">
                        {Math.min(currentPage * itemsPerPage, notifications.length)}
                      </span>{' '}
                      of <span className="text-white font-semibold">{notifications.length}</span> entries
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-2.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider border border-white/10 text-neutral-400 hover:text-white hover:border-gold/30 disabled:opacity-40 disabled:hover:text-neutral-400 disabled:hover:border-white/10 transition-all duration-200"
                      >
                        First
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-md text-xs font-bold border border-white/10 text-neutral-400 hover:text-white hover:border-gold/30 disabled:opacity-40 disabled:hover:text-neutral-400 disabled:hover:border-white/10 transition-all duration-200"
                      >
                        Prev
                      </button>
                      
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: Math.ceil(notifications.length / itemsPerPage) }, (_, idx) => idx + 1)
                          .filter(page => {
                            const totalPages = Math.ceil(notifications.length / itemsPerPage);
                            return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                          })
                          .map((page, idx, arr) => {
                            const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
                            return (
                              <React.Fragment key={page}>
                                {showEllipsis && <span className="text-neutral-600 text-xs px-1">...</span>}
                                <button
                                  onClick={() => setCurrentPage(page)}
                                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                                    currentPage === page
                                      ? 'bg-gold text-black border border-gold shadow-[0_0_10px_rgba(255,204,0,0.2)]'
                                      : 'border border-white/10 text-neutral-400 hover:text-white hover:border-gold/30'
                                  }`}
                                >
                                  {page}
                                </button>
                              </React.Fragment>
                            );
                          })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(notifications.length / itemsPerPage)))}
                        disabled={currentPage === Math.ceil(notifications.length / itemsPerPage)}
                        className="px-3 py-1.5 rounded-md text-xs font-bold border border-white/10 text-neutral-400 hover:text-white hover:border-gold/30 disabled:opacity-40 disabled:hover:text-neutral-400 disabled:hover:border-white/10 transition-all duration-200"
                      >
                        Next
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.ceil(notifications.length / itemsPerPage))}
                        disabled={currentPage === Math.ceil(notifications.length / itemsPerPage)}
                        className="px-2.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider border border-white/10 text-neutral-400 hover:text-white hover:border-gold/30 disabled:opacity-40 disabled:hover:text-neutral-400 disabled:hover:border-white/10 transition-all duration-200"
                      >
                        Last
                      </button>
                    </div>
                  </div>
                )}
              </>
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
