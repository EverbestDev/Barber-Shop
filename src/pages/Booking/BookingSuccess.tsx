import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, ClipboardCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import './BookingSuccess.css';

const BookingSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get('guest') === 'true';

  return (
    <div className="success-page-wrapper">
      <div className="container success-container">
        <motion.div 
          className="success-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="success-icon-main">
            <CheckCircle2 size={80} />
          </div>
          
          <h1 className="success-title">Ritual Secured.</h1>
          <p className="success-subtitle">
            Your chair is officially ready. A digital confirmation has been sent to your ritual email.
          </p>

          <div className="success-summary-grid">
            <div className="summary-item">
              <Calendar size={20} />
              <div className="summary-text">
                <span>Status</span>
                <p>Confirmed & Paid</p>
              </div>
            </div>
            <div className="summary-item">
              <ClipboardCheck size={20} />
              <div className="summary-text">
                <span>Service</span>
                <p>Premium Grooming</p>
              </div>
            </div>
          </div>

          {isGuest && (
            <motion.div 
              className="guest-upgrade-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="upgrade-header">
                <ShieldCheck size={24} className="text-gold" />
                <h3>Elite Member Access</h3>
              </div>
              <p>Since we already have your details, you can track rituals and manage appointments by simply creating a password.</p>
              <div className="upgrade-actions">
                <Link to="/auth?mode=register" className="btn-filled upgrade-btn">
                  Create Password <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          )}

          <div className="success-footer-actions">
            <Link to="/" className="btn-outlined">Return to Studio</Link>
            <Link to="/booking" className="btn-text">Book Another Session</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingSuccess;
