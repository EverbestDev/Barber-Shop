import React from 'react';
import { motion } from 'framer-motion';
import './Legal.css';

const Privacy: React.FC = () => {
  return (
    <div className="legal-page-wrapper">
      <section className="legal-hero">
        <div className="legal-container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="legal-title"
          >
            PRIVACY <br /> <span className="text-gold">POLICY</span>
          </motion.h1>
          <p className="legal-desc">Your privacy is our priority. This policy outlines how we handle your data.</p>
        </div>
      </section>

      <section className="legal-content-section">
        <div className="legal-container">
          <div className="legal-content-intro">
            <h3>Our approach to your data</h3>
            <p>At Baze 2 Barbers, we respect your privacy and are committed to protecting your personal data. This policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</p>
          </div>

          <div className="legal-text-block">
            <h3>1. Data Collection</h3>
            <p>We collect essential information to facilitate your bookings, such as your name, phone number, email address, and payment details.</p>

            <h3>2. Purpose of Collection</h3>
            <p>Your data is used to confirm appointments, provide status updates, manage loyalty rewards, and occasionally send promotional materials if you've opted in.</p>

            <h3>3. Third-Party Sharing</h3>
            <p>We do not sell our customers' data. Information is shared with payment processors (like Stripe) and booking management systems solely for service fulfillment.</p>

            <h3>4. Security Measures</h3>
            <p>All sensitive information, including payment and contact details, is encrypted via industry-standard protocols to prevent unauthorized access.</p>

            <h3>5. Cookies</h3>
            <p>Our website uses cookies to improve navigation and remember your preferences for future visits. Please see our Cookie Policy for more details.</p>

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
