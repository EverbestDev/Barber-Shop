import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './CTA.css';

const CTA: React.FC = () => {
  return (
    <section className="cta-section">
      <div className="cta-overlay"></div>
      <div className="cta-bg-image">
        <img src="https://images.unsplash.com/photo-1512592534063-8aee09da4cbb?q=80&w=2000&auto=format&fit=crop" alt="CTA Background" />
      </div>
      
      <div className="cta-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="cta-title">Ready for Your New Look?</h2>
          <p className="cta-subtitle">
            Secure your slot with our master barbers today. Join the community of sharp-looking men in Catford.
          </p>
          <div className="cta-actions">
            <Link to="/booking" className="btn-filled">Book Your Chair</Link>
            <Link to="/contact" className="btn-outlined">Contact Us</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
