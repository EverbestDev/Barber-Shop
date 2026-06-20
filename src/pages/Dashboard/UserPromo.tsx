import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Check, Loader2, Video, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createBooking } from '../../api/bookings';
import { getSafeId } from '../../utils/ids';
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
  '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

const UserPromo: React.FC = () => {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [recordingConsent, setRecordingConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const todayObj = new Date();
  const isTuesday = todayObj.getDay() === 2; // 0 = Sunday, 1 = Monday, 2 = Tuesday
  const todayStr = todayObj.toISOString().split('T')[0];

  const getVisibleTimes = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    
    return allTimeSlots.filter(slot => {
      const [time, modifier] = slot.split(' ');
      let [hour, min] = time.split(':').map(Number);
      
      if (modifier === 'PM' && hour < 12) hour += 12;
      if (modifier === 'AM' && hour === 12) hour = 0;

      if (hour > currentHour) return true;
      if (hour === currentHour && min > currentMin + 30) return true;
      return false;
    });
  };

  const visibleTimes = getVisibleTimes();

  const handleBookingSubmit = async () => {
    if (!isTuesday) {
      toast.error("Free Tuesday Grooming can only be booked on Tuesdays.");
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
      let [hour, min] = timeStr.split(':').map(Number);
      if (modifier === 'PM' && hour < 12) hour += 12;
      if (modifier === 'AM' && hour === 12) hour = 0;
      
      const formattedTime = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00`;

      const bookingData = {
        service: selectedService.name,
        date: `${todayStr}T${formattedTime}`,
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
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || err.message || "Booking failed. You may already have a booking for this Tuesday.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content-main">
      <main className="dashboard-main-view">
        <motion.header className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="header-greeting">
            <h1>Tuesday Free <span className="text-gold">Grooming</span></h1>
            <p>Exclusive walking outreach promotion for registered studio members.</p>
          </div>
        </motion.header>

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

          {/* Booking Card (Active/Inactive State) */}
          <div className="dashboard-card premium-card-bg" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <div className="card-header" style={{ marginBottom: '1.5rem' }}>
              <h2><Calendar size={20} /> Reserve Today's Session</h2>
            </div>

            {isTuesday ? (
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
                  <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 'bold' }}>2. Select Time Slot (Today)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
                    {visibleTimes.length > 0 ? visibleTimes.map(t => (
                      <button 
                        key={t}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '4px',
                          border: '1px solid',
                          borderColor: selectedTime === t ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                          backgroundColor: selectedTime === t ? 'var(--gold)' : 'transparent',
                          color: selectedTime === t ? 'var(--primary)' : 'var(--white)',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => setSelectedTime(t)}
                      >
                        {t}
                      </button>
                    )) : (
                      <div style={{ gridColumn: '1 / -1', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        No more time slots are available for walk-ins today. Please check back next Tuesday.
                      </div>
                    )}
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
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={30} className="text-gold" />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>Booking Window Closed</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: 0, lineHeight: '1.6' }}>
                    Free Tuesday walk-in slots can only be reserved on <strong>Tuesdays</strong> for same-day sessions. Advanced booking is disabled. Please return on Tuesday morning to book your free seat!
                  </p>
                </div>
              </div>
            )}
          </div>

        </motion.section>
      </main>
    </div>
  );
};

export default UserPromo;
