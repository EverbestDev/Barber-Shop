import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500); // Slight delay for entry
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
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
