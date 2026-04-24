import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, User, Shield, Mail, Phone, Lock, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateCurrentUser, requestDeleteOTP, confirmDeleteAccount } from '../../api/auth';
import api from '../../api/client';
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
  const [showUnsubModal, setShowUnsubModal] = useState(false);
  const [showUnsubOTPModal, setShowUnsubOTPModal] = useState(false);
  const [deleteOTP, setDeleteOTP] = useState('');
  const [unsubOTP, setUnsubOTP] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(true); // Assume subscribed initially

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
    const toastId = toast.loading("Sending verification code...");
    try {
      await requestDeleteOTP();
      toast.success("Code sent! Check your email.", { id: toastId });
      setShowDeleteModal(true);
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Could not send code.", { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const toastId = toast.loading("Deleting your account...");
    try {
      await confirmDeleteAccount(deleteOTP);
      toast.success("Account deleted. Hope to see you again!", { id: toastId });
      logout();
      navigate('/');
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Invalid or expired code.", { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestUnsub = async () => {
    setActionLoading(true);
    const toastId = toast.loading("Processing unsubscription request...");
    try {
      await api.post('/subscribers/unsubscribe/request', { email: user?.email });
      toast.success("Security code sent! Check your inbox.", { id: toastId });
      setShowUnsubModal(false);
      setShowUnsubOTPModal(true);
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Request failed. Are you sure you are subscribed?", { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmUnsub = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const toastId = toast.loading("Removing your access to the Inner Circle...");
    try {
      await api.post('/subscribers/unsubscribe/confirm', { email: user?.email, otp_code: unsubOTP });
      toast.success("Unsubscribed successfully. You'll be missed!", { id: toastId });
      setIsSubscribed(false);
      setShowUnsubOTPModal(false);
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Invalid or expired code.", { id: toastId });
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
            <h1>Account <span className="text-gold">& Profile</span></h1>
            <p>Manage your account details and security settings.</p>
          </div>
        </motion.header>

        <motion.section 
          className="profile-stacked-layout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Access Control Section */}
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
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
             </form>
          </div>

          {/* Newsletter Section */}
          <div className="dashboard-card premium-card-bg mt-8">
            <div className="card-header">
               <h2><Mail size={20} /> Inner Circle Subscription</h2>
            </div>
            <div className="newsletter-profile-status">
              <div className="status-info">
                <p>Stay updated with our latest grooming tips, style trends, and priority booking alerts.</p>
                <div className={`status-pill ${isSubscribed ? 'active' : 'inactive'}`}>
                  {isSubscribed ? 'Subscribed' : 'Not Subscribed'}
                </div>
              </div>
              {isSubscribed ? (
                <button onClick={() => setShowUnsubModal(true)} className="btn-unsub-link">
                  Unsubscribe from newsletter
                </button>
              ) : (
                <button onClick={() => navigate('/')} className="btn-filled-gold">
                  Subscribe Now
                </button>
              )}
            </div>
          </div>

          {/* Account Actions Section */}
          <div className="dashboard-card premium-card-bg mt-8" style={{ border: '1px solid rgba(235, 87, 87, 0.2)' }}>
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
                <h2>Confirm Logout</h2>
                <p>Are you sure you want to log out of your account?</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-outlined-studio" onClick={() => setShowLogoutModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button className="btn-filled-gold" onClick={handleLogout} style={{ flex: 1 }}>Log Out</button>
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
                 <h2 style={{ color: '#eb5757' }}>Delete Account</h2>
                 <p style={{ marginTop: '0.5rem' }}>We've sent a 6-digit code to <strong>{user?.email}</strong>. Enter it below to confirm you want to permanently delete your account.</p>
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
                    autoComplete="one-time-code"
                  />
                </div>
                <button type="submit" className="btn-filled auth-submit-btn" disabled={actionLoading || deleteOTP.length < 6} style={{ backgroundColor: '#eb5757', color: '#fff' }}>
                  {actionLoading ? <><Loader2 className="spinning-icon-btn" size={18} /> Deleting...</> : <>Delete My Account <Trash2 size={18} style={{ marginLeft: '0.5rem' }} /></>}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      )}

      {/* Unsubscribe Persuasion Modal */}
      {showUnsubModal && (
        <div className="auth-page-wrapper" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
          <div className="auth-content-side center-full" style={{ padding: '2rem' }}>
            <motion.div className="auth-box otp-box" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="auth-header text-center pb-4">
                <h2>Wait, Stay Sharp!</h2>
                <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>
                  By unsubscribing, you'll lose out on:<br/>
                  • <b>Priority access</b> to booked slots<br/>
                  • <b>Exclusive</b> grooming style guides<br/>
                  • <b>Special discounts</b> and studio events
                </p>
                <p style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.8 }}>Are you sure you want to leave the inner circle?</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                <button className="btn-filled-gold" onClick={() => setShowUnsubModal(false)}>No, I'll Stay Subscribed</button>
                <button className="btn-unsub-link" onClick={handleRequestUnsub} disabled={actionLoading} style={{ fontSize: '0.85rem', opacity: 0.6 }}>
                  {actionLoading ? 'Processing...' : 'Yes, proceed to unsubscribe'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Unsubscribe OTP Modal */}
      {showUnsubOTPModal && (
        <div className="auth-page-wrapper" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
          <div className="auth-content-side center-full" style={{ padding: '2rem' }}>
            <motion.div className="auth-box otp-box" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="auth-header text-center">
                 <button onClick={() => setShowUnsubOTPModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
                 <h2>Verify Unsubscription</h2>
                 <p style={{ marginTop: '0.5rem' }}>Enter the 6-digit code sent to <strong>{user?.email}</strong> to confirm.</p>
              </div>
              <form className="auth-form" onSubmit={handleConfirmUnsub}>
                <div className="input-group otp-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="000000" 
                    maxLength={6} 
                    required 
                    className="otp-input"
                    value={unsubOTP}
                    onChange={(e) => setUnsubOTP(e.target.value.replace(/\D/g,''))}
                    style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.25rem', fontWeight: 800 }}
                  />
                </div>
                <button type="submit" className="btn-filled auth-submit-btn" disabled={actionLoading || unsubOTP.length < 6}>
                  {actionLoading ? <><Loader2 className="spinning-icon-btn" size={18} /> Verifying...</> : <>Confirm Unsubscription</>}
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
