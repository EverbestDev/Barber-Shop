import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Scissors, Sparkles } from 'lucide-react';
import './WhyChooseUs.css';

const features = [
  {
    icon: <UserCheck size={32} />,
    title: "Master Barbers",
    desc: "Our team consists of highly trained professionals dedicated to the craft of precision grooming."
  },
  {
    icon: <Scissors size={32} />,
    title: "Modern Styling",
    desc: "We stay ahead of current trends to bring you the sharpest, most modern looks in the industry."
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Safe & Sanitized",
    desc: "Your safety is our priority. We maintain hospital-grade cleanliness for every client."
  },
  {
    icon: <Sparkles size={32} />,
    title: "Premium Experience",
    desc: "From hot towel treatments to cold drinks, every visit is designed for your relaxation."
  }
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="why-choose-us-section">
      <div className="why-container">
        <div className="why-header">
          <span className="section-tag">Superior Standards</span>
          <h2 className="section-title">Why Baze 2 Barbers?</h2>
        </div>

        <div className="why-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="why-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="why-icon-box">{feature.icon}</div>
              <h3 className="why-card-title">{feature.title}</h3>
              <p className="why-card-desc">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
