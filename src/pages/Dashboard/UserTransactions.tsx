import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2, Download } from 'lucide-react';
import { fetchMyBookings } from '../../api/bookings';
import { getSafeId } from '../../utils/ids';
import { downloadReceiptPDF } from '../../utils/receipt';
import type { Booking } from '../../api/types';
import toast from 'react-hot-toast';
import './Dashboard.css';

const UserTransactions: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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

  const handleDownload = async (booking: Booking) => {
    try {
      await downloadReceiptPDF(booking);
      toast.success("Receipt downloaded.");
    } catch {
      toast.error("Failed to generate receipt.");
    }
  };

  const transactions = useMemo(() => {
    return bookings.filter(b => b.amount !== undefined);
  }, [bookings]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return transactions.slice(startIndex, startIndex + itemsPerPage);
  }, [transactions, currentPage]);

  return (
    <div className="dashboard-content-main">
      <main className="dashboard-main-view">
        <motion.header className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="header-greeting">
            <h1>Transaction <span className="text-gold">Ledger</span></h1>
            <p>A transparent history of your investments with us.</p>
          </div>
        </motion.header>

        <motion.section className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="dashboard-card transactions-card premium-card-bg">
            <div className="card-header">
              <h2><CreditCard size={20} /> All Transactions</h2>
            </div>
            {loading ? (
               <div className="loading-state">Synchronizing ledger...</div>
            ) : transactions.length > 0 ? (
              <>
                <div className="transaction-list">
                  {paginatedTransactions.map(booking => (
                    <div key={getSafeId(booking)} className="transaction-item">
                      <div className="tx-icon">
                        <CheckCircle2 size={18} className={booking.payment_status === 'paid' ? 'text-gold' : 'text-muted'} />
                      </div>
                      <div className="tx-info">
                        <div className="tx-service">{booking.service}</div>
                        <div className="tx-date">{new Date(booking.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
                      </div>
                      <div className="tx-amount-status text-right">
                        <div className="tx-amount">£{booking.amount?.toFixed(2) || '30.00'}</div>
                        <div className="tx-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
                          <div className={`tx-status ${booking.payment_status}`}>{booking.payment_status.toUpperCase()}</div>
                          {booking.payment_status === 'paid' && (
                            <button 
                              className="btn-icon-mini" 
                              onClick={() => handleDownload(booking)}
                              title="Download Receipt"
                              style={{ 
                                background: 'rgba(255,255,255,0.05)', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '4px',
                                padding: '4px',
                                cursor: 'pointer',
                                color: 'var(--gold)'
                              }}
                            >
                              <Download size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {transactions.length > itemsPerPage && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-white/5 px-2">
                    <div className="text-xs text-neutral-400 font-medium">
                      Showing <span className="text-white font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="text-white font-semibold">
                        {Math.min(currentPage * itemsPerPage, transactions.length)}
                      </span>{' '}
                      of <span className="text-white font-semibold">{transactions.length}</span> entries
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
                        {Array.from({ length: Math.ceil(transactions.length / itemsPerPage) }, (_, idx) => idx + 1)
                          .filter(page => {
                            const totalPages = Math.ceil(transactions.length / itemsPerPage);
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
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(transactions.length / itemsPerPage)))}
                        disabled={currentPage === Math.ceil(transactions.length / itemsPerPage)}
                        className="px-3 py-1.5 rounded-md text-xs font-bold border border-white/10 text-neutral-400 hover:text-white hover:border-gold/30 disabled:opacity-40 disabled:hover:text-neutral-400 disabled:hover:border-white/10 transition-all duration-200"
                      >
                        Next
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.ceil(transactions.length / itemsPerPage))}
                        disabled={currentPage === Math.ceil(transactions.length / itemsPerPage)}
                        className="px-2.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider border border-white/10 text-neutral-400 hover:text-white hover:border-gold/30 disabled:opacity-40 disabled:hover:text-neutral-400 disabled:hover:border-white/10 transition-all duration-200"
                      >
                        Last
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state-standard small">
                <div className="empty-icon"><CreditCard size={24} /></div>
                <p>No transaction history yet.</p>
              </div>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default UserTransactions;
