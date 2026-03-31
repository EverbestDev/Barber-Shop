import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?q=80&w=2000&auto=format&fit=crop",
    title: "PREMIUM GROOMING",
    subtitle: "Exceptional cuts, precise styling, and unmatched attention to detail designed for the modern gentleman."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1512592534063-8aee09da4cbb?q=80&w=2000&auto=format&fit=crop",
    title: "KIDS HAIR STYLE",
    subtitle: "Safe, comfortable, and stylish haircuts for kids. We ensure a fun experience while keeping them sharp."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2000&auto=format&fit=crop",
    title: "BEARD SCULPTING",
    subtitle: "Keep your facial hair sharp and defined with precise trimming, shaping, and soothing hot towel shaves."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2000&auto=format&fit=crop",
    title: "SHARP SKIN FADES",
    subtitle: "Seamless precision fades executed flawlessly by expert barbers for your sharpest, cleanest look yet."
  }
];

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000); // Increased interval to 7s to allow the smooth animation finish
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="hero-section">
      
      {/* Background changes faster and first */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          key={`bg-${current}`}
          className="hero-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <img src={slides[current].image} alt={slides[current].title} />
        </motion.div>
      </AnimatePresence>
      
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={`text-${current}`}
            className="hero-text-box"
            /* Start far left */
            initial={{ opacity: 0, x: -200 }}
            /* Extremely smooth slide in from left to center, delayed to happen AFTER bg */
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ 
              duration: 1.5, /* Sluggish smooth feel */
              delay: 0.5, /* Waits for the background fade to almost finish */
              ease: [0.16, 1, 0.3, 1] /* Custom sluggish cubic-bezier for a hyper-smooth stop */
            }}
          >
            <span className="hero-tagline">Excellence in Craft</span>
            <h1 className="hero-title">{slides[current].title}</h1>
            
            <p className="hero-subtitle">{slides[current].subtitle}</p>
            
            <div className="hero-actions">
              <button className="btn-filled">Book Now</button>
              <button className="btn-outlined">Contact Us</button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slider Indicators */}
      <div className="slider-indicators">
        {slides.map((_, index) => (
          <button 
            key={index}
            className={`indicator ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
