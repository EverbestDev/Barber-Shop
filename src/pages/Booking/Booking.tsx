import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchBarbers } from '../../api/admin';
import { createBooking } from '../../api/bookings';
import { createCheckoutSession } from '../../api/payments';
import type { UserInfo } from '../../api/types';
import './Booking.css';

const steps = ['Type', 'Service', 'Barber', 'Time', 'Review'];

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
  { id: 101, cat: 'home', name: 'Executive Home Visit', price: 85, duration: '60m', popular: true },
  { id: 102, cat: 'home', name: 'Duo Home Session', price: 150, duration: '120m' },
  { id: 201, cat: 'group', name: 'Father & Son', price: 50, duration: '90m', popular: true }
];

const BookingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [allBarbers, setAllBarbers] = useState<UserInfo[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<UserInfo | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBarbers().then(setAllBarbers).catch(console.error);
  }, []);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const filteredServices = allServices.filter(s => s.cat === selectedCategory?.id);

  const handleBookingSubmit = async () => {
    if (!user) {
      alert("Please login to book an appointment.");
      navigate('/auth');
      return;
    }

    if (!selectedService) return;

    setLoading(true);
    try {
      const bookingData = {
        service: selectedService.name,
        date: `${selectedDate}T${selectedTime.split(' ')[0]}:00`,
        barber: selectedBarber?.name || 'Any',
        barber_id: selectedBarber?.id,
        amount: selectedService.price
      };

      const newBooking = await createBooking(bookingData);
      const { url } = await createCheckoutSession(newBooking.id!);
      window.location.href = url;
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
                      <h3>{cat.name}</h3>
                      <p>{cat.desc}</p>
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
                      <h3>{s.name}</h3>
                      <span>{s.duration} - £{s.price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-view">
                <h2 className="step-title">Select Barber</h2>
                <div className="options-grid">
                  {allBarbers.map(b => (
                    <div 
                      key={b.id} 
                      className={`barber-card ${selectedBarber?.id === b.id ? 'selected' : ''}`}
                      onClick={() => setSelectedBarber(b)}
                    >
                      <h3>{b.name}</h3>
                      <span>Master Barber</span>
                    </div>
                  ))}
                  <div className={`barber-card ${!selectedBarber ? 'selected' : ''}`} onClick={() => setSelectedBarber(null)}>
                    <h3>Any Barber</h3>
                    <span>Next Available</span>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-view">
                <h2 className="step-title">Date & Time</h2>
                <div className="datetime-layout">
                  <input type="date" className="luxury-input" onChange={(e) => setSelectedDate(e.target.value)} />
                  <div className="time-grid">
                    {['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'].map(t => (
                      <button 
                        key={t} 
                        className={`time-chip ${selectedTime === t ? 'active' : ''}`}
                        onClick={() => setSelectedTime(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-view">
                <h2 className="step-title">Review Booking</h2>
                <div className="review-box">
                  <p><b>Service:</b> {selectedService?.name}</p>
                  <p><b>Barber:</b> {selectedBarber?.name || 'Any'}</p>
                  <p><b>Time:</b> {selectedDate} at {selectedTime}</p>
                  <p><b>Price:</b> £{selectedService?.price}</p>
                </div>
                <button className="btn-filled wide-booking-btn" onClick={handleBookingSubmit} disabled={loading}>
                  {loading ? 'Processing...' : 'Proceed to Stripe Payment'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="booking-footer">
            {step > 1 && <button className="btn-outlined" onClick={prevStep}><ChevronLeft size={18} /> Back</button>}
            <div style={{ flex: 1 }}></div>
            {step < 5 && (
              <button 
                className="btn-filled next-btn" 
                onClick={nextStep}
                disabled={(step === 1 && !selectedCategory) || (step === 2 && !selectedService) || (step === 4 && (!selectedDate || !selectedTime))}
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
