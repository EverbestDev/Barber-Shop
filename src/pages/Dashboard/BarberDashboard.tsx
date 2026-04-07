import React, { useEffect, useState } from 'react';
import { LogOut, Calendar, Clock, CheckCircle2, Scissors, TrendingUp, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchBarberBookings, updateBookingStatus } from '../../api/bookings';
import type { Booking } from '../../api/types';

const BarberDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        if (user?.id) {
          const data = await fetchBarberBookings(user.id);
          setSchedule(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [user?.id]);

  const handleStatusChange = async (bookingId: string, status: string) => {
    try {
      await updateBookingStatus(bookingId, status);
      setSchedule(schedule.map(b => b.id === bookingId ? { ...b, status } : b));
    } catch (err) {
      console.error(err);
      alert("Status update failed.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const todayBookings = schedule.filter(b => b.status === 'confirmed');
  const pastBookings = schedule.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="dashboard-content-main">
      <main className="dashboard-main-view">
        <header className="dashboard-header">
          <div className="header-greeting">
            <h1>Master Barber: <span className="text-gold">{user?.name}</span></h1>
            <p>Your chair is ready. You have {todayBookings.length} appointments today.</p>
          </div>
        </header>

        <section className="dashboard-grid">
          <div className="dashboard-card active-bookings full-width">
            <h2><Calendar size={20} /> Upcoming Clients</h2>
            {loading ? (
              <p>Loading schedule...</p>
            ) : todayBookings.length > 0 ? (
              todayBookings.map(app => (
                <div key={app.id} className="appointment-banner">
                  <div className="app-main-info">
                    <div className="app-service">{app.service}</div>
                    <div className="app-detail"><User size={14} /> Client: {app.user_id}</div>
                    <div className="app-detail"><Clock size={14} /> {new Date(app.date).toLocaleString()}</div>
                    <div className={`status-badge ${app.payment_status}`}>{app.payment_status?.toUpperCase()}</div>
                  </div>
                  <div className="app-actions">
                    <button className="complete-btn" onClick={() => handleStatusChange(app.id!, 'completed')}>
                      <CheckCircle2 size={16} /> Mark Completed
                    </button>
                    <button className="cancel-btn" onClick={() => handleStatusChange(app.id!, 'cancelled')}>Cancel</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4">No upcoming appointments.</p>
            )}
          </div>

          <div className="dashboard-card recent-history full-width">
            <h2><TrendingUp size={20} /> Recent Shifts</h2>
            <div className="history-list">
              {pastBookings.map(b => (
                <div key={b.id} className="history-item">
                  <div className="history-info">
                    <span className="history-service">{b.service}</span>
                    <span className="history-meta">{new Date(b.date).toLocaleDateString()} • {b.status}</span>
                  </div>
                  <CheckCircle2 size={18} className={b.status === 'completed' ? 'text-success' : 'text-danger'} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BarberDashboard;
