import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { updateCurrentUser } from '../../../api/auth';
import './CookieConsent.css';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isLoggedIn, user, login } = useAuth();

  useEffect(() => {
    const localConsent = localStorage.getItem('cookie-consent');
    
    // If logged in and already consented on server, don't show
    if (isLoggedIn && user?.cookie_consent) {
      setIsVisible(false);
      return;
    }

    if (!localConsent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, user]);

  const handleAccept = async () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);

    if (isLoggedIn && user) {
      try {
        const updated = await updateCurrentUser({ cookie_consent: true });
        login(updated); // Refresh context user data
      } catch (err) {
        console.error("Failed to sync cookie consent:", err);
      }
    }
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="cookie-consent-banner"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="cookie-container">
            <div className="cookie-content">
              <div className="cookie-icon-wrapper">
                <ShieldAlert className="cookie-icon" />
              </div>
              <div className="cookie-text">
                <h3>COOKIE SETTINGS</h3>
                <p>
                  We use cookies to enhance your experience, analyze our traffic, and for security. 
                  Read our <Link to="/cookie" className="cookie-link">Cookie Policy</Link> for details.
                </p>
              </div>
            </div>
            
            <div className="cookie-actions">
              <button 
                className="btn-outlined cookie-reject-btn"
                onClick={handleReject}
              >
                Reject All
              </button>
              <button 
                className="btn-filled cookie-accept-btn"
                onClick={handleAccept}
              >
                Accept All
              </button>
            </div>

            <button className="cookie-close-icon" onClick={() => setIsVisible(false)}>
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
