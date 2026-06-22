import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Gift, Video, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { fetchPromoBookedSlots } from '../../../api/bookings';
import './TuesdayPromo.css';

const TuesdayPromo: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const { onAuthOpen } = useOutletContext<{ onAuthOpen: () => void }>();

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      if (user?.role === 'admin') {
        navigate('/dashboard/promo-bookings');
      } else {
        navigate('/dashboard/promo');
      }
    } else {
      sessionStorage.setItem('redirectAfterAuth', '/dashboard/promo');
      onAuthOpen();
    }
  };

  const [promoStatus, setPromoStatus] = useState<string>('CLOSED');
  const [countdownText, setCountdownText] = useState<string>('00d : 00h : 00m : 00s');
  const [isFullyBooked, setIsFullyBooked] = useState<boolean>(false);

  const getNextActiveTimeText = () => {
    const now = new Date();
    
    // Find current date and weekday relative to London time
    const weekdayName = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Europe/London' }).format(now);
    const londonHourStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' }).format(now);
    const lHour = parseInt(londonHourStr, 10);
    
    const weekdayMap: Record<string, number> = {
      'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4, 'Saturday': 5, 'Sunday': 6
    };
    const lWeekday = weekdayMap[weekdayName] ?? 0;
    
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

    // If window is open (not Tuesday) and not fully booked, it's live!
    if (lWeekday !== 1 && !isFullyBooked) {
      return { status: 'LIVE', text: 'ACTIVE NOW' };
    }

    // Otherwise, we are closed (either because it is Tuesday or all slots are booked)
    // We countdown to the next Wednesday 12:00 AM (00:00:00)
    let daysToWednesday = 0;
    if (lWeekday === 0 || lWeekday === 1) {
      daysToWednesday = 2 - lWeekday;
    } else {
      daysToWednesday = 9 - lWeekday;
    }

    const targetUTC = Date.UTC(lYear, lMonth, lDay + daysToWednesday, 0, 0, 0);
    const diffMs = targetUTC - lCurrentUTC;

    if (diffMs <= 0) {
      return { status: 'LIVE', text: 'ACTIVE NOW' };
    }

    const totalSecs = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');
    return {
      status: isFullyBooked ? 'ALL BOOKED' : 'CLOSED',
      text: `${pad(days)}d : ${pad(hours)}h : ${pad(mins)}m : ${pad(secs)}s`
    };
  };

  useEffect(() => {
    const checkBookingSlots = async () => {
      try {
        const res = await fetchPromoBookedSlots();
        const promoSlots = ["12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];
        const allTaken = promoSlots.every(slot => res.booked_slots.includes(slot));
        setIsFullyBooked(allTaken);
      } catch (err) {
        console.error("Error checking promo slots:", err);
      }
    };
    checkBookingSlots();
  }, []);

  useEffect(() => {
    const updateNextActive = () => {
      const res = getNextActiveTimeText();
      setCountdownText(res.text);
      setPromoStatus(res.status);
    };
    updateNextActive();
    const interval = setInterval(updateNextActive, 1000);
    return () => clearInterval(interval);
  }, [isFullyBooked]);

  return (
    <section id="tuesday-promo" className="tuesday-promo-section section-padding">
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
                  <span><strong>Tuesdays Only:</strong> Free Tuesday sessions run on Tuesdays. Booking is open in advance from Wednesday 12:00 AM to Monday 11:59 PM.</span>
                </li>
                <li>
                  <CheckCircle2 size={18} className="text-gold" />
                  <span><strong>Media Recording:</strong> Sessions are audio/video recorded for studio promotion.</span>
                </li>
              </ul>
              
              <div className="promo-action-group">
                <button 
                  onClick={handleBookClick} 
                  disabled={promoStatus !== 'LIVE'} 
                  className="btn-filled tuesday-promo-btn" 
                  style={{ 
                    cursor: promoStatus === 'LIVE' ? 'pointer' : 'not-allowed',
                    opacity: promoStatus === 'LIVE' ? 1 : 0.5
                  }}
                >
                  <Gift size={18} /> {promoStatus === 'ALL BOOKED' ? 'All Slots Claimed' : promoStatus === 'CLOSED' ? 'Window Closed' : 'Book Free Session'}
                </button>
                <button 
                  onClick={handleBookClick} 
                  disabled={promoStatus !== 'LIVE'} 
                  className="btn-outlined tuesday-promo-info" 
                  style={{ 
                    cursor: promoStatus === 'LIVE' ? 'pointer' : 'not-allowed',
                    opacity: promoStatus === 'LIVE' ? 1 : 0.5
                  }}
                >
                  Learn More
                </button>
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
                    <span>Every Tuesday: 10AM - 7PM</span>
                  </div>
                  <div className="visual-info-row">
                    <Video size={18} className="text-gold" />
                    <span>Session Recorded for Media</span>
                  </div>

                  <div className="visual-countdown-wrapper">
                    <div className="visual-status-row">
                      <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                      <span className={`visual-status-badge ${promoStatus === 'LIVE' ? 'live' : 'closed'}`}>
                        {promoStatus}
                      </span>
                    </div>
                    {promoStatus !== 'LIVE' && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8a8678', marginBottom: '2px' }}>
                          {promoStatus === 'ALL BOOKED' ? 'Next Booking Opens In' : 'Next Active In'}
                        </span>
                        <div className="visual-countdown-time">{countdownText}</div>
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
