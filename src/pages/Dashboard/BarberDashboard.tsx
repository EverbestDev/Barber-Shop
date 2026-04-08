import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  User,
  Scissors,
  Star,
  Award,
  CircleDashed,
  Download,
  Search,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchBarberBookings, updateBookingStatus } from '../../api/bookings';
import type { Booking } from '../../api/types';
import toast from 'react-hot-toast';

const BarberDashboardSkeleton = () => (
    <div className="dashboard-content-main">
      <div className="dashboard-main-view">
        <div className="dashboard-header">
          <div className="skeleton skeleton-title" />
          <div className="header-stats-row">
            {[1,2,3,4].map(i => <div key={i} className="mini-stat-card skeleton skeleton-card" />)}
          </div>
        </div>
        <div className="dashboard-grid">
           <div className="dashboard-card skeleton" style={{ height: '400px' }} />
        </div>
      </div>
    </div>
);

const BarberDashboard: React.FC = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        if (user?.id || (user as any)?._id) {
          const id = user.id || (user as any)._id;
          const data = await fetchBarberBookings(id);
          setSchedule(data || []);
        }
      } catch (err) {
        toast.error("Failed to sync your chair's ledger.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [user]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = schedule.filter(b => b.date.startsWith(today));
    const completed = schedule.filter(b => b.status === 'completed').length;
    
    return {
      todayCount: todayBookings.length,
      upcomingCount: todayBookings.filter(b => b.status === 'confirmed').length,
      totalRituals: completed,
      xpPoint: completed * 50, // Gamification ritual
      efficiency: schedule.length > 0 ? Math.round((completed / schedule.length) * 100) : 0
    };
  }, [schedule]);

  const filteredSchedule = useMemo(() => {
    return schedule
      .filter(b => 
        b.service.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (b.user_id && b.user_id.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [schedule, searchQuery]);

  const handleStatusChange = async (bookingId: string, status: string) => {
    const loadToast = toast.loading(`Updating ritual status...`);
    try {
      await updateBookingStatus(bookingId, status);
      setSchedule(prev => prev.map(b => (b.id === bookingId || (b as any)._id === bookingId) ? { ...b, status } : b));
      toast.success("Client record updated.", { id: loadToast });
    } catch (err) {
      toast.error("Status update failed.", { id: loadToast });
    }
  };

  if (loading) return <BarberDashboardSkeleton />;

  return (
    <div className="dashboard-content-main">
      <main className="dashboard-main-view">
        <motion.header className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="admin-overview-header">
            <div>
              <h1 className="text-3d">Master Barber: <span className="text-gold">{user?.name}</span></h1>
              <p>Your chair is ready. You have {stats.upcomingCount} sessions on the horizon today.</p>
            </div>
            <div className="header-actions mobile-hidden">
               <button className="btn-outlined-studio" onClick={() => window.print()}>
                 <Download size={16} /> Export Schedule
               </button>
            </div>
          </div>

          <div className="header-stats-row">
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: 'var(--gold)' }}><Scissors size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Daily Agenda</span>
                <div className="stat-value">{stats.todayCount}</div>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: '#4caf50' }}><CheckCircle2 size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Rituals Completed</span>
                <div className="stat-value">{stats.totalRituals}</div>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: '#2196f3' }}><Award size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Mastery XP</span>
                <div className="stat-value">{stats.xpPoint}</div>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: 'var(--gold)' }}><Star size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Execution Efficiency</span>
                <div className="stat-value">{stats.efficiency}%</div>
              </div>
            </div>
          </div>
        </motion.header>

        <section className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-card premium-card-bg">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <h2><Calendar size={20} /> Client Agenda</h2>
              <div className="search-bar-ritual">
                <Search size={16} color="var(--text-secondary)" />
                <input 
                  type="text" 
                  placeholder="Find client or ritual..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Schedule Time</th>
                    <th>Service Craft</th>
                    <th>Patron Identifier</th>
                    <th>Status</th>
                    <th>Ops Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedule.map((b, idx) => (
                    <tr key={`${b.id || (b as any)._id}-${idx}`}>
                      <td style={{ fontWeight: 600 }}>
                        {new Date(b.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <p style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: 400 }}>{new Date(b.date).toLocaleDateString()}</p>
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--gold)' }}>{b.service}</td>
                      <td className="truncate">{b.user_id || 'Guest Patron'}</td>
                      <td>
                        <span className={`status-badge ${b.status}`}>{b.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          {b.status === 'confirmed' ? (
                            <button 
                              className="btn-filled slim" 
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                              onClick={() => handleStatusChange(b.id || (b as any)._id, 'completed')}
                            >
                              <CheckCircle2 size={14} /> COMPLETE
                            </button>
                          ) : b.status === 'completed' ? (
                             <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                               <Award size={14} /> RITUAL DONE
                             </span>
                          ) : (
                             <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{b.status.toUpperCase()}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredSchedule.length === 0 && (
                <div className="empty-state-ritual" style={{ padding: '5rem 2rem' }}>
                   <div className="empty-icon-chamber">
                     <CircleDashed size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                   </div>
                   <h3 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>No Sessions in Queue</h3>
                   <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>You have no recorded rituals for the current selection.</p>
                </div>
              )}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default BarberDashboard;
