import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Calendar as CalendarIcon, User, Scissors } from 'lucide-react';
import './Booking.css';

const steps = ['Service', 'Barber', 'Time', 'Review'];

const services = [
  { id: 1, name: 'Signature Haircut', price: '£35', duration: '45m' },
  { id: 2, name: 'Skin Fade', price: '£38', duration: '60m' },
  { id: 3, name: 'Beard Sculpture', price: '£25', duration: '30m' },
  { id: 4, name: 'Haircut & Beard', price: '£55', duration: '75m' }
];

const barbers = [
  { id: 1, name: 'Master J', role: 'Senior Barber', img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=200&auto=format&fit=crop' },
  { id: 2, name: 'Dexter', role: 'Stylist', img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=200&auto=format&fit=crop' },
  { id: 3, name: 'Any Barber', role: 'Next Available', img: 'https://via.placeholder.com/200' }
];

const Booking: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="booking-page-wrapper">
      <div className="container booking-container">
        
        {/* Progress Bar */}
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
            
            {/* Step 1: Services */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-view">
                <h2 className="step-title">Select a Service</h2>
                <div className="options-grid">
                  {services.map(s => (
                    <div 
                      key={s.id} 
                      className={`option-card ${selectedService?.id === s.id ? 'selected' : ''}`}
                      onClick={() => setSelectedService(s)}
                    >
                      <div className="option-info">
                        <h3>{s.name}</h3>
                        <span>{s.duration}</span>
                      </div>
                      <div className="option-price">{s.price}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Barbers */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-view">
                <h2 className="step-title">Choose your Barber</h2>
                <div className="options-grid cols-3">
                  {barbers.map(b => (
                    <div 
                      key={b.id} 
                      className={`barber-card ${selectedBarber?.id === b.id ? 'selected' : ''}`}
                      onClick={() => setSelectedBarber(b)}
                    >
                      <img src={b.img} alt={b.name} />
                      <h3>{b.name}</h3>
                      <span>{b.role}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-view">
                <h2 className="step-title">Select Date & Time</h2>
                <div className="datetime-layout">
                  <div className="date-picker-placeholder">
                    {/* In a real app, this would be a calendar component */}
                    <input type="date" className="luxury-input" onChange={(e) => setSelectedDate(e.target.value)} />
                  </div>
                  <div className="time-grid">
                    {['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:30 PM', '5:00 PM'].map(t => (
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

            {/* Step 4: Review */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-view">
                <h2 className="step-title">Review & Confirm</h2>
                <div className="review-box">
                  <div className="review-item">
                    <Scissors size={20} className="gold-icon" />
                    <div className="review-text">
                      <label>Service</label>
                      <p>{selectedService?.name} ({selectedService?.price})</p>
                    </div>
                  </div>
                  <div className="review-item">
                    <User size={20} className="gold-icon" />
                    <div className="review-text">
                      <label>Barber</label>
                      <p>{selectedBarber?.name}</p>
                    </div>
                  </div>
                  <div className="review-item">
                    <CalendarIcon size={20} className="gold-icon" />
                    <div className="review-text">
                      <label>Date & Time</label>
                      <p>{selectedDate || 'April 15, 2026'} at {selectedTime}</p>
                    </div>
                  </div>
                </div>
                <div className="deposit-notice">
                  <p>A £5 deposit is required to confirm this booking.</p>
                </div>
                <button className="btn-filled wide-booking-btn">Confirm & Pay Deposit</button>
              </motion.div>
            )}

          </AnimatePresence>

          <div className="booking-footer">
            {step > 1 && <button className="btn-outlined" onClick={prevStep}><ChevronLeft size={18} /> Back</button>}
            {step < 4 && (
              <button 
                className="btn-filled next-btn" 
                onClick={nextStep}
                disabled={(step === 1 && !selectedService) || (step === 2 && !selectedBarber)}
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

export default Booking;
