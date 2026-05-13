import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, Loader2, CheckCircle } from 'lucide-react';
import type { Booking } from '../../../api/types';
import { rescheduleBooking } from '../../../api/bookings';
import toast from 'react-hot-toast';
import './RescheduleModal.css';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onSuccess: () => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ isOpen, onClose, booking, onSuccess }) => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const allTimeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', 
    '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ];

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
        if (hour === currentHour && min > currentMin + 30) return true;
        return false;
      });
    }
    return allTimeSlots;
  };

  const visibleTimes = getVisibleTimes();

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a new date and time.");
      return;
    }

    setLoading(true);
    try {
      const [timeStr, modifier] = selectedTime.split(' ');
      let [hour, min] = timeStr.split(':').map(Number);
      if (modifier === 'PM' && hour < 12) hour += 12;
      if (modifier === 'AM' && hour === 12) hour = 0;
      
      const formattedTime = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00`;
      const fullDate = `${selectedDate}T${formattedTime}`;

      await rescheduleBooking(booking.id as string, fullDate);
      
      toast.success("Appointment rescheduled successfully.");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to reschedule appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div 
            className="reschedule-modal premium-card-bg"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="modal-header">
              <div className="header-text">
                <h2>Reschedule <span className="text-gold">Ritual</span></h2>
                <p>Adjust your timing while keeping your style.</p>
              </div>
              <button className="close-btn" onClick={onClose}><X size={20} /></button>
            </div>

            <div className="modal-body">
              <div className="booking-summary-mini">
                <div className="summary-item">
                  <span className="label">Service</span>
                  <span className="value">{booking.service}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Current Appointment</span>
                  <span className="value">{new Date(booking.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </div>

              <div className="reschedule-form">
                <div className="input-group">
                  <label><CalendarIcon size={16} /> New Date</label>
                  <input 
                    type="date" 
                    className="luxury-input" 
                    min={today}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime('');
                    }}
                    onClick={(e) => e.currentTarget.showPicker()}
                  />
                </div>

                <div className="time-selection">
                  <label><Clock size={16} /> New Time</label>
                  <div className="time-grid-mini">
                    {visibleTimes.map(t => (
                      <button 
                        key={t} 
                        className={`time-chip-mini ${selectedTime === t ? 'active' : ''}`}
                        onClick={() => setSelectedTime(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {visibleTimes.length === 0 && (
                    <p className="no-times-error">No slots available for this date.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-outlined-studio" onClick={onClose}>Cancel</button>
              <button 
                className="btn-filled-studio" 
                onClick={handleReschedule} 
                disabled={loading || !selectedTime}
              >
                {loading ? <Loader2 className="spinning-icon" size={18} /> : <CheckCircle size={18} />}
                Confirm Reschedule
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RescheduleModal;
