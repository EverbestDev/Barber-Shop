import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Zap, Star, Users, Sparkles } from 'lucide-react';
import './WhyChooseUs.css';

const features = [
  {
    icon: <UserCheck size={32} />,
    title: "Master Barbers",
    desc: "Our team consists of highly trained professionals dedicated to the craft of precision grooming.",
    image: "/images/barbers/2.jpg"
  },
  {
    icon: <Zap size={32} />,
    title: "V.I.P Home Visit",
    desc: "Luxury grooming brought to your doorstep. Perfect for busy professionals wanting a private session.",
    image: "/images/viphomevisit.jpg"
  },
  {
    icon: <Users size={32} />,
    title: "Family Bonding",
    desc: "We specialize in Father & Son packages, providing a fun and sharp experience for the whole family.",
    image: "/images/familybonding.jpg"
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Pure Hygiene",
    desc: "Uncompromising hospital-grade sterilization for every tool and station between every single client.",
    image: "/images/purehygiene.jpg"
  },
  {
    icon: <Star size={32} />,
    title: "Premium Tools",
    desc: "We use only the finest razors, shears, and luxury scents to ensure a truly superior grooming result.",
    image: "/images/premiumtools.jpg"
  },
  {
    icon: <Sparkles size={32} />,
    title: "Luxury Lounge",
    desc: "Relax with a drink in our exclusive lounge before your cut. Every visit is built around your comfort.",
    image: "/images/LuxuryLounge.jpg"
  }
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="why-choose-us-section section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Superior Standards</span>
          <h2 className="section-title">Why Baze 2 Barbers?</h2>
        </div>

        <div className="why-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="why-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
            >
              <div className="why-image-wrapper">
                <img src={feature.image} alt={feature.title} />
                <div className="why-icon-overlay">{feature.icon}</div>
              </div>
              <div className="why-card-content">
                <h3 className="why-card-title">{feature.title}</h3>
                <p className="why-card-desc">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
