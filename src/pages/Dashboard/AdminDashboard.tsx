import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  TrendingUp,
  UserCheck,
  Clock,
  Download,
  Users,
  CreditCard,
  ChevronRight,
  Zap,
  Scissors
} from 'lucide-react';
import { fetchAllUsers } from '../../api/admin';
import { fetchAllBookings } from '../../api/bookings';
import { getSafeId } from '../../utils/ids';
import type { UserInfo, Booking } from '../../api/types';
import { downloadCSV } from '../../utils/export';
import toast from 'react-hot-toast';
import DetailModal from '../../components/common/DetailModal/DetailModal';

const AdminOverviewSkeleton = () => (
  <div className="dashboard-content-main">
    <div className="dashboard-main-view">
      <div className="dashboard-header">
        <div className="skeleton skeleton-title" />
        <div className="header-stats-row">
          {[1, 2, 3, 4].map(i => <div key={i} className="mini-stat-card skeleton skeleton-card" />)}
        </div>
      </div>
      <div className="dashboard-card premium-card-bg">
        <div className="skeleton skeleton-table-row" style={{ height: '300px' }} />
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const [u, b] = await Promise.all([fetchAllUsers(), fetchAllBookings()]);
        setUsers(u);
        setBookings(b || []);
      } catch {
        toast.error("Failed to sync studio data.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const totalRev = bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.amount || 0), 0);
    const topService = bookings.reduce((acc, b) => {
        acc[b.service] = (acc[b.service] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const mostPopular = Object.entries(topService).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      totalRevenue: totalRev,
      bookingsToday: bookings.filter(b => b.date.startsWith(today)).length,
      activeUsers: users.length,
      pendingPayments: bookings.filter(b => b.payment_status === 'pending').length,
      mostPopular
    };
  }, [bookings, users]);

  const handleGenerateReport = () => {
    if (!bookings.length) {
      toast.error("No data available to generate report.");
      return;
    }

    const reportData = bookings.map(b => ({
      'Transaction Date': new Date(b.date).toLocaleDateString(),
      'Session Time': new Date(b.date).toLocaleTimeString(),
      'Service Rendered': b.service,
      'Patron Reference': b.user_id || 'Guest',
      'Revenue (£)': b.amount || 30,
      'Operational Status': b.status,
      'Settlement': b.payment_status,
      'Assigned Barber': b.barber
    }));

    toast.success("Full Executive Report generated successfully.");
    downloadCSV(reportData, `Studio_Full_Report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const todayBookings = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return bookings
      .filter(b => b.date.startsWith(today))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
            <div className="mini-stat-card clickable" onClick={() => navigate('/dashboard/transactions-library')}>
              <div className="stat-icon-chamber"><TrendingUp size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Total Revenue</span>
                <div className="stat-value text-gold">£{stats.totalRevenue.toFixed(2)}</div>
              </div>
              <ChevronRight size={14} className="stat-arrow" />
            </div>
            <div className="mini-stat-card clickable" onClick={() => navigate('/dashboard/bookings')}>
              <div className="stat-icon-chamber"><Calendar size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Sessions Today</span>
                <div className="stat-value">{stats.bookingsToday}</div>
              </div>
              <ChevronRight size={14} className="stat-arrow" />
            </div>
            <div className="mini-stat-card clickable" onClick={() => navigate('/dashboard/users')}>
              <div className="stat-icon-chamber"><UserCheck size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Active Patrons</span>
                <div className="stat-value">{stats.activeUsers}</div>
              </div>
              <ChevronRight size={14} className="stat-arrow" />
            </div>
            <div className="mini-stat-card clickable" onClick={() => navigate('/dashboard/transactions-library')}>
              <div className="stat-icon-chamber"><Clock size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Pending Payments</span>
                <div className="stat-value text-gold">{stats.pendingPayments}</div>
              </div>
              <ChevronRight size={14} className="stat-arrow" />
            </div>
          </div>
        </motion.header>

        <section className="dashboard-grid">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="dashboard-card premium-card-bg"
            style={{ gridColumn: 'span 2' }}
          >
            <div className="card-header">
              <h2><Calendar size={20} /> Today's Live Agenda</h2>
              <button className="text-gold text-xs font-bold" onClick={() => navigate('/dashboard/bookings')}>VIEW ALL</button>
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
                    <tr key={getSafeId(b)} className="clickable-row" onClick={() => setSelectedBooking(b)}>
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

          <div className="dashboard-card premium-card-bg mini-insights">
             <div className="card-header">
                <h2><Zap size={20} /> Quick Insights</h2>
             </div>
             <div className="insights-list">
                <div className="insight-item">
                    <div className="insight-icon"><Scissors size={18} /></div>
                    <div className="insight-data">
                        <span className="insight-label">Top Service</span>
                        <span className="insight-val">{stats.mostPopular}</span>
                    </div>
                </div>
                <div className="insight-item">
                    <div className="insight-icon"><Users size={18} /></div>
                    <div className="insight-data">
                        <span className="insight-label">Growth</span>
                        <span className="insight-val">+12% this month</span>
                    </div>
                </div>
                <div className="insight-item">
                    <div className="insight-icon"><CreditCard size={18} /></div>
                    <div className="insight-data">
                        <span className="insight-label">Avg. Ticket</span>
                        <span className="insight-val">£34.50</span>
                    </div>
                </div>
             </div>
             <button className="btn-filled-gold w-full mt-6" onClick={handleGenerateReport}>Generate Full Report</button>
          </div>
        </section>
      </main>

      <DetailModal 
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Appointment Detail"
        data={selectedBooking}
        type="booking"
      />
    </div>
  );
};

export default AdminDashboard;

