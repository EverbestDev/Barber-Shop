import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import FAQ from '../../components/sections/home/FAQ';
import './Contact.css';

const Contact: React.FC = () => {
  return (
    <div className="contact-page-wrapper">
      
      {/* Hero */}
      <section className="contact-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="contact-title"
          >
            GET IN TOUCH
          </motion.h1>
          <p className="contact-hero-desc">Have a question or want to book via WhatsApp? We're here for you.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-main">
        <div className="container contact-grid">
          
          {/* Left: Info */}
          <div className="contact-info-panel">
            <h2 className="contact-section-title">Contact Information</h2>
            <p className="contact-panel-desc">We are located in the heart of Catford. Stop by for the sharpest cut in South London.</p>
            
            <div className="info-items">
              <div className="info-item">
                <MapPin className="gold-icon" />
                <div className="info-text">
                  <span>327 Stanstead road, Catford, se6 4UE</span>
                </div>
              </div>
              <div className="info-item">
                <Phone className="gold-icon" />
                <div className="info-text">
                  <span>+44 20 8690 1234</span>
                </div>
              </div>
              <div className="info-item">
                <Mail className="gold-icon" />
                <div className="info-text">
                  <span>booking@baze2barbers.com</span>
                </div>
              </div>
              <div className="info-item">
                <Clock className="gold-icon" />
                <div className="info-text">
                  <span>Mon-Fri: 9am-8pm | Sat: 9am-7pm | Sun: 10am-5pm</span>
                </div>
              </div>
            </div>

            <div className="whatsapp-cta">
              <button className="whatsapp-btn">
                <MessageCircle size={20} />
                Chat on WhatsApp
              </button>
            </div>
          </div>

          {/* Right: Form */}
          <div className="contact-form-panel">
            <h2 className="contact-section-title">Send a Message</h2>
            <form className="luxury-form">
              <div className="form-row">
                <input type="text" placeholder="Full Name" required />
              </div>
              <div className="form-row">
                <input type="email" placeholder="Email Address" required />
              </div>
              <div className="form-row">
                <input type="tel" placeholder="Phone Number" />
              </div>
              <div className="form-row">
                <textarea placeholder="How can we help you?" rows={5} required></textarea>
              </div>
              <button type="submit" className="btn-filled form-submit">
                Send Message <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Map */}
      <section className="map-section">
        <iframe 
          title="Baze 2 Barbers Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2487.3562304859!2d-0.0384!3d51.4449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487603c4f0!2s327%20Stanstead%20Rd%2C%20London%20SE6%204UE!5e0!3m2!1sen!2suk!4v1620000000000!5m2!1sen!2suk" 
          width="100%" 
          height="450" 
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(100%) brightness(0.9)' }} 
          loading="lazy"
        ></iframe>
      </section>

      {/* FAQ Reused */}
      <FAQ />

    </div>
  );
};

export default Contact;
