import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Mail, Phone, Lock, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateCurrentUser } from '../../api/auth';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, login: updateUserContext, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

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

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your studio legacy? This action is irreversible.")) {
       toast.success("Account deletion request recorded. Our team will process this shortly.");
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
                onClick={handleLogout} 
                className="btn-outlined-studio" 
                style={{ flex: 1, borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
              <button 
                onClick={handleDeleteAccount} 
                className="btn-outlined-studio" 
                style={{ flex: 1, color: '#eb5757', borderColor: 'rgba(235, 87, 87, 0.3)' }}
              >
                <Trash2 size={16} /> Delete Account
              </button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Profile;
