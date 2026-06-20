import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  ShieldCheck,
  MapPin,
  Download
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../../api/client';
import type { Booking as BookingDetails } from '../../api/types';
import { getSafeId } from '../../utils/ids';
import { downloadReceiptPDF } from '../../utils/receipt';
import './BookingSuccess.css';

const BookingSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');
  const isGuest = searchParams.get('guest') === 'true';

  useEffect(() => {
    const fetchBooking = async () => {
      if (sessionId) {
        try {
          const response = await apiClient.get(`/bookings/session/${sessionId}`);
          setBooking(response.data);
        } catch (error) {
          console.error("Error fetching booking details:", error);
        } finally {
          setLoading(false);
        }
      } else if (bookingId) {
        try {
          const response = await apiClient.get(`/bookings/${bookingId}`);
          setBooking(response.data);
        } catch (error) {
          console.error("Error fetching booking details:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [sessionId, bookingId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase();
  };

  if (loading) {
    return (
      <div className="success-page-wrapper">
        <div className="loading-state">
          <div className="loader-pulse"></div>
          <p>Verifying Ritual Details...</p>
        </div>
      </div>
    );
  }

  if (!booking && !loading) {
    return (
      <div className="success-page-wrapper">
        <div className="container success-container">
          <div className="error-state-card">
            <h1 className="error-title">Verification Delayed.</h1>
            <p className="error-desc">
              We couldn't retrieve your ritual details instantly. Your appointment is likely secured, 
              but the studio ledger is still updating. Please check your email for confirmation.
            </p>
            <div className="success-actions">
              <Link to="/" className="btn-filled">Return to Studio</Link>
              <Link to="/contact" className="btn-text-gold">Contact Support</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getDisplayId = () => {
    const id = getSafeId(booking) || 'B2-XXXXXX';
    return id.toString().slice(-8).toUpperCase();
  };

  const downloadReceipt = async () => {
    if (!booking) return;
    try {
      await downloadReceiptPDF(booking);
      toast.success("Receipt downloaded successfully!");
    } catch (err) {
      console.error("Receipt generation failed:", err);
      toast.error("Failed to generate PDF.");
    }
  };

  return (
    <div className="success-page-wrapper">
      <div className="container success-container">
        <motion.div 
          className="success-layout"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="receipt-column">
            <div className="receipt-paper">
              <div className="receipt-header">
                <div className="studio-brand">BAZETWO</div>
                <div className={`receipt-badge ${booking?.is_free_promo ? 'promo' : ''}`}>
                  {booking?.is_free_promo ? 'PROMO' : 'PAID'}
                </div>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-content">
                <div className="receipt-row">
                  <span className="label">Order ID</span>
                  <span className="value">#{getDisplayId()}</span>
                </div>
                {booking?.check_in_code && (
                  <div className="receipt-row">
                    <span className="label">Check-In Code</span>
                    <span className="value" style={{ color: 'var(--gold)', fontWeight: 800 }}>{booking.check_in_code}</span>
                  </div>
                )}
                <div className="receipt-row">
                  <span className="label">Date</span>
                  <span className="value">{booking ? new Date(booking.created_at || new Date()).toLocaleDateString() : '--/--/--'}</span>
                </div>
                
                <div className="receipt-divider"></div>

                <div className="receipt-items">
                  <div className="item">
                    <div className="item-info">
                      <p className="item-name">{booking?.service || 'Premium Grooming'}</p>
                      <p className="item-desc">with {booking?.barber || 'Master Barber'}</p>
                    </div>
                    <span className="item-price">{booking?.is_free_promo ? 'FREE' : `£${booking?.amount?.toFixed(2) || '0.00'}`}</span>
                  </div>
                </div>

                <div className="receipt-divider"></div>

                <div className="receipt-total">
                  <span>Grand Total</span>
                  <span className="total-value">{booking?.is_free_promo ? 'FREE' : `£${booking?.amount?.toFixed(2) || '0.00'}`}</span>
                </div>

                <div className="receipt-divider"></div>

                {booking?.check_in_code && (
                  <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', padding: '12px', margin: '15px 0', backgroundColor: '#fcfcfc', fontSize: '11px', color: '#333', textAlign: 'left' }}>
                    <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>Patron Name:</span>
                      <span style={{ fontWeight: 700 }}>{booking.guest_name || 'Registered Patron'}</span>
                    </div>
                    <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>Service:</span>
                      <span style={{ fontWeight: 700 }}>{booking.service}</span>
                    </div>
                    <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>Schedule:</span>
                      <span style={{ fontWeight: 700 }}>
                        {new Date(booking.date).toLocaleDateString([], { dateStyle: 'short' })} {new Date(booking.date).toLocaleTimeString([], { timeStyle: 'short' })}
                      </span>
                    </div>
                    <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>Booked On:</span>
                      <span style={{ fontWeight: 700 }}>
                        {booking.created_at ? new Date(booking.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>Code:</span>
                      <span style={{ fontWeight: 800, color: '#d4af37', letterSpacing: '0.5px' }}>{booking.check_in_code}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${booking.check_in_code}`} 
                        style={{ width: '100px', height: '100px', border: '2px solid #000', padding: '4px', backgroundColor: '#fff', display: 'block' }} 
                        alt={booking.check_in_code} 
                      />
                      <span style={{ fontSize: '8px', color: '#666', marginTop: '6px', letterSpacing: '1px', fontWeight: 'bold' }}>SCAN TO CHECK-IN</span>
                    </div>
                  </div>
                )}

                <div className="receipt-footer">
                  <div className="barcode"></div>
                  <p>THANK YOU FOR CHOOSING EXCELLENCE</p>
                </div>
              </div>
              <div className="receipt-zigzag"></div>
            </div>
            <button className="btn-outlined-studio download-btn-receipt" onClick={downloadReceipt}>
              <Download size={16} /> Download Receipt
            </button>
          </div>

          <div className="content-column">
            <div className="success-header-section">
              <motion.div 
                className="success-icon-wrapper"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              >
                <CheckCircle2 size={48} strokeWidth={1.5} />
              </motion.div>
              <h1 className="success-title">Ritual Secured.</h1>
              <p className="success-description">
                {booking?.is_free_promo 
                  ? "Your Tuesday Free Grooming session is locked in! Please arrive 10 minutes early with your QR code receipt. The session will be recorded for promotional outreach."
                  : "Your appointment has been successfully added to the studio ledger. A digital confirmation has been dispatched to your ritual email."}
              </p>
            </div>

            <div className="details-grid">
              <div className="detail-card">
                <Calendar className="detail-icon" size={20} />
                <div className="detail-info">
                  <span className="detail-label">Appointment Date</span>
                  <p className="detail-value">{booking ? formatDate(booking.date) : 'Loading...'}</p>
                </div>
              </div>

              <div className="detail-card">
                <Clock className="detail-icon" size={20} />
                <div className="detail-info">
                  <span className="detail-label">Scheduled Time</span>
                  <p className="detail-value">{booking ? formatTime(booking.date) : 'Loading...'}</p>
                </div>
              </div>

              <div className="detail-card">
                <User className="detail-icon" size={20} />
                <div className="detail-info">
                  <span className="detail-label">Master Barber</span>
                  <p className="detail-value">{booking?.barber || 'Assigned'}</p>
                </div>
              </div>

              <div className="detail-card">
                <MapPin className="detail-icon" size={20} />
                <div className="detail-info">
                  <span className="detail-label">Studio Location</span>
                  <p className="detail-value">Bazetwo Studio, Floor 2</p>
                </div>
              </div>
            </div>

            {isGuest && (
              <motion.div 
                className="membership-cta"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="cta-icon">
                  <ShieldCheck size={24} />
                </div>
                <div className="cta-content">
                  <h3>Unlock Elite Access</h3>
                  <p>Convert this ritual into a membership to track history and earn loyalty points.</p>
                  <Link to="/auth?mode=register" className="cta-link">
                    Create your profile <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            )}

            <div className="success-actions">
              <Link to="/profile" className="btn-filled">
                View My Rituals
              </Link>
              <Link to="/" className="btn-text-gold">
                Return to Studio
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>

  );
};

export default BookingSuccess;
