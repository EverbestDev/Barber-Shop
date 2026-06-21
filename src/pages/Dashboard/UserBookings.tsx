import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import { fetchMyBookings } from '../../api/bookings';
import { getSafeId } from '../../utils/ids';
import type { Booking } from '../../api/types';
import './Dashboard.css';

const UserBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return bookings.slice(startIndex, startIndex + itemsPerPage);
  }, [bookings, currentPage]);

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
              <>
                <div className="history-list">
                  {paginatedBookings.map(app => (
                    <div key={getSafeId(app)} className="history-item" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                      <div className="history-info">
                        <span className="history-service text-lg">{app.service}</span>
                        <span className="history-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <User size={12} /> {app.barber} | <Clock size={12} /> {new Date(app.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                         {app.is_free_promo && (
                           <span style={{ 
                             padding: '4px 10px', 
                             borderRadius: '4px', 
                             fontSize: '0.65rem', 
                             fontWeight: 800, 
                             backgroundColor: 'rgba(212, 175, 55, 0.15)',
                             color: 'var(--gold)',
                             border: '1px solid rgba(212, 175, 55, 0.2)',
                             letterSpacing: '0.5px'
                           }}>
                             FREE PROMO
                           </span>
                         )}
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

                {/* Pagination Controls */}
                {bookings.length > itemsPerPage && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-white/5 px-2">
                    <div className="text-xs text-neutral-400 font-medium">
                      Showing <span className="text-white font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="text-white font-semibold">
                        {Math.min(currentPage * itemsPerPage, bookings.length)}
                      </span>{' '}
                      of <span className="text-white font-semibold">{bookings.length}</span> entries
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
                        {Array.from({ length: Math.ceil(bookings.length / itemsPerPage) }, (_, idx) => idx + 1)
                          .filter(page => {
                            const totalPages = Math.ceil(bookings.length / itemsPerPage);
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
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(bookings.length / itemsPerPage)))}
                        disabled={currentPage === Math.ceil(bookings.length / itemsPerPage)}
                        className="px-3 py-1.5 rounded-md text-xs font-bold border border-white/10 text-neutral-400 hover:text-white hover:border-gold/30 disabled:opacity-40 disabled:hover:text-neutral-400 disabled:hover:border-white/10 transition-all duration-200"
                      >
                        Next
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.ceil(bookings.length / itemsPerPage))}
                        disabled={currentPage === Math.ceil(bookings.length / itemsPerPage)}
                        className="px-2.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider border border-white/10 text-neutral-400 hover:text-white hover:border-gold/30 disabled:opacity-40 disabled:hover:text-neutral-400 disabled:hover:border-white/10 transition-all duration-200"
                      >
                        Last
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state-standard">
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
