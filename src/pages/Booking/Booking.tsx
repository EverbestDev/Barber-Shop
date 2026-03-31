import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Calendar as CalendarIcon, User, Scissors, MessageCircle } from 'lucide-react';
import './Booking.css';

const steps = ['Type', 'Service', 'Barber', 'Time', 'Review'];

const serviceCategories = [
  { id: 'shop', name: 'In-Shop Service', desc: 'Standard treatments at our luxury studio.' },
  { id: 'home', name: 'Home Service (Doorstep)', desc: 'We bring the premium experience to you.' },
  { id: 'group', name: 'Group & Family', desc: 'Bookings for multiple people or family packs.' }
];

const allServices = [
  // Shop Services
  { id: 1, cat: 'shop', name: 'Signature Haircut', price: '£35', duration: '45m', popular: true },
  { id: 2, cat: 'shop', name: 'Skin Fade', price: '£38', duration: '60m', popular: true },
  { id: 3, cat: 'shop', name: 'Beard Sculpture', price: '£25', duration: '30m' },
  { id: 4, cat: 'shop', name: 'Executive Package', price: '£55', duration: '75m' },
  { id: 5, cat: 'shop', name: 'Buzz Cut', price: '£20', duration: '20m' },
  
  // Home Services
  { id: 101, cat: 'home', name: 'Executive Home Visit', price: '£85', duration: '60m', popular: true },
  { id: 102, cat: 'home', name: 'Duo Home Session', price: '£150', duration: '120m' },
  
  // Group Services
  { id: 201, cat: 'group', name: 'Father & Son', price: '£50', duration: '90m', popular: true },
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
  const [isCustomStyle, setIsCustomStyle] = useState(false);
  const [customStyleName, setCustomStyleName] = useState('');
  const [customStyleFile, setCustomStyleFile] = useState<File | null>(null);

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
  const popularServices = filteredServices.filter(s => s.popular);
  const otherServices = filteredServices.filter(s => !s.popular);

  const handleWhatsAppInquiry = () => {
    const text = `Hi Baze 2 Barbers! I'd like to book a custom style:
Name: ${guestName}
Style: ${customStyleName}
Type: ${selectedCategory?.name}
Date: ${selectedDate} at ${selectedTime}
Contact: ${guestPhone}`;
    // Replace with your business number
    const url = `https://wa.me/447000000000?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

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
                      onClick={() => { setSelectedCategory(cat); setSelectedService(null); setIsCustomStyle(false); }}
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
                
                {!isCustomStyle ? (
                  <>
                    <h3 className="sub-step-title">Popular Choices</h3>
                    <div className="options-grid">
                      {popularServices.map(s => (
                        <div 
                          key={s.id} 
                          className={`option-card ${selectedService?.id === s.id ? 'selected' : ''}`}
                          onClick={() => { setSelectedService(s); setIsCustomStyle(false); }}
                        >
                          <div className="option-info">
                            <h3>{s.name}</h3>
                            <span>{s.duration}</span>
                          </div>
                          <div className="option-price">{s.price}</div>
                        </div>
                      ))}
                    </div>

                    <div className="others-dropdown-wrapper">
                      <select 
                        className="luxury-input others-select"
                        onChange={(e) => {
                          const s = otherServices.find(srv => srv.id === parseInt(e.target.value));
                          if (s) { setSelectedService(s); setIsCustomStyle(false); }
                        }}
                        value={selectedService?.id || ''}
                      >
                        <option value="" disabled>See Other Services...</option>
                        {otherServices.map(s => (
                          <option key={s.id} value={s.id}>{s.name} - {s.price}</option>
                        ))}
                      </select>
                    </div>

                    <div className="custom-look-cta">
                      <p>Not seeing your style? <button className="text-gold-btn" onClick={() => setIsCustomStyle(true)}>Request a Custom Order</button></p>
                    </div>
                  </>
                ) : (
                  <div className="custom-style-form">
                    <h3 className="sub-step-title">Tell us about your Custom Look</h3>
                    <p className="custom-desc">Since custom styles vary, pricing will be finalized via WhatsApp. Please describe your desired look below.</p>
                    <div className="custom-inputs">
                      <input 
                        type="text" 
                        placeholder="Name of Style (e.g. Braided Mohawk with Fade)" 
                        className="luxury-input"
                        value={customStyleName}
                        onChange={(e) => setCustomStyleName(e.target.value)}
                      />
                      <div className="upload-box">
                        <label className="input-label">Reference Picture (Optional)</label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="file-input"
                          onChange={(e) => setCustomStyleFile(e.target.files ? e.target.files[0] : null)}
                        />
                      </div>
                      <button className="text-gold-btn" onClick={() => { setIsCustomStyle(false); setSelectedService(null); }}>
                        ← Back to standard services
                      </button>
                    </div>
                  </div>
                )}
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
                        <p>
                          {selectedCategory?.name}: {isCustomStyle ? `Custom Style: ${customStyleName}` : `${selectedService?.name} (${selectedService?.price})`}
                        </p>
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

                {isCustomStyle ? (
                  <div className="whats-app-notice">
                    <p style={{ color: 'var(--gold)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                      * Custom styles require pricing finalization. Proceed to WhatsApp to discuss your look.
                    </p>
                    <button 
                      className="btn-filled wide-booking-btn"
                      onClick={handleWhatsAppInquiry}
                      style={{ background: '#25D366', borderColor: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <MessageCircle size={20} /> Inquire on WhatsApp
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="deposit-notice">
                      <p>A 50% deposit is required for secure premium bookings.</p>
                    </div>
                    <button 
                      className="btn-filled wide-booking-btn"
                      disabled={!guestName || !guestPhone || !guestEmail}
                    >
                      Proceed to Secure Checkout
                    </button>
                  </>
                )}
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
                  (step === 2 && !isCustomStyle && !selectedService) || 
                  (step === 2 && isCustomStyle && !customStyleName) ||
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
