import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Watch, CheckCircle2 } from 'lucide-react';
import './ServicesPreview.css';

const services = [
  {
    title: "Signature Haircut",
    desc: "A personalized cut based on your face shape and hair type, finished with a precise line and styling.",
    price: "£35",
    time: "45 mins",
    image: "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Beard Sculpting",
    desc: "Luxury beard trim, shaping, and precise razor lining combined with a soothing hot towel treatment.",
    price: "£25",
    time: "30 mins",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "The Full Service",
    desc: "Our ultimate grooming package: Signature Haircut + Beard Sculpting + Relaxing Face Treatment.",
    price: "£55",
    time: "75 mins",
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=600&auto=format&fit=crop"
  }
];

const ServicesPreview: React.FC = () => {
  return (
    <section id="services" className="services-preview-section">
      <div className="section-header">
        <span className="section-tag">Featured Offerings</span>
        <h2 className="section-title">Master Craftsmanship</h2>
      </div>

      <div className="services-preview-grid">
        {services.map((service, index) => (
          <motion.div 
            key={index} 
            className="service-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
          >
            <div className="service-card-image">
              <img src={service.image} alt={service.title} />
              <div className="service-card-overlay">
                <button className="book-btn-mini">Book Service</button>
              </div>
            </div>
            <div className="service-card-content">
              <div className="service-card-top">
                <h3 className="service-card-title">{service.title}</h3>
                <span className="service-card-price">{service.price}</span>
              </div>
              <p className="service-card-desc">{service.desc}</p>
              <div className="service-card-footer">
                <span className="service-meta"><Watch size={14} /> {service.time}</span>
                <span className="service-meta"><CheckCircle2 size={14} /> Available Today</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="services-preview-cta">
        <button className="btn-filled">View Full Menu</button>
      </div>
    </section>
  );
};

export default ServicesPreview;
