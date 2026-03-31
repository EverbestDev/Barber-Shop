import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
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
      <div className="container auth-container">
        
        <motion.div 
          className="auth-box"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{isLogin ? 'Enter your details to continue your grooming journey.' : 'Join the elite community of Baze 2 Barbers.'}</p>
          </div>

          <div className="auth-tabs">
            <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
            <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Register</button>
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
            <button className="social-btn"><FaGoogle size={20} /> Google</button>
            <button className="social-btn"><FaGithub size={20} /> Github</button>
          </div>

          <p className="auth-footer">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Create one' : 'Log in'}</button>
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default Auth;
