import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, Video, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import './TuesdayPromo.css';

const TuesdayPromo: React.FC = () => {
  const [nextActiveText, setNextActiveText] = useState<string>('00d : 00h : 00m : 00s');
  const [nextActiveIsActive, setNextActiveIsActive] = useState<boolean>(false);

  const getNextActiveTimeText = () => {
    const now = new Date();
    
    // Find current date and weekday relative to London time
    const weekdayName = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Europe/London' }).format(now);
    const londonHourStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' }).format(now);
    const lHour = parseInt(londonHourStr, 10);
    
    const weekdayMap: Record<string, number> = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };
    const lWeekday = weekdayMap[weekdayName] ?? now.getDay();
    
    // Compute London's local year, month, day, min, sec for accurate math
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/London',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const getPartVal = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
    
    const lYear = getPartVal('year');
    const lMonth = getPartVal('month') - 1;
    const lDay = getPartVal('day');
    const lMin = getPartVal('minute');
    const lSec = getPartVal('second');

    const lCurrentUTC = Date.UTC(lYear, lMonth, lDay, lHour, lMin, lSec);

    // Days until next Tuesday (Tuesday = 2)
    let daysUntilTuesday = (2 - lWeekday + 7) % 7;

    let isActive = false;
    if (lWeekday === 2) {
      if (lHour < 10) {
        daysUntilTuesday = 0;
      } else if (lHour >= 18) {
        daysUntilTuesday = 7;
      } else {
        isActive = true;
      }
    }

    if (isActive) {
      return { isActive: true, text: 'ACTIVE NOW' };
    }

    // Target date: next Tuesday at 10:00:00 London local time
    const targetUTC = Date.UTC(lYear, lMonth, lDay + daysUntilTuesday, 10, 0, 0);
    const diffMs = targetUTC - lCurrentUTC;

    if (diffMs <= 0) {
      return { isActive: true, text: 'ACTIVE NOW' };
    }

    const totalSecs = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');
    return {
      isActive: false,
      text: `${pad(days)}d : ${pad(hours)}h : ${pad(mins)}m : ${pad(secs)}s`
    };
  };

  useEffect(() => {
    const updateNextActive = () => {
      const res = getNextActiveTimeText();
      setNextActiveText(res.text);
      setNextActiveIsActive(res.isActive);
    };
    updateNextActive();
    const interval = setInterval(updateNextActive, 1000);
    return () => clearInterval(interval);
  }, []);

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

                  <div className="visual-countdown-wrapper">
                    <div className="visual-status-row">
                      <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                      <span className={`visual-status-badge ${nextActiveIsActive ? 'live' : 'closed'}`}>
                        {nextActiveIsActive ? 'LIVE' : 'CLOSED'}
                      </span>
                    </div>
                    {!nextActiveIsActive && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8a8678', marginBottom: '2px' }}>Next Active In</span>
                        <div className="visual-countdown-time">{nextActiveText}</div>
                      </div>
                    )}
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
