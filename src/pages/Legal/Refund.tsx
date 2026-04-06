import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import './Legal.css';

const Refund: React.FC = () => {
  return (
    <div className="legal-page-wrapper">
      <section className="legal-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="legal-title text-gold"
          >
            REFUND & CANCELLATION
          </motion.h1>
          <p className="refund-desc">Everything you need to know about deposits and refunds.</p>
        </div>
      </section>

      <section className="legal-content-section section-padding">
        <div className="container narrow-container">
          <div className="legal-card bounce-on-hover">
            <div className="legal-icon-box"><CreditCard size={32} /></div>
            
            <h3>1. Deposit Requirement</h3>
            <p>To ensure our master barbers' time is respected, we require a 50% non-refundable deposit for all premium grooming services booked online.</p>

            <h3>2. Rescheduling Policy</h3>
            <p>We offer a 24-hour grace period for rescheduling. Reschedules made at least 24 hours in advance will carry the deposit over to the new appointment.</p>

            <h3>3. Late Cancellations</h3>
            <p>Cancellations made within 24 hours of the appointment time will result in forfeiture of the deposit to compensate for lost professional time.</p>

            <h3>4. Full Refunds</h3>
            <p>Full refunds (including the deposit) are only issued in the rare event of a service cancellation on our side due to staffing or technical issues.</p>

            <h3>5. No-Show Policy</h3>
            <p>Failure to arrive without prior notification (No-Show) will result in full deposit forfeiture. Recurring no-shows may be permanently barred from taking online appointments.</p>

            <h3>6. Service Satisfaction</h3>
            <p>While we don't offer standard refunds for completed grooming services, your satisfaction is paramount. If you are not satisfied with your service, please notify us before leaving the chair so we can fix it.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Refund;
