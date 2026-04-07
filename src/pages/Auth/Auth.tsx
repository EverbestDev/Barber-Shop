import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { loginUser, registerUser, fetchCurrentUser } from '../../api/auth';
import toast from 'react-hot-toast';
import './Auth.css';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadToast = toast.loading(isLogin ? "Authenticating ritual..." : "Establishing profile...");
    
    try {
      let response;
      if (isLogin) {
        response = await loginUser({ email, password });
      } else {
        response = await registerUser({ name, email, password });
      }
      
      localStorage.setItem('token', response.access_token);
      const userData = await fetchCurrentUser();
      login(userData);
      
      toast.success(isLogin ? `Welcome back, ${userData.name}. Rituals synchronized.` : "Profile established. Welcome to the family.", { id: loadToast });
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.detail || (err instanceof Error ? err.message : 'Authentication failed');
      toast.error(message, { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-container">
        <div className="auth-visual">
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="visual-logo"
            >
              BAZE 2 BARBERS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="visual-tagline"
            >
              The elite standard of urban grooming. Welcome to the family.
            </motion.p>
          </div>
        </div>

        <div className="auth-content-side">
          <motion.div 
            className="auth-box"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="auth-header">
              <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p>{isLogin ? 'Enter your details to continue.' : 'Join the elite community.'}</p>
            </div>

            <div className="auth-tabs">
              <button 
                className={isLogin ? 'active' : ''} 
                onClick={() => setIsLogin(true)}
                disabled={loading}
              >
                Login
              </button>
              <button 
                className={!isLogin ? 'active' : ''} 
                onClick={() => setIsLogin(false)}
                disabled={loading}
              >
                Register
              </button>
            </div>

            <form className="auth-form" onSubmit={handleAuth}>
              {!isLogin && (
                <div className="input-group">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required 
                    readOnly={loading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div className="input-group">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required 
                  readOnly={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  readOnly={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              {isLogin && <button type="button" className="forgot-pass-btn" disabled={loading}>Forgot Password?</button>}

              <button type="submit" className="btn-filled auth-submit-btn" disabled={loading}>
                {loading ? (
                  <><Loader2 className="spinning-icon-btn" size={18} /> Authenticating...</>
                ) : (
                  <>{isLogin ? 'Log In' : 'Sign Up'} <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>Or continue with</span>
            </div>

            <div className="social-auth-btns">
              <button className="social-btn google-btn" disabled={loading}>
                <FaGoogle size={20} /> Continue with Google
              </button>
            </div>

            <div className="auth-footer">
              <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => setIsLogin(!isLogin)} disabled={loading}>
                  {isLogin ? 'Register now' : 'Log in' }
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
