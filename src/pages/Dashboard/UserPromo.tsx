import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Check, Loader2, Video, Calendar, Clock, Sparkles, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createBooking, fetchMyBookings, fetchPromoBookedSlots } from '../../api/bookings';
import { updateCurrentUser } from '../../api/auth';
import { getSafeId } from '../../utils/ids';
import type { Booking } from '../../api/types';
import { downloadReceiptPDF } from '../../utils/receipt';
import toast from 'react-hot-toast';
import './Dashboard.css';

interface Service {
  id: number;
  name: string;
  duration: string;
}

const walkInServices: Service[] = [
  { id: 1, name: 'Signature Haircut', duration: '45m' },
  { id: 2, name: 'Skin Fade', duration: '60m' },
  { id: 3, name: 'Beard Sculpture', duration: '30m' },
  { id: 5, name: 'Buzz Cut', duration: '20m' },
  { id: 9, name: 'Shape Up (Lineup)', duration: '20m' },
  { id: 11, name: 'Beard Line-up', duration: '15m' },
  { id: 12, name: 'Hot Towel Shave', duration: '45m' }
];

const allTimeSlots = [
  '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', 
  '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
];

const getTargetTuesdayStr = () => {
  const now = new Date();
  const weekdayName = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Europe/London' }).format(now);
  
  const weekdayMap: Record<string, number> = {
    'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4, 'Saturday': 5, 'Sunday': 6
  };
  const lWeekday = weekdayMap[weekdayName] ?? 0;
  
  const daysToTuesday = (1 - lWeekday + 7) % 7;
  const targetDate = new Date(now.getTime() + daysToTuesday * 24 * 60 * 60 * 1000);
  
  return new Intl.DateTimeFormat('en-CA', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    timeZone: 'Europe/London' 
  }).format(targetDate);
};

