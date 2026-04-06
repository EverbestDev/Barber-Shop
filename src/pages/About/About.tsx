import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import AboutContent from '../../components/layout/About/About'; 
import WhyChooseUs from '../../components/sections/home/WhyChooseUs';
import CTA from '../../components/sections/home/CTA';
import './About.css';

const AboutPage: React.FC = () => {
  const { onAuthOpen } = useOutletContext<{ onAuthOpen: () => void }>();

  return (
    <main className="about-page-wrapper">
      
      {/* Page Hero - Luxury Grand Entry */}
      <section className="about-page-hero">
        <div className="hero-overlay-dark"></div>
        <div className="container relative-z">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.span 
              className="about-hero-tag"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Since 2018
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="about-hero-title-grand"
            >
              CRAFTING <br /> <span className="text-gold">LEGENDS</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="about-hero-desc"
            >
              More than just a haircut. We're curators of style, heritage, and the modern gentleman's ritual.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Section Content */}
      <AboutContent />

      {/* Additional context */}
      <WhyChooseUs />

      <CTA onAuthOpen={onAuthOpen} />
    </main>
  );
};

export default AboutPage;
