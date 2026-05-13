import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, CreditCard, Scissors, MapPin } from 'lucide-react';
import './DetailModal.css';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
  type: 'booking' | 'user' | 'transaction';
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, title, data, type }) => {
  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div 
            className="detail-modal-container"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>{title}</h3>
                <span className="modal-subtitle">{type.toUpperCase()} RECORD</span>
              </div>
              <button className="modal-close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {type === 'booking' && (
                <div className="booking-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <label><Calendar size={14} /> Date</label>
                      <span>{new Date(data.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="detail-item">
                      <label><Clock size={14} /> Time</label>
                      <span>{new Date(data.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item">
                      <label><Scissors size={14} /> Service</label>
                      <span className="text-gold">{data.service}</span>
                    </div>
                    <div className="detail-item">
                      <label><User size={14} /> Barber</label>
                      <span>{data.barber || 'Assigned soon'}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item">
                      <label><CreditCard size={14} /> Payment Status</label>
                      <span className={`status-badge ${data.payment_status}`}>{data.payment_status?.toUpperCase()}</span>
                    </div>
                    <div className="detail-item">
                      <label>Booking Status</label>
                      <span className={`status-badge ${data.status}`}>{data.status?.toUpperCase()}</span>
                    </div>
                  </div>

                  {data.notes && (
                    <div className="detail-item full-width">
                      <label>Notes</label>
                      <p className="notes-box">{data.notes}</p>
                    </div>
                  )}
                  
                  <div className="detail-item full-width">
                    <label><MapPin size={14} /> Location</label>
                    <span>Premium Studio - 123 Luxury Ave</span>
                  </div>
                </div>
              )}

              {type === 'user' && (
                <div className="user-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <label>Full Name</label>
                      <span>{data.name}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email</label>
                      <span>{data.email}</span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-item">
                      <label>Role</label>
                      <span className="status-badge active">{data.role?.toUpperCase()}</span>
                    </div>
                    <div className="detail-item">
                      <label>Member Since</label>
                      <span>{new Date(data.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-outlined-studio" onClick={onClose}>Close View</button>
              {type === 'booking' && data.status === 'confirmed' && (
                 <button className="btn-filled-gold" onClick={() => window.print()}>Print Receipt</button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;
