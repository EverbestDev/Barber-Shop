import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, fetchCurrentUser } from '../../../api/auth';
import './AuthDrawer.css';

interface AuthDrawerProps {
  onClose: () => void;
}

const AuthDrawer: React.FC<AuthDrawerProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
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
      onClose();
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      alert((err as { response?: { data?: { detail?: string } } }).response?.data?.detail || message);
    }
  };

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
          <h3>{isLogin ? 'Welcome Back' : 'Join the Elite'}</h3>
          <p>{isLogin ? 'Sign in to manage your bookings.' : 'Create an account for the full experience.'}</p>
        </div>

        <div className="auth-tabs mini-tabs">
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Register</button>
        </div>

        <form className="auth-form drawer-form" onSubmit={handleAuth}>
          {!isLogin && (
            <div className="input-group">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn-filled auth-submit-btn">
            {isLogin ? 'Log In' : 'Sign Up'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        <button className="social-btn google-btn">
          <FaGoogle size={20} /> Google
        </button>

        <p className="drawer-footer-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default AuthDrawer;
