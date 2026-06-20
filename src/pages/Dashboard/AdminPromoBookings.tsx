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
  ChevronRight,
  BellRing,
  Tag
} from 'lucide-react';
import { fetchAllBookings, updateBookingStatus, fetchBookingByCode, checkInBooking, nudgeBooking } from '../../api/bookings';
import { getSafeId } from '../../utils/ids';
import type { Booking } from '../../api/types';
import { downloadCSV } from '../../utils/export';
import toast from 'react-hot-toast';
import { Html5Qrcode } from 'html5-qrcode';


const AdminPromoBookingsSkeleton = () => (
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

const AdminPromoBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Check-In State variables
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [checkInMode, setCheckInMode] = useState<'input' | 'scan'>('input');
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

  const getData = async () => {
    try {
      const b = await fetchAllBookings();
      // Filter only free Tuesday promo bookings
      const promoBookings = (b || []).filter(item => item.is_free_promo);
      setBookings(promoBookings);
    } catch {
      toast.error("Failed to sync promo database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!isCheckInOpen || checkInMode !== 'scan') return;

    let html5QrCode: Html5Qrcode | null = null;
    const containerId = "promo-qr-reader";

    const timer = setTimeout(() => {
      try {
        html5QrCode = new Html5Qrcode(containerId);
        html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          async (decodedText) => {
            if (html5QrCode && html5QrCode.isScanning) {
              await html5QrCode.stop();
            }
            setCheckInCode(decodedText);
            setCheckInMode('input');
            verifyCode(decodedText);
          },
          () => {
            // Silent error handler for scanning frames
          }
        ).catch((err) => {
          console.error("Error starting camera qr scanner", err);
          setCheckInError("Could not access camera. Please make sure you are on HTTPS and have granted camera permissions.");
        });
      } catch (err) {
        console.error("Error initializing qr scanner", err);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Error stopping qr code scanner on unmount", err));
      }
    };
  }, [isCheckInOpen, checkInMode]);

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
        (b.guest_name && b.guest_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.check_in_code && b.check_in_code.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'service') return a.service.localeCompare(b.service);
      return 0;
    });

    return result;
  }, [bookings, statusFilter, searchQuery, sortBy]);

  const handleStatusChange = async (bookingId: string, status: string) => {
    const loadToast = toast.loading("Updating status...");
    try {
      await updateBookingStatus(bookingId, status);
      setBookings(bookings.map(b => (getSafeId(b) === bookingId) ? { ...b, status } : b));
      if (selectedBooking && getSafeId(selectedBooking) === bookingId) {
        setSelectedBooking({ ...selectedBooking, status });
      }
      toast.success("Status updated.", { id: loadToast });
    } catch {
      toast.error("Status update failed.", { id: loadToast });
    }
  };

  const handleNudge = async (bookingId: string) => {
    const loadToast = toast.loading("Dispatching nudge reminder...");
    try {
      await nudgeBooking(bookingId);
      toast.success("Nudge email sent successfully!", { id: loadToast });
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Nudge failed.", { id: loadToast });
    }
  };

  const verifyCode = async (code: string) => {
    if (!code.trim()) return;

    setCheckInLoading(true);
    setCheckInError('');
    setScannedBooking(null);

    try {
      const result = await fetchBookingByCode(code);
      if (!result.is_free_promo) {
        setCheckInError("This code belongs to a standard booking, not a Tuesday Promo booking.");
        return;
      }
      setScannedBooking(result);
    } catch (err: any) {
      setCheckInError(err.response?.data?.detail || "No active promo booking found with this code.");
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyCode(checkInCode);
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

  if (loading) return <AdminPromoBookingsSkeleton />;

  return (
    <div className="dashboard-content-main">
      <main className="dashboard-main-view">
        <motion.header className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="admin-overview-header">
            <div>
              <h1 className="text-3d">Tuesday Promo <span className="text-gold">Bookings</span></h1>
              <p>Management and check-in portal for Tuesday Free Grooming slots.</p>
            </div>
            <div className="header-actions" style={{ display: 'flex', gap: '0.75rem' }}>
               <button className="btn-filled-studio" onClick={() => setIsCheckInOpen(true)} style={{ backgroundColor: 'var(--gold)', color: 'var(--primary)', fontWeight: 700, padding: '0.5rem 1.25rem', borderRadius: '4px', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                 Scan Promo Code
               </button>
               <button className="btn-outlined-studio" onClick={() => downloadCSV(sortedAndFilteredBookings, 'tuesday_promo_bookings.csv')}>
                 <Download size={16} /> Export Data
               </button>
            </div>
          </div>

          <div className="header-stats-row">
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: 'var(--gold)' }}><Clock size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Confirmed Slots</span>
                <div className="stat-value">{bookingStats.confirmed}</div>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: '#4caf50' }}><CheckCircle2 size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Completed slots</span>
                <div className="stat-value">{bookingStats.completed}</div>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: '#f44336' }}><XCircle size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Cancelled Slots</span>
                <div className="stat-value">{bookingStats.cancelled}</div>
              </div>
            </div>
          </div>
        </motion.header>

        <section className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-card premium-card-bg">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <h2><Tag size={20} /> Promo Bookings Ledger</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="search-bar-standard">
                  <Search size={16} color="var(--text-secondary)" />
                  <input 
                    type="text" 
                    placeholder="Search by patron/code..." 
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
                      <th>Patron</th>
                      <th>Service</th>
                      <th>Schedule</th>
                      <th>Check-In Code</th>
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
                          <td style={{ fontWeight: 800, color: 'var(--gold)' }}>{b.guest_name || 'Registered Patron'}</td>
                          <td>{b.service}</td>
                          <td>{new Date(b.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                          <td style={{ fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '0.5px' }}>{b.check_in_code || 'N/A'}</td>
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
                                <div className="d-profile-dropdown" style={{ right: '0', top: '100%', minWidth: '160px' }} onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => { setSelectedBooking(b); setOpenActionId(null); }}>View Details</button>
                                    <button onClick={() => { handleNudge(bId); setOpenActionId(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold)' }}>
                                      <BellRing size={14} /> Nudge Patron
                                    </button>
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
                    <h3 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>No Promo Bookings Found</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No free Tuesday promo bookings found for the selected criteria.</p>
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
                   <h2>Promo Booking Details</h2>
                   <button className="close-btn" onClick={() => setSelectedBooking(null)}>&times;</button>
                </div>
                <div className="modal-body">
                   <div className="detail-row"><span>Service:</span> <strong>{selectedBooking.service}</strong></div>
                   <div className="detail-row"><span>Patron:</span> <strong>{selectedBooking.guest_name || 'Registered Patron'}</strong></div>
                   <div className="detail-row"><span>Date:</span> <strong>{new Date(selectedBooking.date).toLocaleDateString()}</strong></div>
                   <div className="detail-row"><span>Time:</span> <strong>{new Date(selectedBooking.date).toLocaleTimeString()}</strong></div>
                   <div className="detail-row"><span>Check-In Code:</span> <strong className="text-gold" style={{ fontFamily: 'monospace' }}>{selectedBooking.check_in_code || 'N/A'}</strong></div>
                   <div className="detail-row"><span>Booked On:</span> <strong>{selectedBooking.created_at ? new Date(selectedBooking.created_at).toLocaleString() : 'N/A'}</strong></div>
                   <div className="detail-row"><span>Promotion:</span> <span className="status-badge confirmed">Free Tuesday Promo</span></div>
                   <div className="detail-row"><span>Session Status:</span> <span className={`status-badge ${selectedBooking.status}`}>{selectedBooking.status}</span></div>
                   
                   <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                     {selectedBooking.status === 'confirmed' && (
                       <button 
                         className="btn-filled-gold" 
                         onClick={() => { const id = getSafeId(selectedBooking); id && handleNudge(id); }}
                         style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                       >
                         <BellRing size={16} /> Nudge Patron
                       </button>
                     )}
                     <button 
                       className="btn-outlined-studio" 
                       onClick={() => setSelectedBooking(null)}
                       style={{ flex: 1 }}
                     >
                       Close Details
                     </button>
                   </div>
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
              onClick={() => { setIsCheckInOpen(false); setScannedBooking(null); setCheckInError(''); setCheckInCode(''); setCheckInMode('input'); }}
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
                   <h2>Patron Promo Check-In</h2>
                   <button className="close-btn" onClick={() => { setIsCheckInOpen(false); setScannedBooking(null); setCheckInError(''); setCheckInCode(''); setCheckInMode('input'); }}>&times;</button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                   <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                     Scan the Tuesday Promo QR code or type their unique 8-character check-in code below to verify their booking.
                   </p>

                   <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                     <button 
                       onClick={() => { setCheckInMode('input'); setCheckInError(''); }}
                       style={{ 
                         flex: 1, 
                         padding: '0.5rem', 
                         borderRadius: '4px', 
                         border: 'none', 
                         cursor: 'pointer',
                         backgroundColor: checkInMode === 'input' ? 'var(--gold)' : 'rgba(255,255,255,0.02)',
                         color: checkInMode === 'input' ? 'var(--primary)' : 'var(--text-secondary)',
                         fontWeight: 700
                       }}
                     >
                       Input Code
                     </button>
                     <button 
                       onClick={() => { setCheckInMode('scan'); setCheckInError(''); }}
                       style={{ 
                         flex: 1, 
                         padding: '0.5rem', 
                         borderRadius: '4px', 
                         border: 'none', 
                         cursor: 'pointer',
                         backgroundColor: checkInMode === 'scan' ? 'var(--gold)' : 'rgba(255,255,255,0.02)',
                         color: checkInMode === 'scan' ? 'var(--primary)' : 'var(--text-secondary)',
                         fontWeight: 700
                       }}
                     >
                       Scan QR Code
                     </button>
                   </div>

                   {checkInMode === 'input' ? (
                     <form onSubmit={handleVerifyCode} style={{ display: 'flex', gap: '0.5rem' }}>
                       <input 
                         type="text" 
                         placeholder="e.g. B2-A3F45E"
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
                   ) : (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                       <div id="promo-qr-reader" style={{ width: '100%', minHeight: '250px' }}></div>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                         Position the QR code inside the camera view to scan.
                       </p>
                     </div>
                   )}

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

export default AdminPromoBookings;
