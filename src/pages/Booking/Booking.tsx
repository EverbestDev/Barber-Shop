import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Calendar as CalendarIcon, User, Scissors } from 'lucide-react';
import './Booking.css';

const steps = ['Type', 'Service', 'Barber', 'Time', 'Review'];

const serviceCategories = [
  { id: 'shop', name: 'In-Shop Service', desc: 'Standard treatments at our luxury studio.' },
  { id: 'home', name: 'Home Service (Doorstep)', desc: 'We bring the premium experience to you.' },
  { id: 'group', name: 'Group & Family', desc: 'Bookings for multiple people or family packs.' }
];

const allServices = [
  // Shop Services
  { id: 1, cat: 'shop', name: 'Signature Haircut', price: '£35', duration: '45m' },
  { id: 2, cat: 'shop', name: 'Skin Fade', price: '£38', duration: '60m' },
  { id: 3, cat: 'shop', name: 'Beard Sculpture', price: '£25', duration: '30m' },
  { id: 4, cat: 'shop', name: 'Executive Package', price: '£55', duration: '75m' },
  
  // Home Services
  { id: 101, cat: 'home', name: 'Executive Home Visit', price: '£85', duration: '60m' },
  { id: 102, cat: 'home', name: 'Duo Home Session', price: '£150', duration: '120m' },
  
  // Group Services
  { id: 201, cat: 'group', name: 'Father & Son', price: '£50', duration: '90m' },
  { id: 202, cat: 'group', name: 'Grooming Party (3+)', price: 'From £150', duration: 'Custom' }
];

const barbers = [
  { id: 1, name: 'Master J', role: 'Senior Barber', img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=200&auto=format&fit=crop' },
  { id: 2, name: 'Dexter', role: 'Stylist', img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=200&auto=format&fit=crop' },
  { id: 3, name: 'Any Barber', role: 'Next Available', img: 'https://via.placeholder.com/200' }
];

const Booking: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const filteredServices = allServices.filter(s => s.cat === selectedCategory?.id);

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
            
            {/* Step 1: Booking Type */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-view">
                <h2 className="step-title">How can we serve you?</h2>
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

            {/* Step 2: Services */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-view">
                <h2 className="step-title">Select a Service</h2>
                <div className="options-grid">
                  {filteredServices.map(s => (
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

            {/* Step 3: Barbers */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-view">
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

            {/* Step 4: Date, Time & Address */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-view">
                <h2 className="step-title">{selectedCategory?.id === 'home' ? 'Location & Schedule' : 'Select Date & Time'}</h2>
                <div className="datetime-layout">
                  <div className="date-selection-box">
                    <label className="input-label">Appointment Date</label>
                    <input type="date" className="luxury-input" onChange={(e) => setSelectedDate(e.target.value)} />
                    
                    {selectedCategory?.id === 'home' && (
                      <div className="address-box" style={{ marginTop: '2rem' }}>
                        <label className="input-label">Home Address (Full Details)</label>
                        <textarea 
                          className="luxury-input luxury-textarea" 
                          placeholder="Please provide your full address, postcode, and any specific instructions (e.g. buzzer, flat number)."
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="time-selection-box">
                    <label className="input-label">Available Time Slots</label>
                    <div className="time-grid">
                      {['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:30 PM', '5:00 PM', '6:30 PM'].map(t => (
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
                </div>
              </motion.div>
            )}

            {/* Step 5: Review & Guest Info */}
            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-view">
                <h2 className="step-title">Review & Guest Details</h2>
                <div className="review-layout">
                  <div className="review-box">
                    <div className="review-item">
                      <Scissors size={20} className="gold-icon" />
                      <div className="review-text">
                        <label>Type & Service</label>
                        <p>{selectedCategory?.name}: {selectedService?.name} ({selectedService?.price})</p>
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
                        <p>{selectedDate || 'Select a date'} at {selectedTime || 'Select a time'}</p>
                      </div>
                    </div>
                    {selectedCategory?.id === 'home' && (
                      <div className="review-item">
                        <Check size={20} className="gold-icon" />
                        <div className="review-text">
                          <label>Location</label>
                          <p>{address || 'No address provided'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="guest-info-box">
                    <h3 className="cat-title">Guest Details (No Account Necessary)</h3>
                    <div className="guest-input-grid">
                      <input 
                        type="text" 
                        className="luxury-input" 
                        placeholder="Full Name" 
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                      />
                      <input 
                        type="tel" 
                        className="luxury-input" 
                        placeholder="Phone Number" 
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                      />
                      <input 
                        type="email" 
                        className="luxury-input" 
                        placeholder="Email (For Receipt)" 
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="deposit-notice">
                  <p>A 50% deposit is required for secure premium bookings.</p>
                </div>
                <button 
                  className="btn-filled wide-booking-btn"
                  disabled={!guestName || !guestPhone || !guestEmail}
                >
                  Proceed to Secure Checkout
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
                disabled={
                  (step === 1 && !selectedCategory) || 
                  (step === 2 && !selectedService) || 
                  (step === 3 && !selectedBarber) ||
                  (step === 4 && (!selectedDate || !selectedTime || (selectedCategory?.id === 'home' && !address)))
                }
              >
                Next Step <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Booking;
