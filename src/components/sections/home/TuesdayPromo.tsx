import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, Video, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import './TuesdayPromo.css';

const TuesdayPromo: React.FC = () => {
  return (
    <section className="tuesday-promo-section section-padding">
      <div className="container">
        <motion.div 
          className="promo-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="promo-badge-container">
            <span className="promo-pill">Weekly Special Event</span>
          </div>
          
          <div className="promo-grid">
            <div className="promo-content">
              <span className="promo-eyebrow">Outreach Event</span>
              <h2 className="promo-title">
                Tuesday Free <span className="text-gold">Grooming</span>
              </h2>
              <p className="promo-description">
                Experience our signature grooming session entirely free of charge. In the spirit of community outreach, we select patrons every Tuesday for free walk-in grooming sessions.
              </p>
              
              <ul className="promo-rules-list">
                <li>
                  <CheckCircle2 size={18} className="text-gold" />
                  <span><strong>100% Free:</strong> No hidden charges, tips are optional.</span>
                </li>
                <li>
                  <CheckCircle2 size={18} className="text-gold" />
                  <span><strong>Walk-In Only Services:</strong> Select cuts and trims.</span>
                </li>
                <li>
                  <CheckCircle2 size={18} className="text-gold" />
                  <span><strong>Tuesdays Only:</strong> Same-day booking only. No advanced bookings.</span>
                </li>
                <li>
                  <CheckCircle2 size={18} className="text-gold" />
                  <span><strong>Media Recording:</strong> Sessions are audio/video recorded for studio promotion.</span>
                </li>
              </ul>
              
              <div className="promo-action-group">
                <Link to="/booking?promo=free-tuesday" className="btn-filled tuesday-promo-btn">
                  <Gift size={18} /> Book Free Session
                </Link>
                <Link to="/dashboard/promo" className="btn-outlined tuesday-promo-info">
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="promo-visual">
              <div className="promo-visual-card">
                <div className="visual-glare"></div>
                <div className="visual-content">
                  <Sparkles size={36} className="text-gold visual-sparkle" />
                  <h3 className="visual-h3">Tuesday Awoof</h3>
                  <div className="visual-divider"></div>
                  <div className="visual-info-row">
                    <Calendar size={18} className="text-gold" />
                    <span>Every Tuesday: 10AM - 6PM</span>
                  </div>
                  <div className="visual-info-row">
                    <Video size={18} className="text-gold" />
                    <span>Session Recorded for Media</span>
                  </div>
                  <p className="visual-footer-text">
                    *Limited slots available weekly. First-come, first-served basis. Valid registered account required to claim.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TuesdayPromo;
