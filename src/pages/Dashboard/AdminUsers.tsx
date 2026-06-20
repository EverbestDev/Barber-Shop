import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
  Wallet,
  Scissors
} from 'lucide-react';
import { fetchAllUsers, updateUserRole, deleteUser, fetchSubscriberStats, fetchAllSubscribers, sendNewsletter, uploadImage } from '../../api/admin';
import { fetchAllBookings } from '../../api/bookings';
import { useAuth } from '../../context/AuthContext';
import { getSafeId } from '../../utils/ids';
import type { UserInfo, Subscriber, Booking } from '../../api/types';
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
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subCount, setSubCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // Newest first by default
  
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [actionUser, setActionUser] = useState<UserInfo | null>(null);

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
        const [u, sStats, sList, b] = await Promise.all([
          fetchAllUsers(),
          fetchSubscriberStats(),
          fetchAllSubscribers(),
          fetchAllBookings()
        ]);
        setUsers(u);
        setSubCount(sStats.count);
        setSubscribers(sList);
        setBookings(b || []);
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

  // Calculate detailed stats for selectedUser (if active)
  const selectedUserStats = selectedUser ? (() => {
    const uId = getSafeId(selectedUser);
    const userBookings = bookings.filter(b => b.user_id === uId || (b.guest_email && b.guest_email.toLowerCase() === selectedUser.email.toLowerCase()));
    const totalBooked = userBookings.length;
    const paidBookings = userBookings.filter(b => !b.is_free_promo && b.payment_status === 'paid');
    const totalPaidCount = paidBookings.length;
    const totalSpent = paidBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const promoSessionsCheckedIn = userBookings.filter(b => b.is_free_promo && b.status === 'completed').length;
    const dateJoined = selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString([], { dateStyle: 'medium' }) : 'N/A';

    return {
      userBookings,
      totalBooked,
      totalPaidCount,
      totalSpent,
      promoSessionsCheckedIn,
      dateJoined
    };
  })() : null;

  return (
    <div className="dashboard-content-main">
      <main className="dashboard-main-view">
        {selectedUser && selectedUserStats ? (
          /* Profile Detail View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="dashboard-header" style={{ gap: '0.5rem', marginBottom: 0 }}>
              <button 
                className="btn-outlined-studio" 
                onClick={() => setSelectedUser(null)} 
                style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                ← Back to Registry
              </button>
              <div className="admin-overview-header" style={{ width: '100%' }}>
                <div>
                  <h1 className="text-3d">{selectedUser.name} <span className="text-gold">Profile</span></h1>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {selectedUser.email} &bull; Role: <span style={{ textTransform: 'uppercase', fontWeight: 800, color: 'var(--gold)' }}>{selectedUser.role}</span>
                  </p>
                </div>
                {!(currentUser && currentUser.email === selectedUser.email) ? (
                  <button 
                    className="btn-filled-studio"
                    onClick={() => setActionUser(selectedUser)}
                    style={{ backgroundColor: 'var(--gold)', color: 'var(--primary)', fontWeight: 700, padding: '0.5rem 1.25rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                  >
                    Perform Action
                  </button>
                ) : (
                  <button 
                    className="btn-filled-studio"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontWeight: 700, padding: '0.5rem 1.25rem', borderRadius: '4px', border: 'none', cursor: 'not-allowed', opacity: 0.6 }}
                    disabled
                    title="You cannot perform actions on your own profile."
                  >
                    Action Disabled
                  </button>
                )}
              </div>
            </div>

            <div className="header-stats-row">
              <div className="mini-stat-card">
                <div className="stat-icon-chamber" style={{ color: 'var(--gold)' }}><UserCheck size={18} /></div>
                <div className="stat-text">
                  <span className="stat-label">Date Joined</span>
                  <div className="stat-value" style={{ fontSize: '0.95rem', whiteSpace: 'nowrap' }}>{selectedUserStats.dateJoined}</div>
                </div>
              </div>
              <div className="mini-stat-card">
                <div className="stat-icon-chamber" style={{ color: 'var(--gold)' }}><Scissors size={18} /></div>
                <div className="stat-text">
                  <span className="stat-label">Total Bookings</span>
                  <div className="stat-value">{selectedUserStats.totalBooked}</div>
                </div>
              </div>
              <div className="mini-stat-card">
                <div className="stat-icon-chamber" style={{ color: '#4caf50' }}><Wallet size={18} /></div>
                <div className="stat-text">
                  <span className="stat-label">Paid Investment</span>
                  <div className="stat-value" style={{ fontSize: '0.95rem', whiteSpace: 'nowrap' }}>{selectedUserStats.totalPaidCount} sessions (£{selectedUserStats.totalSpent.toFixed(2)})</div>
                </div>
              </div>
              <div className="mini-stat-card">
                <div className="stat-icon-chamber" style={{ color: '#4caf50' }}><ShieldCheck size={18} /></div>
                <div className="stat-text">
                  <span className="stat-label">Promo Checked In</span>
                  <div className="stat-value">{selectedUserStats.promoSessionsCheckedIn}</div>
                </div>
              </div>
            </div>

            <div className="dashboard-card premium-card-bg">
              <div className="card-header">
                <h2>Appointment History</h2>
              </div>
              <div className="table-responsive-wrapper">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Schedule</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Promo</th>
                        <th>Booked On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUserStats.userBookings.map((b, idx) => (
                        <tr key={`${getSafeId(b)}-${idx}`}>
                          <td style={{ fontWeight: 800 }}>{b.service}</td>
                          <td>{new Date(b.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                          <td style={{ fontWeight: 'bold' }}>£{(b.amount || 0).toFixed(2)}</td>
                          <td><span className={`status-badge ${b.status}`}>{b.status}</span></td>
                          <td>
                            <span className={`payment-badge ${b.is_free_promo ? 'free' : 'standard'}`} style={{ color: b.is_free_promo ? 'var(--gold)' : 'var(--text-secondary)' }}>
                              {b.is_free_promo ? 'Free Tuesday' : 'Standard'}
                            </span>
                          </td>
                          <td>{b.created_at ? new Date(b.created_at).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))}
                      {selectedUserStats.userBookings.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                            No appointments found for this patron.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Main Registry List */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <motion.header className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 0 }}>
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
                          <option value="recent">SORT BY RECENT</option>
                          <option value="name">SORT BY NAME</option>
                          <option value="role">SORT BY ROLE</option>
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
                          const isCurrentUser = !!(currentUser && currentUser.email === u.email);
                          return (
                            <tr key={`${uId}-${idx}`} style={{ background: isCurrentUser ? 'rgba(212, 175, 55, 0.04)' : 'transparent' }}>
                              <td 
                                style={{ fontWeight: 800, color: 'var(--gold)', cursor: 'pointer' }} 
                                onClick={() => setSelectedUser(u)}
                                title="Click to view details"
                              >
                                {u.name} {isCurrentUser && <span style={{ fontSize: '0.65rem', color: 'var(--primary)', marginLeft: '0.5rem', backgroundColor: 'var(--gold)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', verticalAlign: 'middle' }}>YOU</span>}
                              </td>
                              <td className="truncate" title={u.email}>{u.email}</td>
                              <td>
                                <div className="role-chip" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <ShieldCheck size={14} className={u.role === 'admin' ? 'text-gold' : (u.role === 'barber' ? 'text-gold-light' : 'text-muted')} />
                                  <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>{u.role}</span>
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button 
                                    className="btn-outlined-studio" 
                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}
                                    onClick={() => setSelectedUser(u)}
                                  >
                                    View
                                  </button>
                                  <button 
                                    className="btn-outlined-studio" 
                                    style={{ 
                                      padding: '0.35rem 0.75rem', 
                                      fontSize: '0.75rem', 
                                      borderRadius: '4px', 
                                      cursor: isCurrentUser ? 'not-allowed' : 'pointer', 
                                      color: isCurrentUser ? 'var(--text-secondary)' : 'var(--gold)', 
                                      borderColor: isCurrentUser ? 'rgba(255,255,255,0.1)' : 'var(--gold)',
                                      opacity: isCurrentUser ? 0.6 : 1
                                    }}
                                    onClick={() => !isCurrentUser && setActionUser(u)}
                                    disabled={isCurrentUser}
                                    title={isCurrentUser ? "You cannot modify your own profile actions." : "Manage account"}
                                  >
                                    Action
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
          </div>
        )}
      </main>

      {/* Newsletter Preview Modal */}
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

      {/* Account Action Modal */}
      <AnimatePresence>
        {actionUser && (
          <div className="modal-overlay" onClick={() => setActionUser(null)}>
            <motion.div 
              className="modal-content premium-card-bg"
              style={{ maxWidth: '400px', width: '100%', border: '1px solid rgba(255,255,255,0.08)' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Account Actions</h2>
                <button className="close-btn" onClick={() => setActionUser(null)}>&times;</button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ color: 'var(--gold)', fontSize: '1.25rem', marginBottom: '0.25rem' }}>{actionUser.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{actionUser.email}</p>
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Modify Membership Role</label>
                  <select 
                    value={actionUser.role} 
                    onChange={(e) => {
                      const uId = getSafeId(actionUser);
                      if (uId) {
                        handleRoleChange(uId, e.target.value);
                        setActionUser({ ...actionUser, role: e.target.value });
                        if (selectedUser && getSafeId(selectedUser) === uId) {
                          setSelectedUser({ ...selectedUser, role: e.target.value });
                        }
                      }
                    }} 
                    className="status-selector"
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }}
                  >
                    <option value="user">USER (PATRON)</option>
                    <option value="barber">BARBER (STAFF)</option>
                    <option value="admin">ADMIN (EXECUTIVE)</option>
                    <option value="suspended">SUSPENDED</option>
                  </select>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {actionUser.role !== 'suspended' ? (
                    <button 
                      onClick={() => {
                        const uId = getSafeId(actionUser);
                        if (uId) {
                          handleRoleChange(uId, 'suspended');
                          setActionUser(null);
                          if (selectedUser && getSafeId(selectedUser) === uId) {
                            setSelectedUser({ ...selectedUser, role: 'suspended' });
                          }
                        }
                      }}
                      className="btn-outlined-studio"
                      style={{ width: '100%', borderColor: '#f44336', color: '#f44336', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <Ban size={16} /> Suspend Account
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        const uId = getSafeId(actionUser);
                        if (uId) {
                          handleRoleChange(uId, 'user');
                          setActionUser(null);
                          if (selectedUser && getSafeId(selectedUser) === uId) {
                            setSelectedUser({ ...selectedUser, role: 'user' });
                          }
                        }
                      }}
                      className="btn-outlined-studio"
                      style={{ width: '100%', borderColor: '#4caf50', color: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <UserCheck size={16} /> Unsuspend Account
                    </button>
                  )}

                  <button 
                    onClick={() => {
                      const uId = getSafeId(actionUser);
                      if (uId) {
                        handleDeleteUser(uId);
                        setActionUser(null);
                        setSelectedUser(null);
                      }
                    }}
                    className="btn-filled"
                    style={{ width: '100%', backgroundColor: '#f44336', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '4px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}
                  >
                    <Trash2 size={16} /> Delete Account Forever
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
