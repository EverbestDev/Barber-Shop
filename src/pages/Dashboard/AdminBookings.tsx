import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scissors, 
  Search, 
  Filter, 
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  SortAsc,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { fetchAllBookings, updateBookingStatus, fetchBookingByCode, checkInBooking } from '../../api/bookings';
import { getSafeId } from '../../utils/ids';
import type { Booking } from '../../api/types';
import { downloadCSV } from '../../utils/export';
import toast from 'react-hot-toast';

const AdminBookingsSkeleton = () => (
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

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Check-In State variables
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [checkInCode, setCheckInCode] = useState('');
  const [scannedBooking, setScannedBooking] = useState<Booking | null>(null);
  const [checkInError, setCheckInError] = useState('');
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [verifyingCheckIn, setVerifyingCheckIn] = useState(false);

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
      } catch {
        toast.error("Failed to sync studio data.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const bookingStats = useMemo(() => {
      return {
          confirmed: bookings.filter(b => b.status === 'confirmed').length,
          completed: bookings.filter(b => b.status === 'completed').length,
          cancelled: bookings.filter(b => b.status === 'cancelled').length,
          total: bookings.length
      };
  }, [bookings]);

  const sortedAndFilteredBookings = useMemo(() => {
    let result = [...bookings];

    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter);
    }
    if (searchQuery) {
      result = result.filter(b => 
        b.service.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (b.user_id && b.user_id.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount') return (b.amount || 0) - (a.amount || 0);
      if (sortBy === 'service') return a.service.localeCompare(b.service);
      return 0;
    });

    return result;
  }, [bookings, statusFilter, searchQuery, sortBy]);

  const handleStatusChange = async (bookingId: string, status: string) => {
    const loadToast = toast.loading("Updating session status...");
    try {
      await updateBookingStatus(bookingId, status);
      setBookings(bookings.map(b => (getSafeId(b) === bookingId) ? { ...b, status } : b));
      toast.success("Status updated.", { id: loadToast });
    } catch {
      toast.error("Status update failed.", { id: loadToast });
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInCode.trim()) return;

    setCheckInLoading(true);
    setCheckInError('');
    setScannedBooking(null);

    try {
      const result = await fetchBookingByCode(checkInCode);
      setScannedBooking(result);
    } catch (err: any) {
      setCheckInError(err.response?.data?.detail || "No active booking found with this check-in code.");
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleCompleteCheckIn = async () => {
    if (!scannedBooking) return;
    const bookingId = getSafeId(scannedBooking);
    if (!bookingId) return;

    setVerifyingCheckIn(true);
    const loadToast = toast.loading("Checking in patron...");
    try {
      await checkInBooking(bookingId);
      setBookings(prev => prev.map(b => getSafeId(b) === bookingId ? { ...b, status: 'completed' } : b));
      toast.success("Patron checked in successfully!", { id: loadToast });
      setIsCheckInOpen(false);
      setCheckInCode('');
      setScannedBooking(null);
    } catch {
      toast.error("Check-in failed.", { id: loadToast });
    } finally {
      setVerifyingCheckIn(false);
    }
  };

  if (loading) return <AdminBookingsSkeleton />;

  return (
    <div className="dashboard-content-main">
      <main className="dashboard-main-view">
        <motion.header className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="admin-overview-header">
            <div>
              <h1 className="text-3d">Session <span className="text-gold">Ledgers</span></h1>
              <p>Comprehensive management of all studio appointments.</p>
            </div>
            <div className="header-actions" style={{ display: 'flex', gap: '0.75rem' }}>
               <button className="btn-filled-studio" onClick={() => setIsCheckInOpen(true)} style={{ backgroundColor: 'var(--gold)', color: 'var(--primary)', fontWeight: 700, padding: '0.5rem 1.25rem', borderRadius: '4px', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                 Check-In Patron
               </button>
               <button className="btn-outlined-studio" onClick={() => downloadCSV(sortedAndFilteredBookings, 'bookings_report.csv')}>
                 <Download size={16} /> Export Data
               </button>
            </div>
          </div>

          <div className="header-stats-row">
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: 'var(--gold)' }}><Clock size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Confirmed</span>
                <div className="stat-value">{bookingStats.confirmed}</div>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: '#4caf50' }}><CheckCircle2 size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Completed</span>
                <div className="stat-value">{bookingStats.completed}</div>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: '#f44336' }}><XCircle size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Cancelled</span>
                <div className="stat-value">{bookingStats.cancelled}</div>
              </div>
            </div>
          </div>
        </motion.header>

        <section className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-card premium-card-bg">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <h2><Scissors size={20} /> Studio Sessions</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="search-bar-standard">
                  <Search size={16} color="var(--text-secondary)" />
                  <input 
                    type="text" 
                    placeholder="Filter session..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="filter-wrapper">
                    <Filter size={16} color="var(--text-secondary)" />
                    <select className="status-selector" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="all">ALL STATUS</option>
                      <option value="confirmed">CONFIRMED</option>
                      <option value="completed">COMPLETED</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                </div>
                <div className="filter-wrapper">
                    <SortAsc size={16} color="var(--text-secondary)" />
                    <select className="status-selector" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="recent">RECENT</option>
                      <option value="oldest">OLDEST</option>
                      <option value="amount">AMOUNT</option>
                      <option value="service">SERVICE</option>
                    </select>
                </div>
              </div>
            </div>
            
            <div className="table-responsive-wrapper">
              <div className="table-responsive">
                <table className="admin-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Schedule</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Booked On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredBookings.map((b, idx) => {
                    const bId = getSafeId(b);
                    return (
                      <tr key={`${bId}-${idx}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedBooking(b)}>
                        <td style={{ fontWeight: 800 }}>{b.service}</td>
                        <td>{new Date(b.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                        <td style={{ fontWeight: 'bold' }}>£{(b.amount || 0).toFixed(2)}</td>
                        <td><span className={`status-badge ${b.status}`}>{b.status}</span></td>
                        <td>{b.created_at ? new Date(b.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <div style={{ position: 'relative' }}>
                            <button 
                              className="d-icon-btn" 
                              style={{ width: '32px', height: '32px' }}
                              onClick={(e) => { e.stopPropagation(); setOpenActionId(openActionId === bId ? null : (bId || null)); }}
                            >
                              <MoreVertical size={16} />
                            </button>
                            {openActionId === bId && bId && (
                              <div className="d-profile-dropdown" style={{ right: '0', top: '100%', minWidth: '150px' }} onClick={(e) => e.stopPropagation()}>
                                  <button onClick={() => { setSelectedBooking(b); setOpenActionId(null); }}>View Details</button>
                                  <div className="divider" style={{ margin: '4px 0' }}></div>
                                  <select 
                                    value={b.status} 
                                    onChange={(e) => { handleStatusChange(bId, e.target.value); setOpenActionId(null); }} 
                                    className="status-selector"
                                    style={{ padding: '0.75rem 1rem', width: '100%' }}
                                  >
                                    <option value="confirmed">Confirm</option>
                                    <option value="completed">Complete</option>
                                    <option value="cancelled">Cancel</option>
                                  </select>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {sortedAndFilteredBookings.length === 0 && (
                <div className="empty-state-standard" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <div className="empty-icon-chamber">
                    <Scissors size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                  </div>
                  <h3 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>No Sessions Found</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>The session ledger is currently empty for the selected criteria.</p>
                </div>
              )}
              </div>
              <div className="scroll-hint-icon mobile-only"><ChevronRight size={10} /> Scroll</div>
            </div>
          </motion.div>
        </section>

        <AnimatePresence>
          {selectedBooking && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
            >
              <motion.div 
                className="modal-content premium-card-bg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                   <h2>Session Details</h2>
                   <button className="close-btn" onClick={() => setSelectedBooking(null)}>&times;</button>
                </div>
                <div className="modal-body">
                   <div className="detail-row"><span>Service:</span> <strong>{selectedBooking.service}</strong></div>
                   <div className="detail-row"><span>Patron:</span> <strong>{selectedBooking.guest_name || 'Anonymous Guest'} (ID: {selectedBooking.user_id || 'N/A'})</strong></div>
                   {selectedBooking.home_address && (
                     <div className="detail-row"><span>Home Address:</span> <strong style={{ color: 'var(--gold)' }}>{selectedBooking.home_address}</strong></div>
                   )}
                   <div className="detail-row"><span>Date:</span> <strong>{new Date(selectedBooking.date).toLocaleDateString()}</strong></div>
                   <div className="detail-row"><span>Time:</span> <strong>{new Date(selectedBooking.date).toLocaleTimeString()}</strong></div>
                   <div className="detail-row"><span>Booked On:</span> <strong>{selectedBooking.created_at ? new Date(selectedBooking.created_at).toLocaleString() : 'N/A'}</strong></div>
                   <div className="detail-row"><span>Investment:</span> <strong className="text-gold">£{(selectedBooking.amount || 0).toFixed(2)}</strong></div>
                   <div className="detail-row"><span>Session Status:</span> <span className={`status-badge ${selectedBooking.status}`}>{selectedBooking.status}</span></div>
                   <div className="detail-row"><span>Payment Status:</span> <span className={`payment-badge ${selectedBooking.payment_status}`}>{selectedBooking.payment_status}</span></div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCheckInOpen && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsCheckInOpen(false); setScannedBooking(null); setCheckInError(''); setCheckInCode(''); }}
            >
              <motion.div 
                className="modal-content premium-card-bg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '500px', width: '100%' }}
              >
                <div className="modal-header">
                   <h2>Patron Check-In</h2>
                   <button className="close-btn" onClick={() => { setIsCheckInOpen(false); setScannedBooking(null); setCheckInError(''); setCheckInCode(''); }}>&times;</button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                   <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                     Scan the patron's QR code or type their unique 8-character code below to verify their booking and mark the session as completed.
                   </p>
                   
                   <form onSubmit={handleVerifyCode} style={{ display: 'flex', gap: '0.5rem' }}>
                     <input 
                       type="text" 
                       placeholder="e.g. B2-A3F45E or Booking ID"
                       value={checkInCode}
                       onChange={(e) => setCheckInCode(e.target.value)}
                       className="luxury-input"
                       style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', padding: '0.75rem' }}
                       disabled={checkInLoading}
                       autoFocus
                     />
                     <button 
                       type="submit"
                       className="btn-filled"
                       style={{ padding: '0 1.5rem', height: 'auto', border: 'none', borderRadius: '4px', backgroundColor: 'var(--gold)', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                       disabled={checkInLoading}
                     >
                       {checkInLoading ? 'Verifying...' : 'Verify'}
                     </button>
                   </form>

                   {checkInError && (
                     <div style={{ padding: '0.75rem', backgroundColor: 'rgba(244, 67, 54, 0.1)', border: '1px solid rgba(244, 67, 54, 0.2)', color: '#f44336', borderRadius: '4px', fontSize: '0.85rem' }}>
                       {checkInError}
                     </div>
                   )}

                   {scannedBooking && (
                     <div style={{ padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                       <h3 style={{ color: 'var(--gold)', fontSize: '1.05rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Booking Details</h3>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                         <span style={{ color: 'var(--text-secondary)' }}>Service:</span>
                         <span style={{ fontWeight: 'bold' }}>{scannedBooking.service}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                         <span style={{ color: 'var(--text-secondary)' }}>Schedule:</span>
                         <span style={{ fontWeight: 'bold' }}>{new Date(scannedBooking.date).toLocaleString()}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                         <span style={{ color: 'var(--text-secondary)' }}>Patron Name:</span>
                         <span style={{ fontWeight: 'bold' }}>{scannedBooking.guest_name || 'Registered Patron'}</span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                         <span style={{ color: 'var(--text-secondary)' }}>Promo Booking:</span>
                         <span style={{ fontWeight: 'bold', color: scannedBooking.is_free_promo ? 'var(--gold)' : 'var(--text-secondary)' }}>
                           {scannedBooking.is_free_promo ? 'Yes (Free Tuesday)' : 'No (Standard Paid)'}
                         </span>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                         <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                         <span className={`status-badge ${scannedBooking.status}`} style={{ margin: 0 }}>{scannedBooking.status}</span>
                       </div>

                       {scannedBooking.status !== 'completed' && scannedBooking.status !== 'cancelled' ? (
                         <button 
                           onClick={handleCompleteCheckIn}
                           className="btn-filled"
                           style={{ marginTop: '0.75rem', width: '100%', padding: '0.8rem', border: 'none', borderRadius: '4px', backgroundColor: 'var(--gold)', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                           disabled={verifyingCheckIn}
                         >
                           {verifyingCheckIn ? 'Checking In...' : 'Verify & Complete Ritual'}
                         </button>
                       ) : (
                         <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.85rem', color: scannedBooking.status === 'completed' ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                           {scannedBooking.status === 'completed' ? 'This appointment has already been completed.' : 'This appointment was cancelled.'}
                         </div>
                       )}
                     </div>
                   )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminBookings;
