import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Search, 
  Download,
  CheckCircle2,
  Clock,
  RefreshCcw,
  SortAsc
} from 'lucide-react';
import { fetchAllBookings } from '../../api/bookings';
import type { Booking } from '../../api/types';
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
    let result = transactions.filter(t => 
      (t.user_id && t.user_id.toLowerCase().includes(searchQuery.toLowerCase())) || 
      t.service.toLowerCase().includes(searchQuery.toLowerCase())
    );

    result.sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount') return (b.amount || 0) - (a.amount || 0);
      if (sortBy === 'patron') return (a.user_id || '').localeCompare(b.user_id || '');
      return 0;
    });

    return result;
  }, [transactions, searchQuery, sortBy]);

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
               <button className="btn-outlined-studio" onClick={() => window.print()}>
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
                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{transactionStats.successCount} rituals</span>
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
                <div className="search-bar-ritual">
                  <Search size={16} color="var(--text-secondary)" />
                  <input 
                    type="text" 
                    placeholder="Search ledger..." 
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
                      <option value="patron">PATRON</option>
                    </select>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Transaction Patron</th>
                    <th>Craft Service</th>
                    <th>Flow Amount</th>
                    <th>Payment Integrity</th>
                    <th>Log Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredTransactions.map((t, idx) => (
                    <tr key={`${t.id || (t as any)._id}-${idx}`}>
                      <td className="truncate" title={t.user_id || 'Guest'}>{t.user_id || 'Guest'}</td>
                      <td style={{ fontWeight: 700 }}>{t.service}</td>
                      <td style={{ fontWeight: 800, color: 'var(--gold)' }}>£{(t.amount || 0).toFixed(2)}</td>
                      <td><span className={`payment-badge ${t.payment_status}`}>{t.payment_status}</span></td>
                      <td>{new Date(t.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {sortedAndFilteredTransactions.length === 0 && (
                <div className="empty-state-ritual" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
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
      </main>
    </div>
  );
};

export default AdminTransactions;
