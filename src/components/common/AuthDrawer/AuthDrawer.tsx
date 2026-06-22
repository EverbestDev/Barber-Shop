import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
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
      let redirect = sessionStorage.getItem('redirectAfterAuth') || '/dashboard';
      sessionStorage.removeItem('redirectAfterAuth');
      if (userData.role === 'admin' && redirect === '/dashboard/promo') {
        redirect = '/dashboard/promo-bookings';
      }
      navigate(redirect);
    } catch(err: any) {
      toast.error(err.response?.data?.detail || 'Google Authentication failed.', { id: loadToast });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return;
    
    const initializeGoogle = () => {
      // @ts-ignore
      if (window.google?.accounts?.id) {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false, // Prevents unexpected auto-logins which can trigger multiple calls
          use_fedcm_for_prompt: true // Modern standard
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

    if (!document.getElementById('google-jssdk')) {
      const script = document.createElement('script');
      script.id = 'google-jssdk';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    } else {
      // Script is already there, just initialize
      // Small delay ensures the 'googleAuthDiv' is actually in the DOM before rendering
      const timer = setTimeout(initializeGoogle, 100);
      return () => clearTimeout(timer);
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
        let redirect = sessionStorage.getItem('redirectAfterAuth') || '/dashboard';
        sessionStorage.removeItem('redirectAfterAuth');
        if (userData.role === 'admin' && redirect === '/dashboard/promo') {
          redirect = '/dashboard/promo-bookings';
        }
        navigate(redirect);
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
      let redirect = sessionStorage.getItem('redirectAfterAuth') || '/dashboard';
      sessionStorage.removeItem('redirectAfterAuth');
      if (userData.role === 'admin' && redirect === '/dashboard/promo') {
        redirect = '/dashboard/promo-bookings';
      }
      navigate(redirect);
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
      const loginResp = await loginUser({ email: email.trim(), password });
      localStorage.setItem('token', loginResp.access_token);
      const userData = await fetchCurrentUser();
      login(userData);
      
      // Clear sensitive info before closing
      setEmail('');
      setPassword('');
      setOtpCode('');
      
      onClose();
      let redirect = sessionStorage.getItem('redirectAfterAuth') || '/dashboard';
      sessionStorage.removeItem('redirectAfterAuth');
      if (userData.role === 'admin' && redirect === '/dashboard/promo') {
        redirect = '/dashboard/promo-bookings';
      }
      navigate(redirect);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid code. Please try again.", { id: rsToast });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (login: boolean) => {
    setIsLogin(login);
    // Clear fields when switching to prevent Carry-over or Pre-fills
    setEmail('');
    setPassword('');
    setName('');
    setShowOTP(false);
    setOtpCode('');
    setIsForgotPassword(false);
    setIsResettingPassword(false);
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
          <form className="auth-form drawer-form" onSubmit={isResettingPassword ? handleResetPasswordSubmit : handleVerifyOTP} autoComplete="off">
            <div className="input-group">
              <input 
                type="text" 
                placeholder="000000" 
                maxLength={6} 
                required 
                value={otpCode} 
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g,''))} 
                style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.25rem', fontWeight: 800 }} 
                autoComplete="one-time-code"
              />
            </div>
            {isResettingPassword && (
              <div className="input-group" style={{ marginTop: '1rem' }}>
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="New Password" 
                  required 
                  readOnly={loading} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  autoComplete="new-password"
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
        <h2 className="drawer-logo">BAZETWO BARBERS</h2>
      </div>

      <div className="drawer-content">
        <div className="auth-header-snippet">
          <h3>{isForgotPassword ? 'Recover Access' : isLogin ? 'Welcome Back' : 'Join the Elite'}</h3>
          <p>{isForgotPassword ? 'Enter your email to request an unlock ritual.' : isLogin ? 'Sign in to manage your bookings.' : 'Create an account for the full experience.'}</p>
        </div>

        {!isForgotPassword && (
          <div className="auth-tabs mini-tabs">
            <button className={isLogin ? 'active' : ''} onClick={() => toggleMode(true)} disabled={loading}>Login</button>
            <button className={!isLogin ? 'active' : ''} onClick={() => toggleMode(false)} disabled={loading}>Register</button>
          </div>
        )}

        <form className="auth-form drawer-form" onSubmit={isForgotPassword ? handleForgotPasswordSubmit : handleAuth} autoComplete="off">
          {!isLogin && !isForgotPassword && (
            <div className="input-group">
              <User size={18} className="input-icon" />
              <input type="text" placeholder="Full Name" required readOnly={loading} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
          )}
          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input type="email" placeholder="Email Address" required readOnly={loading} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          {!isForgotPassword && (
            <div className="input-group">
              <Lock size={18} className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                required 
                readOnly={loading} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                autoComplete={isLogin ? "current-password" : "new-password"} 
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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

        <div id="googleAuthDiv" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', width: '100%', minHeight: '40px', position: 'relative' }}>
          <div className="google-btn-placeholder">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="google-icon-svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.5 24c0-1.55-.15-3.24-.47-4.77H24v9.03h12.75c-.53 2.87-2.14 5.3-4.57 6.93l7.1 5.5C43.43 36.57 46.5 30.77 46.5 24z"></path>
              <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.1-5.5c-2.2 1.49-5.01 2.31-8.79 2.31-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            <span className="google-btn-text">Continue with Google</span>
          </div>
        </div>

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
