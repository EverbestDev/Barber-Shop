import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Search, 
  Download,
  CheckCircle2,
  Clock,
  RefreshCcw,
  SortAsc,
  MoreVertical
} from 'lucide-react';
import { fetchAllBookings, refundBooking } from '../../api/bookings';
import { getSafeId } from '../../utils/ids';
import type { Booking } from '../../api/types';
import { downloadCSV } from '../../utils/export';
import toast from 'react-hot-toast';

const AdminTransactionsSkeleton = () => (
    <div className="dashboard-content-main">
      <div className="dashboard-main-view">
        <div className="dashboard-header">
          <div className="skeleton skeleton-title" />
          <div className="header-stats-row">
            {[1,2,3].map(i => <div key={i} className="mini-stat-card skeleton skeleton-card" />)}
          </div>
        </div>
        <div className="dashboard-card premium-card-bg">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton skeleton-table-row" />)}
        </div>
      </div>
    </div>
);

const AdminTransactions: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedTransaction, setSelectedTransaction] = useState<Booking | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [refundConfirmId, setRefundConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = () => setOpenActionId(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const b = await fetchAllBookings();
        setBookings(b || []);
      } catch (err) {
        toast.error("Failed to sync financial ledger.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const transactions = useMemo(() => {
      return [...bookings]
        .filter(b => b.payment_status !== 'unpaid');
  }, [bookings]);

  const transactionStats = useMemo(() => {
      return {
          total: transactions.filter(t => t.payment_status === 'paid').reduce((sum, t) => sum + (t.amount || 0), 0),
          pending: transactions.filter(t => t.payment_status === 'pending').reduce((sum, t) => sum + (t.amount || 0), 0),
          successCount: transactions.filter(t => t.payment_status === 'paid').length,
          pendingCount: transactions.filter(t => t.payment_status === 'pending').length
      };
  }, [transactions]);

  const sortedAndFilteredTransactions = useMemo(() => {
    const result = transactions.filter(t => 
      (t.guest_name && t.guest_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.user_id && t.user_id.toLowerCase().includes(searchQuery.toLowerCase())) || 
      t.service.toLowerCase().includes(searchQuery.toLowerCase())
    );

    result.sort((a, b) => {
      const dateA = new Date(a.created_at || a.date).getTime();
      const dateB = new Date(b.created_at || b.date).getTime();
      if (sortBy === 'recent') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      if (sortBy === 'amount') return (b.amount || 0) - (a.amount || 0);
      if (sortBy === 'patron') return (a.guest_name || a.user_id || '').localeCompare(b.guest_name || b.user_id || '');
      return 0;
    });

    return result;
  }, [transactions, searchQuery, sortBy]);

  const handleRefund = async (id: string) => {
      const loadToast = toast.loading("Processing refund...");
      try {
          await refundBooking(id);
          setBookings(bookings.map(b => (getSafeId(b) === id) ? { ...b, payment_status: 'refunded' } : b));
          toast.success("Transaction refunded successfully.", { id: loadToast });
      } catch {
          toast.error("Refund failed. Contact Stripe.", { id: loadToast });
      } finally {
          setRefundConfirmId(null);
      }
  };

  if (loading) return <AdminTransactionsSkeleton />;

  return (
    <div className="dashboard-content-main">
      <main className="dashboard-main-view">
        <motion.header className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="admin-overview-header">
            <div>
              <h1 className="text-3d">Financial <span className="text-gold">Ledger</span></h1>
              <p>Real-time audit of studio revenue and transaction integrity.</p>
            </div>
            <div className="header-actions">
               <button className="btn-outlined-studio" onClick={() => downloadCSV(sortedAndFilteredTransactions, 'financial_ledger.csv')}>
                 <Download size={16} /> Export Data
               </button>
            </div>
          </div>

          <div className="header-stats-row">
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: '#4caf50' }}><CheckCircle2 size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Successful Flow</span>
                <div className="stat-value">£{transactionStats.total.toFixed(2)}</div>
                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{transactionStats.successCount} payments</span>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: 'var(--gold)' }}><Clock size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Pending Intake</span>
                <div className="stat-value">£{transactionStats.pending.toFixed(2)}</div>
                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{transactionStats.pendingCount} in queue</span>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: '#2196f3' }}><RefreshCcw size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Total Volume</span>
                <div className="stat-value">£{(transactionStats.total + transactionStats.pending).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </motion.header>

        <section className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-card premium-card-bg">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <h2><CreditCard size={20} /> Financial Transactions</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="search-bar-standard">
                  <Search size={16} color="var(--text-secondary)" />
                  <input 
                    type="text" 
                    placeholder="Search transactions..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="filter-wrapper">
                    <SortAsc size={16} color="var(--text-secondary)" />
                    <select className="status-selector" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="recent">RECENT</option>
                      <option value="oldest">OLDEST</option>
                      <option value="amount">AMOUNT</option>
                      <option value="patron">NAME</option>
                    </select>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Payment Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredTransactions.map((t, idx) => {
                    const tId = getSafeId(t);
                    return (
                      <tr key={`${tId}-${idx}`}>
                        <td className="truncate" title={t.guest_name || t.user_id || 'Guest'}>{t.guest_name || t.user_id || 'Guest'}</td>
                        <td style={{ fontWeight: 700 }}>{t.service}</td>
                        <td style={{ fontWeight: 800, color: 'var(--gold)' }}>£{(t.amount || 0).toFixed(2)}</td>
                        <td><span className={`payment-badge ${t.payment_status}`}>{t.payment_status}</span></td>
                        <td>{t.created_at ? new Date(t.created_at).toLocaleDateString() : new Date(t.date).toLocaleDateString()}</td>
                        <td>
                          <div style={{ position: 'relative' }}>
                            <button 
                              className="d-icon-btn" 
                              style={{ width: '32px', height: '32px' }}
                              onClick={(e) => { e.stopPropagation(); setOpenActionId(openActionId === tId ? null : (tId || null)); }}
                            >
                              <MoreVertical size={16} />
                            </button>
                            {openActionId === tId && tId && (
                              <div className="d-profile-dropdown" style={{ right: '0', top: '100%', minWidth: '150px' }} onClick={(e) => e.stopPropagation()}>
                                  <button onClick={() => { setSelectedTransaction(t); setOpenActionId(null); }}>View Details</button>
                                  {t.payment_status === 'paid' && (
                                     <button 
                                       style={{ color: '#eb5757' }} 
                                       onClick={() => { setRefundConfirmId(tId); setOpenActionId(null); }}
                                     >
                                       Refund Player
                                     </button>
                                  )}
                                  {t.payment_status !== 'paid' && (
                                     <button 
                                       onClick={() => { 
                                         toast.success("Payment request sent to patron."); 
                                         setOpenActionId(null); 
                                       }}
                                     >
                                       Request Transaction
                                     </button>
                                  )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {sortedAndFilteredTransactions.length === 0 && (
                <div className="empty-state-standard" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <div className="empty-icon-chamber">
                    <CreditCard size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                  </div>
                  <h3 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>No Records Found</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>The financial ledger is currently clear of transaction logs.</p>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        <AnimatePresence>
          {selectedTransaction && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTransaction(null)}
            >
              <motion.div 
                className="modal-content premium-card-bg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                   <h2>Transaction Details</h2>
                   <button className="close-btn" onClick={() => setSelectedTransaction(null)}>&times;</button>
                </div>
                <div className="modal-body">
                   <div className="detail-row"><span>Service:</span> <strong>{selectedTransaction.service}</strong></div>
                   <div className="detail-row"><span>Patron Name:</span> <strong>{selectedTransaction.guest_name || 'Guest'}</strong></div>
                   <div className="detail-row"><span>Patron ID (Auth):</span> <strong>{selectedTransaction.user_id || 'N/A'}</strong></div>
                   <div className="detail-row"><span>Transaction Code:</span> <strong className="text-muted">{selectedTransaction.stripe_session_id || 'N/A'}</strong></div>
                   <div className="detail-row"><span>Service Date:</span> <strong>{new Date(selectedTransaction.date).toLocaleDateString()}</strong></div>
                   <div className="detail-row"><span>Payment Logged On:</span> <strong>{selectedTransaction.created_at ? new Date(selectedTransaction.created_at).toLocaleString() : 'N/A'}</strong></div>
                   <div className="detail-row"><span>Log Amount:</span> <strong className="text-gold">£{(selectedTransaction.amount || 0).toFixed(2)}</strong></div>
                   <div className="detail-row"><span>Payment Status:</span> <span className={`payment-badge ${selectedTransaction.payment_status}`}>{selectedTransaction.payment_status}</span></div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {refundConfirmId && (
            <motion.div 
                className="modal-overlay-logic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRefundConfirmId(null)}
            >
                <motion.div 
                    className="confirmation-modal"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="confirmation-modal-icon">
                        <RefreshCcw size={32} color="#eb5757" />
                    </div>
                    <h3>Confirm Full Refund</h3>
                    <p>Are you sure you want to refund this transaction? This will return the money to the original payment method and mark the ledger state as <strong>Refunded</strong>.</p>
                    <div className="confirmation-modal-actions">
                        <button className="modal-btn-cancel" onClick={() => setRefundConfirmId(null)}>Cancel</button>
                        <button className="modal-btn-confirm" onClick={() => handleRefund(refundConfirmId)}>Confirm Refund</button>
                    </div>
                </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminTransactions;
