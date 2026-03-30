import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Zap } from 'lucide-react';
import './Pricing.css';

const pricingList = [
  { name: "Signature Haircut", price: "£35", duration: "45 min" },
  { name: "Skin Fade", price: "£38", duration: "60 min" },
  { name: "Beard Sculpture", price: "£25", duration: "30 min" },
  { name: "Hot Towel Shave", price: "£30", duration: "45 min" },
  { name: "Haircut & Beard", price: "£55", duration: "75 min" },
  { name: "Kids Haircut", price: "£20", duration: "30 min" },
  { name: "The Royal Treatment", price: "£75", duration: "105 min" }
];

const packages = [
  { 
    title: "Monthly Unlimited", 
    price: "£65", 
    per: "month",
    features: ["Unlimited Skin Fades", "Unlimited Beard Trims", "Priority Booking", "10% off Products"]
  },
  { 
    title: "The VIP Groom", 
    price: "£150", 
    per: "3 sessions",
    features: ["3 Full Services", "Face Mask Included", "Free Product", "Valid for 60 Days"]
  }
];

const Pricing: React.FC = () => {
  return (
    <div className="pricing-page-wrapper">
      
      {/* Hero */}
      <section className="pricing-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="pricing-title"
          >
            TRANSPARENT PRICING
          </motion.h1>
          <p className="pricing-desc">
            Premium value for expert results. View our simple, all-inclusive pricing structure.
          </p>
        </div>
      </section>

      {/* Main Pricing List */}
      <section className="pricing-list-section">
        <div className="container pricing-list-container">
          <h2 className="pricing-section-title">Standard Services</h2>
          <div className="pricing-lines">
            {pricingList.map((item, idx) => (
              <motion.div 
                key={idx} 
                className="pricing-line-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="pricing-item-info">
                  <span className="pricing-item-name">{item.name}</span>
                  <span className="pricing-item-duration">{item.duration}</span>
                </div>
                <div className="pricing-dots"></div>
                <span className="pricing-item-price">{item.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="packages-section">
        <div className="container">
          <h2 className="pricing-section-title centered">Memberships & Packages</h2>
          <div className="packages-grid">
            {packages.map((pkg, idx) => (
              <motion.div 
                key={idx} 
                className="package-card"
                whileHover={{ scale: 1.02 }}
              >
                <div className="package-badge"><Zap size={14} /> Recommended</div>
                <h3 className="package-title">{pkg.title}</h3>
                <div className="package-price">
                  <span className="currency">{pkg.price}</span>
                  <span className="period">/ {pkg.per}</span>
                </div>
                <ul className="package-features">
                  {pkg.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                <button className="btn-filled package-btn">Get Started</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="payment-methods">
        <div className="container payment-box">
          <div className="payment-header">
            <CreditCard size={24} className="gold-icon" />
            <h3>Accepted Payment Methods</h3>
          </div>
          <div className="payment-icons">
            {["VISA", "MASTERCARD", "APPLE PAY", "GOOGLE PAY", "CASH"].map(m => (
              <span key={m} className="payment-chip">{m}</span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Pricing;
