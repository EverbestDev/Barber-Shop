import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: "James Anderson",
    role: "Regular Client",
    content: "The attention to detail at Bazetwo Barbers is unmatched. I've been to many luxury shops in London, but none capture the vibe and precision like these guys. Every cut is a masterpiece.",
    avatar: "/images/men/beardandfademen.jpg",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Thompson",
    role: "V.I.P Client",
    content: "The home service is a game changer for my schedule. I get the same high-end experience in my office without the commute. Professional, punctual, and consistently sharp.",
    avatar: "/images/men/menfadesignature3.jpg",
    rating: 5
  },
  {
    id: 3,
    name: "David Chen",
    role: "Local Legend",
    content: "Best skin fade in Catford, no question. The atmosphere is top-tier and the hospitality is even better. It's not just a haircut, it's a ritual I look forward toทุก second week.",
    avatar: "/images/men/baldmen1.jpg",
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="testimonials-section section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Word on the Street</span>
          <h2 className="section-title">Client Voices</h2>
        </div>

        <div className="testimonials-slider-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="testimonial-card"
            >
              <Quote className="quote-icon" size={60} />
              
              <div className="testimonial-rating">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} size={18} className="star-icon" fill="var(--gold)" />
                ))}
              </div>

              <p className="testimonial-content">
                "{testimonials[currentIndex].content}"
              </p>

              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src={testimonials[currentIndex].avatar} alt={testimonials[currentIndex].name} />
                </div>
                <div className="author-info">
                  <h4 className="author-name">{testimonials[currentIndex].name}</h4>
                  <p className="author-role">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="slider-nav">
            <button className="nav-btn prev" onClick={prev}><ChevronLeft size={24} /></button>
            <button className="nav-btn next" onClick={next}><ChevronRight size={24} /></button>
          </div>

          <div className="slider-dots">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
