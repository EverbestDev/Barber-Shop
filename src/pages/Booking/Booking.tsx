import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOutletContext } from 'react-router-dom';
import { createBooking } from '../../api/bookings';
import { createCheckoutSession } from '../../api/payments';
import './Booking.css';

const steps = ['Type', 'Service', 'Time', 'Review'];

interface Category {
  id: string;
  name: string;
  desc: string;
}

interface Service {
  id: number;
  cat: string;
  name: string;
  price: number;
  duration: string;
  popular?: boolean;
}

const serviceCategories: Category[] = [
  { id: 'shop', name: 'In-Shop Service', desc: 'Standard treatments at our luxury studio.' },
  { id: 'home', name: 'Home Service (Doorstep)', desc: 'We bring the premium experience to you.' },
  { id: 'group', name: 'Group & Family', desc: 'Bookings for multiple people or family packs.' }
];

const allServices: Service[] = [
  { id: 1, cat: 'shop', name: 'Signature Haircut', price: 35, duration: '45m', popular: true },
  { id: 2, cat: 'shop', name: 'Skin Fade', price: 38, duration: '60m', popular: true },
  { id: 3, cat: 'shop', name: 'Beard Sculpture', price: 25, duration: '30m' },
  { id: 4, cat: 'shop', name: 'Executive Package', price: 55, duration: '75m' },
  { id: 5, cat: 'shop', name: 'Buzz Cut', price: 20, duration: '20m' },
  { id: 6, cat: 'shop', name: "Women's Taper Fade", price: 40, duration: '60m' },
  { id: 7, cat: 'shop', name: "Women's Signature", price: 45, duration: '60m' },
  { id: 101, cat: 'home', name: 'Executive Home Visit', price: 85, duration: '60m', popular: true },
  { id: 102, cat: 'home', name: 'Duo Home Session', price: 150, duration: '120m' },
  { id: 201, cat: 'group', name: 'Father & Son', price: 50, duration: '90m', popular: true }
];

const BookingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { onAuthOpen } = useOutletContext<{ onAuthOpen: () => void }>();

  const today = new Date().toISOString().split('T')[0];
  const allTimeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', 
    '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  useEffect(() => {
    // No longer need to fetch barbers for selection
  }, []);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const filteredServices = allServices.filter(s => s.cat === selectedCategory?.id);

  const getVisibleTimes = () => {
    if (selectedDate === today) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();
      
      return allTimeSlots.filter(slot => {
        const [time, modifier] = slot.split(' ');
        let [hour, min] = time.split(':').map(Number);
        
        if (modifier === 'PM' && hour < 12) hour += 12;
        if (modifier === 'AM' && hour === 12) hour = 0;

        if (hour > currentHour) return true;
        if (hour === currentHour && min > currentMin + 30) return true; // 30 min buffer
        return false;
      });
    }
    return allTimeSlots;
  };

  const visibleTimes = getVisibleTimes();

  const handleBookingSubmit = async () => {
    if (!selectedService) return;

    if (!user && (!guestName || !guestEmail)) {
      alert("Please provide your name and email to continue as a guest.");
      return;
    }

    setLoading(true);
    try {
      const [timeStr, modifier] = selectedTime.split(' ');
      let [hour, min] = timeStr.split(':').map(Number);
      if (modifier === 'PM' && hour < 12) hour += 12;
      if (modifier === 'AM' && hour === 12) hour = 0;
      
      const formattedTime = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00`;

      const bookingData = {
        service: selectedService.name,
        date: `${selectedDate}T${formattedTime}`,
        barber: 'Any',
        amount: selectedService.price,
        guest_name: !user ? guestName : undefined,
        guest_email: !user ? guestEmail : undefined
      };

      const newBooking = await createBooking(bookingData);
      const { url } = await createCheckoutSession(newBooking.id!);
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Stripe checkout URL not returned.');
      }
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page-wrapper">
      <div className="container booking-container">
        <div className="booking-progress">
          {steps.map((s, i) => (
            <div key={s} className={`progress-step ${step > i ? 'completed' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="step-number">{step > i + 1 ? <Check size={14} /> : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="booking-card">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-view">
                <h2 className="step-title">Select Service Category</h2>
                <div className="options-grid">
                  {serviceCategories.map(cat => (
                    <div 
                      key={cat.id} 
                      className={`option-card ${selectedCategory?.id === cat.id ? 'selected' : ''}`}
                      onClick={() => { setSelectedCategory(cat); setSelectedService(null); }}
                    >
                      <div className="option-info">
                        <h3>{cat.name}</h3>
                        <p>{cat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-view">
                <h2 className="step-title">Choose Service</h2>
                <div className="options-grid">
                  {filteredServices.map(s => (
                    <div 
                      key={s.id} 
                      className={`option-card ${selectedService?.id === s.id ? 'selected' : ''}`}
                      onClick={() => setSelectedService(s)}
                    >
                      <div className="option-info">
                        <h3>{s.name}</h3>
                        <span>{s.duration} - £{s.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-view">
                <h2 className="step-title">Date & Time</h2>
                <div className="datetime-layout">
                  <div className="input-group">
                    <label>Select Date</label>
                    <input 
                      type="date" 
                      className="luxury-input" 
                      min={today}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTime(''); 
                      }} 
                    />
                  </div>
                  
                  <div className="time-section">
                    <label className="section-label">Available Times</label>
                    <div className="time-grid">
                      {visibleTimes.length > 0 ? visibleTimes.map(t => (
                        <button 
                          key={t} 
                          className={`time-chip ${selectedTime === t ? 'active' : ''}`}
                          onClick={() => setSelectedTime(t)}
                        >
                          {t}
                        </button>
                      )) : (
                        <p className="no-times-msg">No more times available for today. Please select another date.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-view">
                <h2 className="step-title">Review & Contact</h2>
                <div className="review-layout">
                  <div className="review-box">
                    <h3>Booking Summary</h3>
                    <p><b>Service:</b> {selectedService?.name}</p>
                    <p><b>Time:</b> {selectedDate} at {selectedTime}</p>
                    <p><b>Price:</b> £{selectedService?.price}</p>
                  </div>

                  {!user && (
                    <div className="guest-details-box">
                      <div className="guest-header">
                        <h3>Guest Details</h3>
                        <button onClick={onAuthOpen} className="inline-login-btn">Already a member? Login</button>
                      </div>
                      <p className="guest-note">Checkout as guest or secure your chair with an account for history tracking.</p>
                      <div className="input-group">
                        <label>Display Name</label>
                        <input 
                          type="text" 
                          placeholder="How should we address you?" 
                          className="luxury-input"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>Email Address</label>
                        <input 
                          type="email" 
                          placeholder="For your confirmation" 
                          className="luxury-input"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <button className="btn-filled wide-booking-btn" onClick={handleBookingSubmit} disabled={loading}>
                  {loading ? 'Processing...' : 'Secure Chair & Pay'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="booking-footer">
            {step > 1 && <button className="btn-outlined" onClick={prevStep}><ChevronLeft size={18} /> Back</button>}
            <div style={{ flex: 1 }}></div>
            {step < 4 && (
              <button 
                className="btn-filled next-btn" 
                onClick={nextStep}
                disabled={(step === 1 && !selectedCategory) || (step === 2 && !selectedService) || (step === 3 && (!selectedDate || !selectedTime))}
              >
                Next <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
