import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser, registerUser, fetchCurrentUser, googleAuth } from '../../../api/auth';
import './AuthDrawer.css';

interface AuthDrawerProps {
  onClose: () => void;
}

const AuthDrawer: React.FC<AuthDrawerProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleResponse = async (response: any) => {
    if (!response.credential) return;
    setLoading(true);
    const loadToast = toast.loading("Authenticating with Google...");
    try {
      const authResponse = await googleAuth(response.credential);
      localStorage.setItem('token', authResponse.access_token);
      const userData = await fetchCurrentUser();
      login(userData);
      toast.success(`Welcome to the studio, ${userData.name.split(' ')[0]}!`, { id: loadToast });
      onClose();
      navigate('/dashboard');
    } catch(err: any) {
      toast.error(err.response?.data?.detail || 'Google Authentication failed.', { id: loadToast });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return;
    
    // Check if script already appended to avoid duplicates
    if (!document.getElementById('google-jssdk')) {
      const script = document.createElement('script');
      script.id = 'google-jssdk';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        // @ts-ignore
        if (window.google?.accounts?.id) {
          // @ts-ignore
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse
          });
          const btnDiv = document.getElementById('googleAuthDiv');
          if (btnDiv) {
            // @ts-ignore
            window.google.accounts.id.renderButton(btnDiv, {
              theme: 'outline',
              size: 'large',
              width: 320,
              text: 'continue_with'
            });
          }
        }
      };
    } else {
        // @ts-ignore
        if (window.google?.accounts?.id) {
          // @ts-ignore
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse
          });
          const btnDiv = document.getElementById('googleAuthDiv');
          if (btnDiv) {
            // @ts-ignore
            window.google.accounts.id.renderButton(btnDiv, {
              theme: 'outline',
              size: 'large',
              width: 320,
              text: 'continue_with'
            });
          }
        }
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadToast = toast.loading(isLogin ? "Signing you in..." : "Creating your account...");
    
    try {
      if (isLogin) {
        const response = await loginUser({ email, password });
        localStorage.setItem('token', response.access_token);
        const userData = await fetchCurrentUser();
        login(userData);
        toast.success(`Welcome back, ${userData.name.split(' ')[0]}!`, { id: loadToast });
        onClose();
        navigate('/dashboard');
      } else {
        // Registration: get token but show OTP screen first, don't go to dashboard yet
        const response = await registerUser({ name, email, password });
        localStorage.setItem('token', response.access_token);
        toast.success("Account created! Please check your email for the verification code.", { id: loadToast });
        setShowOTP(true); // Show OTP verification before going to dashboard
      }
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.detail || (err instanceof Error ? err.message : 'Something went wrong');
      toast.error(message, { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const verifToast = toast.loading("Verifying your code...");
    try {
      await import('../../../api/auth').then(m => m.verifyOTP(email, otpCode));
      toast.success("Email verified! Welcome to the studio.", { id: verifToast });
      
      const userData = await fetchCurrentUser();
      login(userData);
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid code. Please try again.", { id: verifToast });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email address.");
    setLoading(true);
    const passToast = toast.loading("Sending recovery email...");
    try {
      await import('../../../api/auth').then(m => m.forgotPassword(email));
      toast.success("Recovery code sent! Check your inbox.", { id: passToast });
      setIsForgotPassword(false);
      setIsResettingPassword(true);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Something went wrong. Please try again.", { id: passToast });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const rsToast = toast.loading("Saving your new password...");
    try {
      await import('../../../api/auth').then(m => m.resetPassword(email, otpCode, password));
      toast.success("Password updated! Signing you in...", { id: rsToast });
      const loginResp = await loginUser({ email, password });
      localStorage.setItem('token', loginResp.access_token);
      const userData = await fetchCurrentUser();
      login(userData);
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid code. Please try again.", { id: rsToast });
    } finally {
      setLoading(false);
    }
  };

  if (showOTP || isResettingPassword) {
    const isEmailVerify = showOTP && !isResettingPassword;
    return (
      <motion.div className="auth-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
        <div className="drawer-header"><button className="close-drawer-btn" onClick={onClose}><X size={24} /></button><h2 className="drawer-logo">BAZE 2 BARBERS</h2></div>
        <div className="drawer-content">
          <div className="auth-header-snippet">
            <h3>{isResettingPassword ? "Create New Password" : "Verify Your Email"}</h3>
            <p style={{ fontSize: '0.85rem' }}>We sent a 6-digit code to <strong>{email}</strong>. Enter it below to {isEmailVerify ? 'activate your account' : 'reset your password'}.</p>
          </div>
          <form className="auth-form drawer-form" onSubmit={isResettingPassword ? handleResetPasswordSubmit : handleVerifyOTP}>
            <div className="input-group">
              <input type="text" placeholder="000000" maxLength={6} required value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g,''))} style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.25rem', fontWeight: 800 }} />
            </div>
            {isResettingPassword && (
              <div className="input-group" style={{ marginTop: '1rem' }}>
                <Lock size={18} className="input-icon" />
                <input type="password" placeholder="New Password" required readOnly={loading} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            )}
            <button type="submit" className="btn-filled auth-submit-btn" disabled={loading || otpCode.length < 6 || (isResettingPassword && password.length < 6)}>
              {loading ? <><Loader2 className="spinning-icon-btn" size={18} /> Please wait...</> : <>{isResettingPassword ? 'Save New Password' : 'Verify & Continue'} <ArrowRight size={18} /></>}
            </button>
          </form>
          <div className="drawer-footer-text" style={{ marginTop: '2rem' }}>
             <button className="text-gold" onClick={() => { setShowOTP(false); setIsResettingPassword(false); }} disabled={loading}>Go back</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="auth-drawer"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      <div className="drawer-header">
        <button className="close-drawer-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <h2 className="drawer-logo">BAZE 2 BARBERS</h2>
      </div>

      <div className="drawer-content">
        <div className="auth-header-snippet">
          <h3>{isForgotPassword ? 'Recover Access' : isLogin ? 'Welcome Back' : 'Join the Elite'}</h3>
          <p>{isForgotPassword ? 'Enter your email to request an unlock ritual.' : isLogin ? 'Sign in to manage your bookings.' : 'Create an account for the full experience.'}</p>
        </div>

        {!isForgotPassword && (
          <div className="auth-tabs mini-tabs">
            <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)} disabled={loading}>Login</button>
            <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)} disabled={loading}>Register</button>
          </div>
        )}

        <form className="auth-form drawer-form" onSubmit={isForgotPassword ? handleForgotPasswordSubmit : handleAuth}>
          {!isLogin && !isForgotPassword && (
            <div className="input-group">
              <User size={18} className="input-icon" />
              <input type="text" placeholder="Full Name" required readOnly={loading} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input type="email" placeholder="Email Address" required readOnly={loading} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {!isForgotPassword && (
            <div className="input-group">
              <Lock size={18} className="input-icon" />
              <input type="password" placeholder="Password" required readOnly={loading} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          )}
          
          {isLogin && !isForgotPassword && (
             <button type="button" onClick={() => setIsForgotPassword(true)} disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 600, textAlign: 'right', display: 'block', width: '100%', marginBottom: '1rem', cursor: 'pointer' }}>Forgot Password?</button>
          )}

          <button type="submit" className="btn-filled auth-submit-btn" disabled={loading}>
            {loading ? <><Loader2 className="spinning-icon-btn" size={18} /> Processing...</> : <>{isForgotPassword ? 'Send Recovery Code' : isLogin ? 'Log In' : 'Sign Up'} <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        <div id="googleAuthDiv" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', width: '100%' }}></div>

        <div className="drawer-footer-text">
          <p>
            {isForgotPassword ? (
               <button onClick={() => setIsForgotPassword(false)} disabled={loading}>Return to Login</button>
            ) : isLogin ? (
              <>Don't have an account? <button onClick={() => setIsLogin(!isLogin)} disabled={loading}>Register</button></>
            ) : (
              <>Already have an account? <button onClick={() => setIsLogin(!isLogin)} disabled={loading}>Login</button></>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthDrawer;
