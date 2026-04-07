import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, User, Shield, Mail, Phone, Lock, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateCurrentUser, requestDeleteOTP, confirmDeleteAccount } from '../../api/auth';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, login: updateUserContext, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOTP, setDeleteOTP] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedUser = await updateCurrentUser({ name, email, phone });
      updateUserContext(updatedUser);
      toast.success('Security profile synchronized successfully.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Update failed';
      toast.error((err as { response?: { data?: { detail?: string } } }).response?.data?.detail || message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRequestDelete = async () => {
    setActionLoading(true);
    const toastId = toast.loading("Authorizing deletion request...");
    try {
      await requestDeleteOTP();
      toast.success("Authorization code dispatched. Check your email.", { id: toastId });
      setShowDeleteModal(true);
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Action failed.", { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const toastId = toast.loading("Executing final protocol...");
    try {
      await confirmDeleteAccount(deleteOTP);
      toast.success("Legacy deleted. Journey well.", { id: toastId });
      logout();
      navigate('/');
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Invalid code.", { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="dashboard-content-main">
      <main className="dashboard-main-view">
        <motion.header 
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="header-greeting">
            <h1>Security <span className="text-gold">& Profile</span></h1>
            <p>Manage your studio identities and secure your presence.</p>
          </div>
        </motion.header>

        <motion.section 
          className="dashboard-grid profile-compact-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="dashboard-card premium-card-bg">
             <div className="card-header">
                <h2><Shield size={20} /> Access Control</h2>
             </div>
             
             <div className="profile-identity-banner mb-8">
               <div className="avatar-chamber">
                 {user?.name?.charAt(0) || 'U'}
               </div>
               <div className="identity-details">
                 <h3>{user?.name}</h3>
                 <span className="clearance-badge">{user?.role === 'admin' ? 'Master Clearance' : 'Premium Patron'}</span>
               </div>
             </div>

             <form className="compact-settings-form" onSubmit={handleSaveSettings}>
                <div className="form-group-row">
                  <div className="form-group">
                    <label><User size={14} className="inline mr-1" /> Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      required 
                      className="premium-input"
                    />
                  </div>
                  <div className="form-group">
                    <label><Mail size={14} className="inline mr-1" /> Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                      className="premium-input"
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label><Phone size={14} className="inline mr-1" /> Primary Phone</label>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      placeholder="+44 7700 900123" 
                      className="premium-input"
                    />
                  </div>
                  <div className="form-group">
                    <label><Lock size={14} className="inline mr-1" /> Password (Disabled)</label>
                    <input 
                      type="password" 
                      value="********" 
                      disabled
                      className="premium-input disabled-input"
                    />
                  </div>
                </div>

                <div className="form-actions mt-6">
                  <button type="submit" className="btn-filled-gold" disabled={isSaving}>
                    {isSaving ? 'Synchronizing...' : 'Update Identity'}
                  </button>
                </div>
             </form>
          </div>

          <div className="dashboard-card premium-card-bg mt-6" style={{ border: '1px solid rgba(235, 87, 87, 0.2)' }}>
            <div className="card-header mb-4">
              <h2 style={{ color: '#eb5757', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Shield size={20} /> Account Actions
              </h2>
            </div>
            <div className="account-actions-flex" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setShowLogoutModal(true)} 
                className="btn-outlined-studio flex-center gap-2" 
                style={{ flex: 1, borderColor: 'rgba(255,255,255,0.2)', padding: '0.8rem', fontWeight: 600, borderRadius: '8px' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
              <button 
                onClick={handleRequestDelete} 
                disabled={actionLoading}
                className="btn-outlined-studio flex-center gap-2" 
                style={{ flex: 1, color: '#eb5757', borderColor: 'rgba(235, 87, 87, 0.3)', padding: '0.8rem', fontWeight: 600, borderRadius: '8px' }}
              >
                {actionLoading ? <Loader2 size={16} className="spinning-icon-btn" /> : <Trash2 size={16} />}
                {actionLoading ? 'Initializing...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="auth-page-wrapper" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
          <div className="auth-content-side center-full" style={{ padding: '2rem' }}>
            <motion.div className="auth-box otp-box" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="auth-header text-center pb-4">
                <h2>Confirm Departure</h2>
                <p>Are you sure you want to securely sign out of your terminal?</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-outlined-studio" onClick={() => setShowLogoutModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button className="btn-filled-gold" onClick={handleLogout} style={{ flex: 1 }}>Confirm Sign Out</button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Delete Account OTP Modal */}
      {showDeleteModal && (
        <div className="auth-page-wrapper" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
          <div className="auth-content-side center-full" style={{ padding: '2rem' }}>
            <motion.div className="auth-box otp-box" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="auth-header text-center">
                 <button onClick={() => setShowDeleteModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
                 <h2 style={{ color: '#eb5757' }}>Authorization Terminal</h2>
                 <p style={{ marginTop: '0.5rem' }}>A 6-digit confirmation protocol has been dispatched to <strong>{user?.email}</strong>. Enter it to permanently delete your data.</p>
              </div>
              <form className="auth-form" onSubmit={handleConfirmDelete}>
                <div className="input-group otp-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="000000" 
                    maxLength={6} 
                    required 
                    className="otp-input"
                    value={deleteOTP}
                    onChange={(e) => setDeleteOTP(e.target.value.replace(/\D/g,''))}
                    style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.25rem', fontWeight: 800 }}
                  />
                </div>
                <button type="submit" className="btn-filled auth-submit-btn" disabled={actionLoading || deleteOTP.length < 6} style={{ backgroundColor: '#eb5757', color: '#fff' }}>
                  {actionLoading ? <><Loader2 className="spinning-icon-btn" size={18} /> Executing Protocol...</> : <>Delete Everything <Trash2 size={18} style={{ marginLeft: '0.5rem' }} /></>}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
