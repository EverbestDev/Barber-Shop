import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { fetchMyBookings } from '../../api/bookings';
import type { Booking } from '../../api/types';
import './Dashboard.css';

const UserTransactions: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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
    
    // Polling every 5 seconds to ensure real-time updates from Admin actions
    const intervalId = setInterval(getBookings, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const transactions = bookings.filter(b => b.amount !== undefined);

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
              <div className="transaction-list">
                {transactions.map(booking => (
                  <div key={booking.id} className="transaction-item">
                    <div className="tx-icon">
                      <CheckCircle2 size={18} className={booking.payment_status === 'paid' ? 'text-gold' : 'text-muted'} />
                    </div>
                    <div className="tx-info">
                      <div className="tx-service">{booking.service}</div>
                      <div className="tx-date">{new Date(booking.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
                    </div>
                    <div className="tx-amount-status text-right">
                      <div className="tx-amount">£{booking.amount?.toFixed(2) || '30.00'}</div>
                      <div className={`tx-status ${booking.payment_status}`}>{booking.payment_status.toUpperCase()}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-ritual small">
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
