import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Search, 
  Download,
  TrendingUp
} from 'lucide-react';
import { fetchAllBookings } from '../../api/bookings';
import type { Booking } from '../../api/types';
import toast from 'react-hot-toast';

const AdminTransactions: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
        .filter(b => b.payment_status !== 'unpaid')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [bookings]);

  const filteredTransactions = transactions.filter(t => 
    (t.user_id && t.user_id.toLowerCase().includes(searchQuery.toLowerCase())) || 
    t.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = useMemo(() => {
    return transactions.filter(t => t.payment_status === 'paid').reduce((sum, t) => sum + (t.amount || 0), 0);
  }, [transactions]);

  if (loading) return <div className="loading-ritual"><p>Syncing Ledger...</p></div>;

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
        </motion.header>

        <section className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-card premium-card-bg">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <h2><CreditCard size={20} /> Financial Transactions</h2>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div className="search-bar-ritual">
                  <Search size={16} color="var(--text-secondary)" />
                  <input 
                    type="text" 
                    placeholder="Search ledger..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="header-actions desktop-only">
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}><TrendingUp size={12} /> Total Processed: </span>
                    <span className="text-gold" style={{ fontWeight: 800 }}>£{totalRevenue.toFixed(2)}</span>
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
                  {filteredTransactions.map(t => (
                    <tr key={t.id}>
                      <td className="truncate" title={t.user_id || 'Guest'}>{t.user_id || 'Guest'}</td>
                      <td style={{ fontWeight: 700 }}>{t.service}</td>
                      <td style={{ fontWeight: 800, color: 'var(--gold)' }}>£{(t.amount || 0).toFixed(2)}</td>
                      <td><span className={`payment-badge ${t.payment_status}`}>{t.payment_status}</span></td>
                      <td>{new Date(t.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>No transaction records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default AdminTransactions;
