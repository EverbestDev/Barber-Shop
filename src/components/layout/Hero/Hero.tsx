import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Hero.css';

const slides = [
  {
    id: 1,
    image: "/images/sprayingsprayonhairlandscape.jpg",
    title: "PREMIUM GROOMING",
    subtitle: "Exceptional cuts, precise styling, and unmatched attention to detail designed for the modern gentleman."
  },
  {
    id: 2,
    image: "/images/kidcutherobg.jpg",
    title: "KIDS HAIR STYLE",
    subtitle: "Safe, comfortable, and stylish haircuts for kids. We ensure a fun experience while keeping them sharp."
  },
  {
    id: 3,
    image: "/images/beardshavinghero.jpg",
    title: "BEARD SCULPTING",
    subtitle: "Keep your facial hair sharp and defined with precise trimming, shaping, and soothing hot towel shaves."
  },
  {
    id: 4,
    image: "/images/taperfade.jpg",
    title: "SHARP SKIN FADES",
    subtitle: "Seamless precision fades executed flawlessly by expert barbers for your sharpest, cleanest look yet."
  },
  {
    id: 5,
    image: "/images/womensignature.jpg",
    title: "WOMEN'S STYLING",
    subtitle: "From precision taper fades to creative signature cuts, we provide expert styling tailored for women."
  }
];

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="hero-section">
      
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
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ 
              duration: 1.5,
              delay: 0.5,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <span className="hero-tagline">Excellence in Craft</span>
            <h1 className="hero-title">{slides[current].title}</h1>
            
            <p className="hero-subtitle">{slides[current].subtitle}</p>
            
            <div className="hero-actions">
              <Link to="/booking" className="btn-filled">Book Your Chair</Link>
              <Link to="/contact" className="btn-outlined">Contact Us</Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

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
