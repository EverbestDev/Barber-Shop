import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import './Legal.css';

const Privacy: React.FC = () => {
  return (
    <div className="legal-page-wrapper">
      <section className="legal-hero">
        <div className="legal-container">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="legal-title text-gold"
          >
            PRIVACY <br /> POLICY
          </motion.h1>
          <p className="privacy-desc">Your privacy is our priority. This policy outlines how we handle your data.</p>
        </div>
      </section>

      <section className="legal-content-section section-padding">
        <div className="container narrow-container">
          <div className="legal-card">
            <div className="legal-icon-box"><Lock size={32} /></div>
            
            <h3>1. Data Collection</h3>
            <p>We collect essential information to facilitate your bookings, such as your name, phone number, email address, and payment details.</p>

            <h3>2. Purpose of Collection</h3>
            <p>Your data is used to confirm appointments, provide status updates, manage loyalty rewards, and occasionally send promotional materials if you've opted in.</p>

            <h3>3. Third-Party Sharing</h3>
            <p>We do not sell our customers' data. Information is shared with payment processors (like Stripe) and booking management systems solely for service fulfillment.</p>

            <h3>4. Security Measures</h3>
            <p>All sensitive information, including payment and contact details, is encrypted via industry-standard protocols to prevent unauthorized access.</p>

            <h3>5. Cookies</h3>
            <p>Our website uses cookies to improve navigation and remember your preferences for future visits.</p>

            <h3>6. Your Rights</h3>
            <p>You have the right to request access to, deletion of, or correction of any personal information we hold about you. Contact our support team for any such requests.</p>

            <h3>7. Updates</h3>
            <p>We may update this policy periodically. Any significant changes will be notified via our website or email.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
