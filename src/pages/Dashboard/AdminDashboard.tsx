import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  TrendingUp, 
  UserCheck, 
  Clock, 
  Download
} from 'lucide-react';
import { fetchAllUsers } from '../../api/admin';
import { fetchAllBookings } from '../../api/bookings';
import type { UserInfo, Booking } from '../../api/types';
import { downloadCSV } from '../../utils/export';
import toast from 'react-hot-toast';

const AdminOverviewSkeleton = () => (
  <div className="dashboard-content-main">
    <div className="dashboard-main-view">
      <div className="dashboard-header">
        <div className="skeleton skeleton-title" />
        <div className="header-stats-row">
          {[1,2,3,4].map(i => <div key={i} className="mini-stat-card skeleton skeleton-card" />)}
        </div>
      </div>
      <div className="dashboard-card premium-card-bg">
        <div className="skeleton skeleton-table-row" style={{ height: '300px' }} />
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const [u, b] = await Promise.all([fetchAllUsers(), fetchAllBookings()]);
        setUsers(u);
        setBookings(b || []);
      } catch (err) {
        toast.error("Failed to sync studio data.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      totalRevenue: bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.amount || 0), 0),
      bookingsToday: bookings.filter(b => b.date.startsWith(today)).length,
      activeUsers: users.length,
      pendingPayments: bookings.filter(b => b.payment_status === 'pending').length
    };
  }, [bookings, users]);

  const todayBookings = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(b => b.date.startsWith(today));
  }, [bookings]);

  if (loading) return <AdminOverviewSkeleton />;

  return (
    <div className="dashboard-content-main">
      <main className="dashboard-main-view">
        <motion.header className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="admin-overview-header">
            <div>
              <h1 className="text-3d">Executive <span className="text-gold">Intelligence</span></h1>
              <p>Real-time holistic view of your studio's pulse.</p>
            </div>
            <div className="header-actions">
               <button className="btn-outlined-studio" onClick={() => downloadCSV(todayBookings, 'todays_agenda.csv')}>
                 <Download size={16} /> Export Overview
               </button>
            </div>
          </div>

          <div className="header-stats-row">
            <div className="mini-stat-card">
              <div className="stat-icon-chamber"><TrendingUp size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Total Revenue</span>
                <div className="stat-value text-gold">£{stats.totalRevenue.toFixed(2)}</div>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber"><Calendar size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Sessions Today</span>
                <div className="stat-value">{stats.bookingsToday}</div>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber"><UserCheck size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Active Patrons</span>
                <div className="stat-value">{stats.activeUsers}</div>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber"><Clock size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Pending Payments</span>
                <div className="stat-value text-gold">{stats.pendingPayments}</div>
              </div>
            </div>
          </div>
        </motion.header>

        <section className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-card premium-card-bg">
            <div className="card-header">
              <h2><TrendingUp size={20} /> Today's Live Agenda</h2>
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                 <thead>
                   <tr>
                     <th>Time</th>
                     <th>Service</th>
                     <th>Patron</th>
                     <th>Payment</th>
                     <th>Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {todayBookings.map(b => (
                     <tr key={b.id}>
                       <td>{new Date(b.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                       <td style={{ fontWeight: 800 }}>{b.service}</td>
                       <td className="truncate">{b.user_id || 'Guest'}</td>
                       <td><span className={`payment-badge ${b.payment_status}`}>{b.payment_status}</span></td>
                       <td><span className={`status-badge ${b.status}`}>{b.status}</span></td>
                     </tr>
                   ))}
                   {todayBookings.length === 0 && (
                     <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>No sessions scheduled for today yet.</td></tr>
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

export default AdminDashboard;
