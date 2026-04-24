import React from 'react';
import { motion } from 'framer-motion';
import './Legal.css';

const Terms: React.FC = () => {
  return (
    <div className="legal-page-wrapper">
      <section className="legal-hero terms-bg">
        <div className="legal-container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="legal-title"
          >
            TERMS <br /> <span className="text-gold">& CONDITIONS</span>
          </motion.h1>
          <p className="legal-desc">Last Updated: April 2026. Please read these terms carefully before using our services.</p>
        </div>
      </section>

      <section className="legal-content-section">
        <div className="legal-container">
          <div className="legal-content-intro">
            <h3>Agreement to our legal terms</h3>
            <p>Welcome to Bazetwo Barbers. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions. These terms govern your relationship with Bazetwo Barbers in relation to this website and our physical location services.</p>
          </div>

          <div className="legal-text-block">
            <h3>1. Introduction</h3>
            <p>Welcome to Bazetwo Barbers. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.</p>

            <h3>2. Booking & Appointments</h3>
            <p>All bookings made through our platform are subject to availability. We reserve the right to reschedule or decline bookings if necessary. Customers are expected to arrive at least 5 minutes before their scheduled slot.</p>

            <h3>3. Late Arrivals & No-Shows</h3>
            <p>Late arrivals beyond 15 minutes may result in an automatic cancellation or a simplified service to stay on schedule. No-shows without prior notice will forfeit their deposit and may be restricted from future online bookings.</p>

            <h3>4. Conduct</h3>
            <p>We maintain a professional and welcoming environment. Any form of harassment, discrimination, or inappropriate behavior towards our staff or other clients will result in immediate removal from the premises and termination of service without refund.</p>

            <h3>5. Modifications to Service</h3>
            <p>We reserve the right to modify our service prices, availability, and operating hours at any time without prior notice.</p>

            <h3>6. Liability</h3>
            <p>Bazetwo Barbers is not responsible for any personal belongings left on the premises or any allergic reactions to products if potential allergies were not disclosed prior to the service.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
