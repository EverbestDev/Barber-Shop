import React, { useEffect, useState } from 'react';
import { Users, Calendar, LogOut, Scissors, Shield, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers, updateUserRole, deleteUser } from '../../api/admin';
import { fetchAllBookings, updateBookingStatus } from '../../api/bookings';
import type { UserInfo, Booking } from '../../api/types';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const [u, b] = await Promise.all([fetchAllUsers(), fetchAllBookings()]);
        setUsers(u);
        setBookings(b);
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error(err);
      alert("Role update failed.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  const handleStatusChange = async (bookingId: string, status: string) => {
    try {
      await updateBookingStatus(bookingId, status);
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status } : b));
    } catch (err) {
      console.error(err);
      alert("Status update failed.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <img src="/images/logo.jpeg" alt="Logo" className="sidebar-logo-img" />
          <span>ADMIN PORTAL</span>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item active"><Shield size={20} /> Management</button>
          <button className="nav-item" onClick={() => navigate('/booking')}><Calendar size={20} /> All Bookings</button>
          <button className="nav-item" onClick={() => navigate('/services')}><Scissors size={20} /> Services</button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Admin Overview: <span className="text-gold">{user?.name}</span></h1>
        </header>

        <section className="dashboard-grid">
          <div className="dashboard-card full-width">
            <h2><Users size={20} /> User Management</h2>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Join Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <select 
                          value={u.role} 
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="role-selector"
                        >
                          <option value="user">User</option>
                          <option value="barber">Barber</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteUser(u.id)}
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card full-width">
            <h2><Calendar size={20} /> All Bookings</h2>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td>{b.user_id}</td>
                      <td>{b.service}</td>
                      <td>{new Date(b.date).toLocaleString()}</td>
                      <td><span className={`status-badge ${b.status}`}>{b.status}</span></td>
                      <td><span className={`payment-badge ${b.payment_status}`}>{b.payment_status}</span></td>
                      <td>
                        <select 
                          value={b.status} 
                          onChange={(e) => handleStatusChange(b.id!, e.target.value)}
                          className="status-selector"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
