import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Trash2, 
  ShieldCheck, 
  Ban,
  Download,
  Shield,
  UserCheck,
  UserX
} from 'lucide-react';
import { fetchAllUsers, updateUserRole, deleteUser } from '../../api/admin';
import type { UserInfo } from '../../api/types';
import toast from 'react-hot-toast';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const u = await fetchAllUsers();
        setUsers(u);
      } catch (err) {
        toast.error("Failed to sync studio registry.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const userStats = useMemo(() => {
      return {
          active: users.filter(u => u.role !== 'suspended').length,
          suspended: users.filter(u => u.role === 'suspended').length,
          admins: users.filter(u => u.role === 'admin').length,
          barbers: users.filter(u => u.role === 'barber').length
      };
  }, [users]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: string) => {
    const loadToast = toast.loading("Updating membership ritual...");
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success("Role updated successfully.", { id: loadToast });
    } catch (err) {
      toast.error("Role update failed.", { id: loadToast });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to remove this person from the studio registry?")) return;
    const loadToast = toast.loading("Removing record...");
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast.success("User record deleted.", { id: loadToast });
    } catch (err) {
      toast.error("Delete failed.", { id: loadToast });
    }
  };

  if (loading) return <div className="loading-ritual"><p>Syncing Registry...</p></div>;

  return (
    <div className="dashboard-content-main">
      <main className="dashboard-main-view">
        <motion.header className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="admin-overview-header">
            <div>
              <h1 className="text-3d">Patron <span className="text-gold">Registry</span></h1>
              <p>Managing the studio's elite membership community.</p>
            </div>
            <div className="header-actions">
               <button className="btn-outlined-studio" onClick={() => window.print()}>
                 <Download size={16} /> Export Data
               </button>
            </div>
          </div>

          <div className="header-stats-row">
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: '#4caf50' }}><UserCheck size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Active Members</span>
                <div className="stat-value">{userStats.active}</div>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: 'var(--gold)' }}><Shield size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Barbers/Admins</span>
                <div className="stat-value">{userStats.barbers + userStats.admins}</div>
              </div>
            </div>
            <div className="mini-stat-card">
              <div className="stat-icon-chamber" style={{ color: '#f44336' }}><UserX size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Suspended</span>
                <div className="stat-value">{userStats.suspended}</div>
              </div>
            </div>
          </div>
        </motion.header>

        <section className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-card premium-card-bg">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <h2><Users size={20} /> Membership Registry</h2>
              <div className="search-bar-ritual">
                <Search size={16} color="var(--text-secondary)" />
                <input 
                  type="text" 
                  placeholder="Search registry..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Patron Name</th>
                    <th>Identifier / Email</th>
                    <th>Membership Role</th>
                    <th>Security Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 800, color: 'var(--gold)' }}>{u.name}</td>
                      <td className="truncate" title={u.email}>{u.email}</td>
                      <td>
                        <div className="role-chip" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <ShieldCheck size={14} className={u.role === 'admin' ? 'text-gold' : 'text-muted'} />
                          <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} className="role-selector">
                            <option value="user">USER</option>
                            <option value="barber">BARBER</option>
                            <option value="admin">ADMIN</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="delete-btn" onClick={() => handleRoleChange(u.id, 'suspended')} title="Suspend Access">
                            <Ban size={16} />
                          </button>
                          <button className="delete-btn" onClick={() => handleDeleteUser(u.id)} title="Delete Forever">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="empty-state-ritual" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <div className="empty-icon-chamber">
                    <Users size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                  </div>
                  <h3 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>Registry Empty</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No patrons match your current registry search.</p>
                </div>
              )}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default AdminUsers;
