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
  UserX,
  SortAsc,
  Mail,
  Send,
  Image as ImageIcon,
  Loader2,
  ChevronRight,
  Eye,
  X
} from 'lucide-react';
import { fetchAllUsers, updateUserRole, deleteUser, fetchSubscriberStats, fetchAllSubscribers, sendNewsletter, uploadImage } from '../../api/admin';
import { getSafeId } from '../../utils/ids';
import type { UserInfo, Subscriber } from '../../api/types';
import { downloadCSV } from '../../utils/export';
import toast from 'react-hot-toast';
import './AdminForm.css';

const AdminUsersSkeleton = () => (
    <div className="dashboard-content-main">
      <div className="dashboard-main-view">
        <div className="dashboard-header">
          <div className="skeleton skeleton-title" />
          <div className="header-stats-row">
            {[1,2,3,4].map(i => <div key={i} className="mini-stat-card skeleton skeleton-card" />)}
          </div>
        </div>
        <div className="dashboard-card premium-card-bg">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton skeleton-table-row" />)}
        </div>
      </div>
    </div>
);

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subCount, setSubCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  const [newsData, setNewsData] = useState({
    subject: '',
    content: '',
    target: 'subscribers',
    image_url: '',
    personalize: true
  });
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const [u, sStats, sList] = await Promise.all([
          fetchAllUsers(),
          fetchSubscriberStats(),
          fetchAllSubscribers()
        ]);
        setUsers(u);
        setSubCount(sStats.count);
        setSubscribers(sList);
      } catch {
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

  const sortedAndFilteredUsers = useMemo(() => {
    const result = [...users].filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'role') return a.role.localeCompare(b.role);
      if (sortBy === 'recent') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      return 0;
    });

    return result;
  }, [users, searchQuery, sortBy]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const loadToast = toast.loading("Updating member status...");
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => (getSafeId(u) === userId) ? { ...u, role: newRole } : u));
      toast.success("Role updated successfully.", { id: loadToast });
    } catch {
      toast.error("Role update failed.", { id: loadToast });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to remove this person from the studio registry?")) return;
    const loadToast = toast.loading("Removing record...");
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => (getSafeId(u) !== userId)));
      toast.success("User record deleted.", { id: loadToast });
    } catch {
      toast.error("Delete failed.", { id: loadToast });
    }
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsData.subject || !newsData.content) return;
    
    setSending(true);
    const loadToast = toast.loading("Broadcasting newsletter...");
    try {
      const res = await sendNewsletter(newsData);
      toast.success(res.message, { id: loadToast });
      setNewsData({ ...newsData, subject: '', content: '', image_url: '' });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || "Broadcast failed.", { id: loadToast });
    } finally {
      setSending(false);
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const loadToast = toast.loading("Uploading image...");
    try {
      const { url } = await uploadImage(file);
      setNewsData({ ...newsData, image_url: url });
      toast.success("Image uploaded successfully.", { id: loadToast });
    } catch {
      toast.error("Image upload failed.", { id: loadToast });
    }
  };

  if (loading) return <AdminUsersSkeleton />;

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
               <button className="btn-outlined-studio" onClick={() => downloadCSV(sortedAndFilteredUsers, 'patrons_registry.csv')}>
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
              <div className="stat-icon-chamber" style={{ color: 'var(--gold)' }}><Mail size={18} /></div>
              <div className="stat-text">
                <span className="stat-label">Subscribers</span>
                <div className="stat-value">{subCount}</div>
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
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="search-bar-standard">
                  <Search size={16} color="var(--text-secondary)" />
                  <input 
                    type="text" 
                    placeholder="Search registry..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="filter-wrapper">
                    <SortAsc size={16} color="var(--text-secondary)" />
                    <select className="status-selector" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="name">SORT BY NAME</option>
                      <option value="role">SORT BY ROLE</option>
                      <option value="recent">SORT BY RECENT</option>
                    </select>
                </div>
              </div>
            </div>
            
            <div className="table-responsive-wrapper">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Patron</th>
                      <th>Email</th>
                      <th>Membership Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAndFilteredUsers.map((u, idx) => {
                      const uId = getSafeId(u);
                      return (
                        <tr key={`${uId}-${idx}`}>
                          <td style={{ fontWeight: 800, color: 'var(--gold)' }}>{u.name}</td>
                          <td className="truncate" title={u.email}>{u.email}</td>
                          <td>
                            <div className="role-chip" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <ShieldCheck size={14} className={u.role === 'admin' ? 'text-gold' : 'text-muted'} />
                              <select 
                                value={u.role} 
                                onChange={(e) => uId && handleRoleChange(uId, e.target.value)} 
                                className="role-selector"
                              >
                                <option value="user">USER</option>
                                <option value="barber">BARBER</option>
                                <option value="admin">ADMIN</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                className="delete-btn" 
                                onClick={() => uId && handleRoleChange(uId, 'suspended')} 
                                title="Suspend Access"
                              >
                                <Ban size={16} />
                              </button>
                              <button 
                                className="delete-btn" 
                                onClick={() => uId && handleDeleteUser(uId)} 
                                title="Delete Forever"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {sortedAndFilteredUsers.length === 0 && (
                  <div className="empty-state-standard" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <div className="empty-icon-chamber">
                      <Users size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                    </div>
                    <h3 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>Registry Empty</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No patrons match your current registry search.</p>
                  </div>
                )}
              </div>
              <div className="scroll-hint-icon mobile-only"><ChevronRight size={10} /> Scroll</div>
            </div>
          </motion.div>

          <div className="admin-two-column-grid">
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="dashboard-card premium-card-bg">
                <div className="card-header">
                  <h2><Send size={20} /> Broadcast Newsletter</h2>
                </div>
                <form className="admin-form" onSubmit={handleSendNewsletter}>
                   <div className="form-row">
                     <div className="form-group">
                        <label>Subject Line</label>
                        <input 
                          type="text" 
                          placeholder="e.g. New Seasonal Styles Available!" 
                          value={newsData.subject}
                          onChange={e => setNewsData({...newsData, subject: e.target.value})}
                          required
                        />
                     </div>
                     <div className="form-group">
                        <label>Target Audience</label>
                        <select 
                          value={newsData.target} 
                          onChange={e => setNewsData({...newsData, target: e.target.value})}
                        >
                          <option value="subscribers">Subscribers Only</option>
                          <option value="users">Registered Users Only</option>
                          <option value="all">Everyone</option>
                        </select>
                     </div>
                   </div>
                   
                   <div className="form-group">
                      <label>Broadcast Image Banner</label>
                      <div className="image-upload-zone">
                        {newsData.image_url ? (
                          <div className="preview-image-container">
                            <img src={newsData.image_url} alt="Preview" />
                            <button type="button" className="remove-img-btn" onClick={() => setNewsData({ ...newsData, image_url: '' })}>&times;</button>
                          </div>
                        ) : (
                          <label className="upload-placeholder">
                            <ImageIcon size={32} />
                            <span>Select or drop a high-quality image (16:9 recommended)</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                   </div>

                   <div className="form-group">
                      <label>Message Content</label>
                      <textarea 
                        rows={6} 
                        placeholder="Write your newsletter content here..."
                        value={newsData.content}
                        onChange={e => setNewsData({...newsData, content: e.target.value})}
                        required
                        style={{ resize: 'vertical' }}
                      ></textarea>
                   </div>
                   
                   <div className="form-group checkbox-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem', marginTop: '-0.5rem', marginBottom: '1.5rem' }}>
                      <input 
                        type="checkbox" 
                        id="personalize" 
                        checked={newsData.personalize}
                        onChange={e => setNewsData({...newsData, personalize: e.target.checked})}
                        style={{ cursor: 'pointer' }}
                      />
                      <label htmlFor="personalize" className="checkbox-label" style={{ marginBottom: 0, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        Personalize greeting (e.g. "Hi [Name], ...")
                      </label>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                     <button type="button" className="btn-outlined-studio w-full" onClick={() => setShowPreview(true)}>
                        <Eye size={16} /> Preview
                     </button>
                     <button type="submit" className="btn-filled-gold w-full" disabled={sending}>
                        {sending ? <Loader2 className="spinning-icon" /> : <><Send size={16} /> Broadcast Now</>}
                     </button>
                   </div>
                </form>
             </motion.div>

             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="dashboard-card premium-card-bg">
                <div className="card-header">
                  <h2><Mail size={20} /> Newsletter Subscribers</h2>
                  <button className="d-icon-btn" onClick={() => downloadCSV(subscribers, 'subscribers.csv')}><Download size={16} /></button>
                </div>
                <div className="table-responsive-wrapper">
                  <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                     <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Email Address</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((s, idx) => (
                          <tr key={idx}>
                            <td className="truncate">{s.email}</td>
                            <td><span className={`status-badge ${s.is_active ? 'confirmed' : 'cancelled'}`}>{s.is_active ? 'ACTIVE' : 'INACTIVE'}</span></td>
                          </tr>
                        ))}
                        {subscribers.length === 0 && (
                          <tr><td colSpan={2} style={{ textAlign: 'center', padding: '2rem' }}>No subscribers yet.</td></tr>
                        )}
                      </tbody>
                     </table>
                  </div>
                  <div className="scroll-hint-icon mobile-only"><ChevronRight size={10} /> Scroll</div>
                </div>
             </motion.div>
          </div>
        </section>
      </main>

      {showPreview && (
        <div className="newsletter-preview-modal" onClick={() => setShowPreview(false)}>
          <motion.div 
            className="newsletter-preview-content" 
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="preview-header">
              <h3>Preview: {newsData.subject || 'No Subject'}</h3>
              <button className="d-icon-btn" onClick={() => setShowPreview(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="preview-body">
              {newsData.image_url && (
                <img src={newsData.image_url} alt="Newsletter Banner" />
              )}
              {newsData.personalize && (
                <p><strong>Hi [Patron Name],</strong></p>
              )}
              <div dangerouslySetInnerHTML={{ __html: newsData.content || '<p style="color: #999;">No content written yet.</p>' }} />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
