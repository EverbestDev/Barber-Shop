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
  Scissors,
  PieChart
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
  const [chartFilter, setChartFilter] = useState<'service' | 'status' | 'payment'>('service');

  const CHART_COLORS = ['#D4AF37', '#F1D87A', '#8C8C8C', '#E63946', '#2A9D8F', '#457B9D', '#1D3557', '#F4A261'];

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach(b => {
      let key = '';
      if (chartFilter === 'service') {
        key = b.service;
      } else if (chartFilter === 'status') {
        key = b.status;
      } else {
        key = b.payment_status;
      }
      counts[key] = (counts[key] || 0) + 1;
    });

    const total = Object.values(counts).reduce((sum, val) => sum + val, 0);
    if (total === 0) return [];

    return Object.entries(counts).map(([label, value], index) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value,
      percentage: (value / total) * 100,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }));
  }, [bookings, chartFilter]);

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

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="dashboard-card premium-card-bg lg:col-span-2"
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

          <div className="flex flex-col gap-6 lg:col-span-1">
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

            <div className="dashboard-card premium-card-bg">
              <div className="card-header flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <h2 className="flex items-center gap-2 text-white font-bold">
                  <PieChart size={20} className="text-gold" /> Grooming Distribution
                </h2>
                <select 
                  value={chartFilter}
                  onChange={(e) => setChartFilter(e.target.value as any)}
                  className="bg-black border border-white/10 rounded px-2 py-1 text-xs text-white cursor-pointer focus:outline-none focus:border-gold"
                >
                  <option value="service">Service Type</option>
                  <option value="status">Grooming Status</option>
                  <option value="payment">Payment Settlement</option>
                </select>
              </div>
              
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-center gap-6 mt-4">
                {chartData.length > 0 ? (
                  <>
                    <div className="relative w-36 h-36 shrink-0">
                      <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90">
                        {(() => {
                          let cumulativePercent = 0;
                          return chartData.map((slice, index) => {
                            const percent = slice.value / bookings.length;
                            const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                            cumulativePercent += percent;
                            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                            const largeArcFlag = percent > 0.5 ? 1 : 0;
                            
                            if (percent === 1) {
                              return (
                                <circle 
                                  key={index} 
                                  cx="0" 
                                  cy="0" 
                                  r="1" 
                                  fill={slice.color} 
                                >
                                  <title>{`${slice.label}: ${slice.value} (${slice.percentage.toFixed(1)}%)`}</title>
                                </circle>
                              );
                            }
                            
                            const pathData = [
                              `M 0 0`,
                              `L ${startX} ${startY}`,
                              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                              `Z`
                            ].join(' ');
                            
                            return (
                              <path 
                                key={index} 
                                d={pathData} 
                                fill={slice.color} 
                                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                              >
                                <title>{`${slice.label}: ${slice.value} (${slice.percentage.toFixed(1)}%)`}</title>
                              </path>
                            );
                          });
                        })()}
                      </svg>
                    </div>
                    
                    <div className="flex-1 w-full flex flex-col gap-2">
                      {chartData.map((slice, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-2.5 h-2.5 rounded-full shrink-0" 
                              style={{ backgroundColor: slice.color }}
                            />
                            <span className="text-gray-300 truncate max-w-[140px]">{slice.label}</span>
                          </div>
                          <span className="font-semibold text-white">
                            {slice.value} ({slice.percentage.toFixed(0)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 text-center py-8 w-full text-sm">
                    No stats available for selected filter.
                  </div>
                )}
              </div>
            </div>
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