const UserPromo: React.FC = () => {
  const { user, login } = useAuth();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [recordingConsent, setRecordingConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittingSub, setSubmittingSub] = useState(false);

  const handleToggleSubscription = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const checked = e.target.checked;
    setSubmittingSub(true);
    try {
      const updatedInfo = await updateCurrentUser({ tuesday_promo_subscribed: checked });
      login({
        ...user,
        tuesday_promo_subscribed: updatedInfo.tuesday_promo_subscribed
      });
      toast.success(checked ? "Subscribed to Tuesday Promo reminders!" : "Unsubscribed from Tuesday Promo reminders.");
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      console.error(error);
      toast.error(error.response?.data?.detail || error.message || "Failed to update subscription preference.");
    } finally {
      setSubmittingSub(false);
    }
  };

  const [activePromoBooking, setActivePromoBooking] = useState<Booking | null>(null);
  const [fetchingActive, setFetchingActive] = useState(true);
  const [completedPromoCount, setCompletedPromoCount] = useState<number>(0);
  const [countdownText, setCountdownText] = useState<string>('No Active Session');

  const [nextActiveText, setNextActiveText] = useState<string>('00d : 00h : 00m : 00s');
  const [bookedPromoSlots, setBookedPromoSlots] = useState<string[]>([]);

  const todayObj = new Date();

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
      return { isActive: true, text: '00d : 00h : 00m : 00s' };
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
    };
    updateNextActive();
    const interval = setInterval(updateNextActive, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Compute date and weekday relative to the UK shop's timezone (Europe/London)
  const londonDayName = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Europe/London' }).format(todayObj);
  const isBookingWindowOpen = londonDayName !== 'Tuesday';

  const targetTuesdayStr = getTargetTuesdayStr();

  useEffect(() => {
    const checkActivePromo = async () => {
      try {
        const bookings = await fetchMyBookings();
        const promoToday = bookings.find(b => 
          b.is_free_promo && 
          b.date.startsWith(targetTuesdayStr) && 
          b.status !== 'cancelled'
        );
        if (promoToday) {
          setActivePromoBooking(promoToday);
        }
        const completedCount = (bookings || []).filter(b => b.is_free_promo && b.status === 'completed').length;
        setCompletedPromoCount(completedCount);

        // Fetch booked slots
        const slotsRes = await fetchPromoBookedSlots();
        setBookedPromoSlots(slotsRes.booked_slots);
      } catch (err) {
        console.error("Error checking active promo bookings:", err);
      } finally {
        setFetchingActive(false);
      }
    };
    if (user) {
      checkActivePromo();
    } else {
      setFetchingActive(false);
    }
  }, [user, targetTuesdayStr]);

  useEffect(() => {
    if (!activePromoBooking) {
      setCountdownText('No Active Session');
      return;
    }
    if (activePromoBooking.status === 'completed') {
      setCountdownText('Ritual Completed');
      return;
    }
    if (activePromoBooking.status === 'expired') {
      setCountdownText('Awoof Expired');
      return;
    }
    if (activePromoBooking.status === 'cancelled') {
      setCountdownText('Cancelled');
      return;
    }

    const targetTime = new Date(activePromoBooking.date).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setCountdownText('Session Started');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const hourPart = hours > 0 ? `${hours}h ` : '';
      setCountdownText(`${hourPart}${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [activePromoBooking]);

  const isPromoFullyBooked = ["12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"].every(slot => bookedPromoSlots.includes(slot));

  const handleBookingSubmit = async () => {
    if (!isBookingWindowOpen) {
      toast.error("Free Tuesday Grooming can only be booked during the active window.");
      return;
    }
    if (isPromoFullyBooked) {
      toast.error("All slots for the upcoming Tuesday have already been booked.");
      return;
    }
    if (!selectedService) {
      toast.error("Please choose a walk-in service.");
      return;
    }
    if (!selectedTime) {
      toast.error("Please choose an appointment time.");
      return;
    }
    if (!recordingConsent) {
      toast.error("Media recording consent is required.");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Securing your free Tuesday slot...");
    try {
      const [timeStr, modifier] = selectedTime.split(' ');
      const timeParts = timeStr.split(':').map(Number);
      let hour = timeParts[0];
      const min = timeParts[1];
      if (modifier === 'PM' && hour < 12) hour += 12;
      if (modifier === 'AM' && hour === 12) hour = 0;
      
      const formattedTime = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00`;

      const bookingData = {
        service: selectedService.name,
        date: `${targetTuesdayStr}T${formattedTime}`,
        barber: 'Any',
        amount: 0.0,
        is_free_promo: true,
        recording_consent: true
      };

      const newBooking = await createBooking(bookingData);
      const bookingId = getSafeId(newBooking);

      if (!bookingId) {
        throw new Error('Studio ID ritual error. Please contact support.');
      }
      
      toast.success("Free Tuesday session confirmed!", { id: loadingToast });
      window.location.href = `/booking/success?booking_id=${bookingId}`;
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      console.error(error);
      toast.error(error.response?.data?.detail || error.message || "Booking failed. You may already have a booking for this Tuesday.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingActive) {
    return (
      <div className="dashboard-content-main">
        <main className="dashboard-main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          <Loader2 className="spinning-icon text-gold" size={32} />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-content-main">
      <main className="dashboard-main-view">
        <motion.header 
          className="dashboard-header" 
          style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '1.5rem' 
          }} 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="header-greeting">
            <h1>Tuesday Free <span className="text-gold">Grooming</span></h1>
            <p>Exclusive walking outreach promotion for registered studio members.</p>
          </div>
          
          <div className="promo-countdown-wrapper" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end', 
            backgroundColor: 'rgba(20, 20, 20, 0.6)', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            borderRadius: '12px', 
            padding: '0.75rem 1.25rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            minWidth: '220px'
          }}>
            <span style={{ 
              fontSize: '0.65rem', 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              color: 'var(--text-secondary)', 
              fontWeight: 800, 
              marginBottom: '0.25rem' 
            }}>
              Next Active Promo Countdown
            </span>
            <div style={{ 
              fontSize: '1.2rem', 
              fontFamily: 'monospace', 
              fontWeight: 800, 
              color: (isBookingWindowOpen && !isPromoFullyBooked) ? '#2ecc71' : 'var(--gold)', 
              letterSpacing: '0.5px',
              textShadow: (isBookingWindowOpen && !isPromoFullyBooked) ? '0 0 10px rgba(46, 204, 113, 0.3)' : '0 0 10px rgba(212, 175, 55, 0.2)'
            }}>
              {(isBookingWindowOpen && !isPromoFullyBooked) ? 'ACTIVE NOW' : nextActiveText}
            </div>
          </div>
        </motion.header>

        {/* Normal Dashboard Stats Row */}
        <div className="header-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="mini-stat-card">
            <div className="stat-icon-chamber" style={{ color: 'var(--gold)' }}><Gift size={18} /></div>
            <div className="stat-text">
              <span className="stat-label">Promo Status</span>
              <div className="stat-value" style={{ fontSize: '1.2rem', textTransform: 'uppercase', color: activePromoBooking ? (activePromoBooking.status === 'completed' ? '#4caf50' : 'var(--gold)') : 'var(--text-secondary)' }}>
                {activePromoBooking ? (activePromoBooking.status === 'completed' ? 'Checked In' : 'Claimed') : 'Available'}
              </div>
            </div>
          </div>
          <div className="mini-stat-card">
            <div className="stat-icon-chamber" style={{ color: '#4caf50' }}><Check size={18} /></div>
            <div className="stat-text">
              <span className="stat-label">Awoofs Completed</span>
              <div className="stat-value">{completedPromoCount}</div>
            </div>
          </div>
          <div className="mini-stat-card">
            <div className="stat-icon-chamber" style={{ color: '#00bcd4' }}><Clock size={18} /></div>
            <div className="stat-text">
              <span className="stat-label">Session Countdown</span>
              <div className="stat-value" style={{ fontSize: '1.1rem', color: countdownText.includes('m') ? '#00bcd4' : 'var(--text-secondary)' }}>
                {countdownText}
              </div>
            </div>
          </div>
        </div>

        <motion.section className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          
          {/* Rules & Privacy Card */}
          <div className="dashboard-card premium-card-bg">
            <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}><Gift size={20} className="text-gold" /> Promotion Guidelines & Privacy Policy</h2>
            </div>
            <div style={{ lineHeight: '1.7', fontSize: '0.925rem', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p>
                Welcome to <strong>Tuesday Free Grooming</strong>! To build community, reach a larger audience, and showcase our premium studio styles, we host free walk-in grooming sessions every Tuesday.
              </p>
              <div style={{ background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.15)', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ color: 'var(--gold)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Promotional Conditions:</h4>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li><strong>Active Membership:</strong> You must have a registered and verified email account to book (Currently signed in as <strong>{user?.name}</strong>).</li>
                  <li><strong>Same-Day Tuesdays Only:</strong> Booking is only active on Tuesdays. Advanced booking is strictly disabled.</li>
                  <li><strong>Walk-In Services Only:</strong> Choose from select shop-floor cuts and trims. Home service visits and group packages are excluded.</li>
                  <li><strong>Booking Limit:</strong> Maximum of one Free Tuesday slot per member per week.</li>
                  <li><strong>Marketing Recording:</strong> <span className="text-gold">Your session will be video and audio recorded.</span> Footages are utilized for studio marketing, social media reels, and publicity.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Subscription Preferences Card */}
          <div className="dashboard-card premium-card-bg" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Sparkles size={20} className="text-gold" /> Tuesday Promo Subscriptions
              </h2>
            </div>
            <div style={{ lineHeight: '1.7', fontSize: '0.925rem', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p>
                Take control of your Tuesday Promo notifications. Turn reminders on or off for opening schedules and session nudges.
              </p>
              <div style={{ padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px', backgroundColor: 'var(--primary)' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    id="tuesday-promo-subscribe"
                    type="checkbox" 
                    checked={user?.tuesday_promo_subscribed !== false} 
                    onChange={handleToggleSubscription}
                    disabled={submittingSub}
                    style={{ accentColor: 'var(--gold)', scale: '1.2', cursor: 'pointer' }}
                  />
                  <label htmlFor="tuesday-promo-subscribe" style={{ fontSize: '0.9rem', color: '#fff', cursor: 'pointer', userSelect: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <strong>Subscribe to updates & reminders</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Get notified when booking windows open, plus automated 30-minute arrival reminders.
                    </span>
                  </label>
                  {submittingSub && <Loader2 className="spinning-icon text-gold" size={16} style={{ marginLeft: 'auto' }} />}
                </div>
              </div>
            </div>
          </div>

          {/* Active Promo Claimed Card (MTN Awoof Tuesday style) */}
          {activePromoBooking && activePromoBooking.status === 'completed' ? (
            <div className="dashboard-card premium-card-bg" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', border: '1px solid rgba(46, 204, 113, 0.3)', boxShadow: '0 8px 32px rgba(46, 204, 113, 0.05)', borderRadius: '12px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(46, 204, 113, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check style={{ color: '#2ecc71' }} size={40} />
              </div>
              <div>
                <h2 style={{ color: '#2ecc71', margin: '0 0 0.75rem', fontSize: '1.75rem', letterSpacing: '0.5px' }}>
                  Grooming Complete
                </h2>
                <p style={{ color: '#ccc', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.75rem', lineHeight: '1.6' }}>
                  Thank you for participating in our community outreach! We hope you love your new signature style. Your session has been successfully completed and checked in. Stay sharp!
                </p>
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '1.25rem 2rem',
                  display: 'inline-block'
                }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Next Booking Cycle Opens In</span>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontFamily: 'monospace', 
                    fontWeight: 900, 
                    color: 'var(--gold)',
                    letterSpacing: '1px'
                  }}>
                    {nextActiveText}
                  </div>
                </div>
              </div>
            </div>
          ) : activePromoBooking ? (
            <div className="dashboard-card premium-card-bg" style={{ border: activePromoBooking.status === 'expired' ? '1px solid rgba(231, 76, 60, 0.3)' : '1px solid rgba(212, 175, 55, 0.3)', boxShadow: activePromoBooking.status === 'expired' ? '0 8px 32px rgba(231, 76, 60, 0.05)' : '0 8px 32px rgba(212, 175, 55, 0.15)' }}>
              <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ backgroundColor: activePromoBooking.status === 'expired' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(212, 175, 55, 0.1)', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {activePromoBooking.status === 'expired' ? (
                    <XCircle style={{ color: '#e74c3c' }} size={24} />
                  ) : (
                    <Sparkles className="text-gold" size={24} style={{ animation: 'pulse 2s infinite' }} />
                  )}
                </div>
                <div>
                  <h2 style={{ margin: 0 }}>
                    {activePromoBooking.status === 'expired' ? 'Tuesday Awoof Expired' : 'Tuesday Awoof Secured'}
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {activePromoBooking.status === 'expired'
                      ? 'This booking has expired because you did not check in on time.'
                      : 'You have successfully claimed your free walk-in session for today!'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Patron:</span>
                      <strong style={{ fontSize: '0.85rem' }}>{activePromoBooking.guest_name || user?.name || 'Registered Patron'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Groom Type:</span>
                      <strong style={{ fontSize: '0.85rem' }}>{activePromoBooking.service}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Date:</span>
                      <strong style={{ fontSize: '0.85rem' }}>{new Date(activePromoBooking.date).toLocaleDateString([], { dateStyle: 'long' })}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Time Schedule:</span>
                      <strong style={{ fontSize: '0.85rem' }}>{new Date(activePromoBooking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Booked On:</span>
                      <strong style={{ fontSize: '0.85rem' }}>{activePromoBooking.created_at ? new Date(activePromoBooking.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Session Status:</span>
                      <span className={`status-badge ${activePromoBooking.status}`} style={{ fontSize: '0.7rem' }}>{activePromoBooking.status}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={() => downloadReceiptPDF(activePromoBooking)}
                      className="btn-outlined-studio" 
                      style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem', fontWeight: 700, borderRadius: '6px' }}
                    >
                      Download PDF
                    </button>
                    <a 
                      href={`/booking/success?booking_id=${getSafeId(activePromoBooking)}`}
                      className="btn-filled-studio"
                      style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem', fontWeight: 700, borderRadius: '6px', textAlign: 'center', textDecoration: 'none', backgroundColor: 'var(--gold)', color: 'var(--primary)' }}
                    >
                      View Receipt
                    </a>
                  </div>
                </div>

                {activePromoBooking.status === 'expired' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(231, 76, 60, 0.02)', border: '1px dashed rgba(231, 76, 60, 0.15)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(231, 76, 60, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                      <XCircle style={{ color: '#e74c3c' }} size={32} />
                    </div>
                    <strong style={{ color: '#e74c3c', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                      Code Deactivated
                    </strong>
                    <p style={{ color: '#ccc', fontSize: '0.75rem', marginTop: '6px', maxWidth: '220px', margin: '6px auto 0', lineHeight: '1.4' }}>
                      This check-in code has expired and can no longer be used.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
                    <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', display: 'inline-block' }}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${activePromoBooking.check_in_code}`} 
                        style={{ width: '150px', height: '150px', display: 'block' }} 
                        alt={activePromoBooking.check_in_code} 
                      />
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '1.5px', fontWeight: 'bold', marginTop: '1rem' }}>SCAN ON ARRIVAL</span>
                    <strong style={{ fontSize: '1.25rem', color: '#fff', marginTop: '0.25rem', letterSpacing: '1px', fontFamily: 'monospace' }}>
                      {activePromoBooking.check_in_code}
                    </strong>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="dashboard-card premium-card-bg" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <div className="card-header" style={{ marginBottom: '1.5rem' }}>
                <h2><Calendar size={20} /> Reserve Free Tuesday Slot</h2>
              </div>

              {!isBookingWindowOpen ? (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={30} className="text-gold" />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>Booking Window Closed</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: 0, lineHeight: '1.6' }}>
                      Free Tuesday slots can only be reserved in advance between Wednesday 12:00 AM and Monday 11:59 PM. Please return when the next window opens!
                    </p>
                  </div>
                </div>
              ) : isPromoFullyBooked ? (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={30} className="text-gold" />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>All Slots Claimed</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.25rem', lineHeight: '1.6' }}>
                      All promotional free slots for the upcoming Tuesday have already been booked. Please wait until the next booking window opens to book for the following Tuesday.
                    </p>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      fontFamily: 'monospace', 
                      fontWeight: 800, 
                      color: 'var(--gold)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      Next Booking Opens In: {nextActiveText}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Step 1: Select Service */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 'bold' }}>1. Choose Walk-In Service</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                      {walkInServices.map(s => (
                        <div 
                          key={s.id} 
                          style={{
                            backgroundColor: 'var(--primary)',
                            padding: '1rem 1.25rem',
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: selectedService?.id === s.id ? 'var(--gold)' : 'rgba(255, 255, 255, 0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.2s ease',
                            background: selectedService?.id === s.id ? 'rgba(212, 175, 55, 0.05)' : 'var(--primary)'
                          }}
                          onClick={() => setSelectedService(s)}
                        >
                          <div>
                            <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{s.name}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.duration} duration</span>
                          </div>
                          {selectedService?.id === s.id && <Check size={16} className="text-gold" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Choose Time */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 'bold' }}>2. Select Time Slot (Next Tuesday)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
                      {allTimeSlots.map(t => {
                        const isPromoSlot = ["12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"].includes(t);
                        const isBooked = bookedPromoSlots.includes(t);
                        
                        if (!isPromoSlot || isBooked) {
                          return (
                            <button 
                              key={t}
                              type="button"
                              disabled={true}
                              style={{
                                padding: '0.65rem 0.5rem',
                                borderRadius: '6px',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                color: 'rgba(255, 255, 255, 0.15)',
                                fontWeight: '600',
                                cursor: 'not-allowed',
                                fontSize: '0.8rem',
                                textDecoration: 'line-through',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '2px'
                              }}
                            >
                              <span>{t}</span>
                              <span style={{ fontSize: '0.6rem', color: 'rgba(235, 87, 87, 0.4)', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase' }}>Booked</span>
                            </button>
                          );
                        }

                        return (
                          <button 
                            key={t}
                            type="button"
                            style={{
                              padding: '0.65rem 0.5rem',
                              borderRadius: '6px',
                              border: '1px solid',
                              borderColor: selectedTime === t ? 'var(--gold)' : 'rgba(255, 255, 255, 0.1)',
                              backgroundColor: selectedTime === t ? 'var(--gold)' : 'transparent',
                              color: selectedTime === t ? 'var(--primary)' : 'var(--white)',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                            onClick={() => setSelectedTime(t)}
                          >
                            <span>{t}</span>
                            <span style={{ fontSize: '0.6rem', color: selectedTime === t ? 'var(--primary)' : 'var(--gold)', fontWeight: 'bold', textTransform: 'uppercase' }}>Available</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3: Consent Checkbox */}
                  <div style={{ padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px', backgroundColor: 'var(--primary)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                      <input 
                        id="recording-consent-promo"
                        type="checkbox" 
                        checked={recordingConsent} 
                        onChange={(e) => setRecordingConsent(e.target.checked)}
                        style={{ marginTop: '4px', accentColor: 'var(--gold)', scale: '1.1' }}
                      />
                      <label htmlFor="recording-consent-promo" style={{ fontSize: '0.85rem', lineHeight: '1.5', color: '#ccc', cursor: 'pointer', userSelect: 'none' }}>
                        <strong>I agree to the privacy conditions:</strong> I explicitly consent to being video and audio recorded during this free grooming session, and I grant Bazetwo Barbers the rights to use the media for promotional outreach and social media.
                      </label>
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={handleBookingSubmit}
                    disabled={loading || !selectedService || !selectedTime || !recordingConsent}
                    className="btn-filled"
                    style={{
                      width: '100%',
                      padding: '1.1rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      opacity: (!selectedService || !selectedTime || !recordingConsent) ? 0.5 : 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="spinning-icon" size={18} /> Processing...
                      </>
                    ) : (
                      <>
                        <Video size={18} /> Book Free Tuesday Session
                      </>
                    )}
                  </button>

                </div>
              )}
            </div>
          )}

        </motion.section>
      </main>
    </div>
  );
};

export default UserPromo;
