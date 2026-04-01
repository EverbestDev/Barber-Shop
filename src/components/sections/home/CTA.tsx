import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './CTA.css';

interface CTAProps {
  onAuthOpen?: () => void;
}

const CTA: React.FC<CTAProps> = ({ onAuthOpen }) => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  
  const isBookingPage = location.pathname === '/booking';
  const isContactPage = location.pathname === '/contact';

  return (
    <section className="cta-section">
      <div className="cta-overlay"></div>
      <div className="cta-bg-image">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="cta-bg-video"
        >
          <source src="/videos/homectavideo.mp4" type="video/mp4" />
        </video>
      </div>
      
      <div className="cta-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {isBookingPage ? (
            <>
              <h2 className="cta-title">Maximize Your Experience</h2>
              <p className="cta-subtitle">
                Did you know? Logging in allows you to track your appointments, earn loyalty points, and secure your favorite barber faster.
              </p>
              <div className="cta-actions">
                {!isLoggedIn ? (
                  <button onClick={onAuthOpen} className="btn-filled">Login / Register</button>
                ) : (
                  <Link to="/dashboard" className="btn-filled">Go to Dashboard</Link>
                )}
                <Link to="/contact" className="btn-outlined">Contact Support</Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="cta-title">Ready for Your New Look?</h2>
              <p className="cta-subtitle">
                Secure your slot with our master barbers today. Join the community of sharp-looking men in Catford.
              </p>
              <div className="cta-actions">
                <Link to="/booking" className="btn-filled">Book Your Chair</Link>
                {!isContactPage && <Link to="/contact" className="btn-outlined">Contact Us</Link>}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
