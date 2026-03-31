import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import './Auth.css';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    login({ name: 'John Doe', email: 'john@example.com' });
    navigate('/profile');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-container">
        
        {/* Left Side: Visual/Branding */}
        <div className="auth-visual">
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="visual-logo"
            >
              BAZE 2 BARBERS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="visual-tagline"
            >
              The elite standard of urban grooming. Welcome to the family.
            </motion.p>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="auth-content-side">
          <motion.div 
            className="auth-box"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="auth-header">
              <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p>{isLogin ? 'Enter your details to continue.' : 'Join the elite community.'}</p>
            </div>

            <div className="auth-tabs">
              <button 
                className={isLogin ? 'active' : ''} 
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button 
                className={!isLogin ? 'active' : ''} 
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>

            <form className="auth-form" onSubmit={handleAuth}>
              {!isLogin && (
                <div className="input-group">
                  <User size={18} className="input-icon" />
                  <input type="text" placeholder="Full Name" required />
                </div>
              )}
              <div className="input-group">
                <Mail size={18} className="input-icon" />
                <input type="email" placeholder="Email Address" required />
              </div>
              <div className="input-group">
                <Lock size={18} className="input-icon" />
                <input type="password" placeholder="Password" required />
              </div>
              
              {isLogin && <button type="button" className="forgot-pass-btn">Forgot Password?</button>}

              <button type="submit" className="btn-filled auth-submit-btn">
                {isLogin ? 'Log In' : 'Sign Up'} <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-divider">
              <span>Or continue with</span>
            </div>

            <div className="social-auth-btns">
              <button className="social-btn google-btn">
                <FaGoogle size={20} /> Continue with Google
              </button>
            </div>

            <p className="auth-footer">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Register now' : 'Log in' }
              </button>
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
