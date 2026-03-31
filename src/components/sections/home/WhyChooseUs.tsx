import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Zap, Star, Users, Sparkles } from 'lucide-react';
import './WhyChooseUs.css';

const features = [
  {
    icon: <UserCheck size={32} />,
    title: "Master Barbers",
    desc: "Our team consists of highly trained professionals dedicated to the craft of precision grooming.",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&auto=format&fit=crop"
  },
  {
    icon: <Zap size={32} />,
    title: "V.I.P Home Visit",
    desc: "Luxury grooming brought to your doorstep. Perfect for busy professionals wanting a private session.",
    image: "https://images.unsplash.com/photo-1621605815841-aa34440051e7?q=80&w=600&auto=format&fit=crop"
  },
  {
    icon: <Users size={32} />,
    title: "Family Bonding",
    desc: "We specialize in Father & Son packages, providing a fun and sharp experience for the whole family.",
    image: "https://images.unsplash.com/photo-1634449571010-023595e5b3ff?q=80&w=600&auto=format&fit=crop"
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Pure Hygiene",
    desc: "Uncompromising hospital-grade sterilization for every tool and station between every single client.",
    image: "https://images.unsplash.com/photo-1541533261642-16eef8841b5a?q=80&w=600&auto=format&fit=crop"
  },
  {
    icon: <Star size={32} />,
    title: "Premium Tools",
    desc: "We use only the finest razors, shears, and luxury scents to ensure a truly superior grooming result.",
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=600&auto=format&fit=crop"
  },
  {
    icon: <Sparkles size={32} />,
    title: "Luxury Lounge",
    desc: "Relax with a drink in our exclusive lounge before your cut. Every visit is built around your comfort.",
    image: "https://images.unsplash.com/photo-1512592534063-8aee09da4cbb?q=80&w=600&auto=format&fit=crop"
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
