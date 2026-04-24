import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        
        {/* Brand & Socials */}
        <div className="footer-block brand-info">
          <h3 className="footer-logo">BAZETWO BARBERS</h3>
          <p className="footer-about">
            Premium grooming for the modern individual. Experience the art of master barbering in the heart of Catford.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-link"><FaFacebook size={18} /></a>
            <a href="#" className="social-link"><FaInstagram size={18} /></a>
            <a href="#" className="social-link"><FaTwitter size={18} /></a>
          </div>
          <Link to="/booking" className="footer-book-btn">
            <Calendar size={18} /> Book Now
          </Link>
        </div>

        {/* Quick Links */}
        <div className="footer-block">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-block">
          <h4 className="footer-title">Contact Us</h4>
          <div className="footer-contact-item">
            <MapPin size={18} className="footer-icon" />
            <span>327 Stanstead road, Catford, se6 4UE</span>
          </div>
          <div className="footer-contact-item">
            <Phone size={18} className="footer-icon" />
            <span>+44 20 8690 1234</span> 
          </div>
          <div className="footer-contact-item">
            <Mail size={18} className="footer-icon" />
            <span>info@bazetwo.com</span>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="footer-block">
          <h4 className="footer-title">Opening Hours</h4>
          <div className="footer-hours">
            <div className="hours-row">
              <span className="day">Mon - Fri:</span>
              <span className="time">9:00 AM - 8:00 PM</span>
            </div>
            <div className="hours-row">
              <span className="day">Saturday:</span>
              <span className="time">9:00 AM - 7:00 PM</span>
            </div>
            <div className="hours-row">
              <span className="day">Sunday:</span>
              <span className="time">10:00 AM - 5:00 PM</span>
            </div>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Bazetwo Barbers. All rights reserved.</p>
        <div className="footer-legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/refund">Refund Policy</Link>
          <Link to="/cookie">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
