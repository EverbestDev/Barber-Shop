import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { CheckCircle2, Play, Pause } from 'lucide-react';
import './About.css';

const About: React.FC = () => {
  const ref = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8 } 
    },
  };

  return (
    <section id="about" className="about-section section-padding" ref={ref}>
      <div className="about-container">
        
        {/* Left Side: Image */}
        <motion.div 
          className="about-image-wrapper"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <video 
            ref={videoRef}
            className={`about-video-card ${isPlaying ? 'playing' : 'paused'}`}
            loop 
            muted 
            playsInline
            poster="/images/LuxuryLounge.jpg"
            onClick={togglePlay}
          >
            <source src="/videos/homectavideo.mp4" type="video/mp4" />
          </video>
          <div className="about-video-play-overlay" onClick={togglePlay}>
            {isPlaying ? <Pause size={48} /> : <Play size={48} fill="currentColor" />}
          </div>
        </motion.div>
 
        {/* Right Side: Text & Content */}
        <motion.div 
          className="about-text-content"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="section-tag">
            Our Philosophy
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="section-title">
            Elevating the Art of Premium Grooming.
          </motion.h2>
          
          <motion.p variants={itemVariants} className="about-description">
            At Baze 2 Barbers, we believe grooming is more than just a routine⣔it's a ritual. We blend modern styling sensibilities with classic barbering techniques to deliver an unparalleled experience tailored specifically to you.
          </motion.p>
          
          <motion.p variants={itemVariants} className="about-description" style={{ marginBottom: '2rem' }}>
            Whether you need a sharp skin fade, precise beard sculpting, or a classic hot towel shave, our master barbers are dedicated to making sure you leave the chair looking and feeling your absolute best.
          </motion.p>
 
          <motion.ul variants={itemVariants} className="about-features">
            <li><CheckCircle2 className="feature-icon" /> Master Barbers with Years of Experience</li>
            <li><CheckCircle2 className="feature-icon" /> Premium Grooming Products</li>
            <li><CheckCircle2 className="feature-icon" /> Relaxing & Exclusive Atmosphere</li>
          </motion.ul>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
