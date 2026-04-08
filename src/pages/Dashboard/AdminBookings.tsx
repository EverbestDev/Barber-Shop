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
  SortAsc
} from 'lucide-react';
import { fetchAllBookings, updateBookingStatus } from '../../api/bookings';
import type { Booking } from '../../api/types';
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

  useEffect(() => {
    const getData = async () => {
      try {
        const b = await fetchAllBookings();
        setBookings(b || []);
      } catch (err) {
        toast.error("Failed to sync session data.");
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

    // Filter
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter);
    }
    if (searchQuery) {
      result = result.filter(b => 
        b.service.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (b.user_id && b.user_id.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
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
      setBookings(bookings.map(b => (b.id === bookingId || (b as any)._id === bookingId) ? { ...b, status } : b));
      toast.success("Status updated.", { id: loadToast });
    } catch (err) {
      toast.error("Status update failed.", { id: loadToast });
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
            <div className="header-actions">
               <button className="btn-outlined-studio" onClick={() => window.print()}>
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
                <div className="search-bar-ritual">
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
            
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Service Craft</th>
                    <th>Schedule</th>
                    <th>Amount</th>
                    <th>Session Status</th>
                    <th>Ops Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredBookings.map((b, idx) => (
                    <tr key={`${b.id || (b as any)._id}-${idx}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedBooking(b)}>
                      <td style={{ fontWeight: 800 }}>{b.service}</td>
                      <td>{new Date(b.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                      <td style={{ fontWeight: 'bold' }}>£{(b.amount || 0).toFixed(2)}</td>
                      <td><span className={`status-badge ${b.status}`}>{b.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <select 
                            value={b.status} 
                            onClick={(e) => e.stopPropagation()} 
                            onChange={(e) => handleStatusChange(b.id || (b as any)._id, e.target.value)} 
                            className="status-selector"
                          >
                            <option value="confirmed">Confirm</option>
                            <option value="completed">Complete</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {sortedAndFilteredBookings.length === 0 && (
                <div className="empty-state-ritual" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <div className="empty-icon-chamber">
                    <Scissors size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                  </div>
                  <h3 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>No Sessions Found</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>The session ledger is currently empty for the selected criteria.</p>
                </div>
              )}
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
                   <div className="detail-row"><span>Patron ID:</span> <strong>{selectedBooking.user_id || 'Anonymous Guest'}</strong></div>
                   <div className="detail-row"><span>Date:</span> <strong>{new Date(selectedBooking.date).toLocaleDateString()}</strong></div>
                   <div className="detail-row"><span>Time:</span> <strong>{new Date(selectedBooking.date).toLocaleTimeString()}</strong></div>
                   <div className="detail-row"><span>Investment:</span> <strong className="text-gold">£{(selectedBooking.amount || 0).toFixed(2)}</strong></div>
                   <div className="detail-row"><span>Session Status:</span> <span className={`status-badge ${selectedBooking.status}`}>{selectedBooking.status}</span></div>
                   <div className="detail-row"><span>Payment Status:</span> <span className={`payment-badge ${selectedBooking.payment_status}`}>{selectedBooking.payment_status}</span></div>
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
