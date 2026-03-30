import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HeroGallery.css';

gsap.registerPlugin(ScrollTrigger);

const HeroGallery: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Basic GSAP animation for the 3d curved carousel effect
    const ctx = gsap.context(() => {
      gsap.from('.gallery-item', {
        y: 100,
        opacity: 0,
        rotationX: -45,
        stagger: 0.1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 80%',
        }
      });
    }, galleryRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" className="hero-section" ref={galleryRef}>
      
      {/* Floating Elements like in the reference image */}
      <div className="float-icon" style={{ top: '15%', right: '20%' }}>✂️</div>
      <div className="float-icon" style={{ top: '25%', left: '15%', animationDelay: '1s' }}>💈</div>

      <div className="hero-text-content">
        <h1 className="hero-main-title">
          Elevate your Look,<br />
          Find your <span className="highlight-text">Focus</span>
        </h1>
        <p className="hero-subtitle">A creative hub for people who value precision grooming.</p>
      </div>

      <div className="curved-gallery-container">
        <div className="gallery-track">
          <div className="gallery-item item-1">
            <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=600&fit=crop" alt="Barbershop" />
          </div>
          <div className="gallery-item item-2">
            <img src="https://images.unsplash.com/photo-1585747860715-2ba3f2233f21?w=400&h=600&fit=crop" alt="Haircut" />
          </div>
          <div className="gallery-item item-3 item-center">
            <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=600&fit=crop" alt="Beard trim" />
          </div>
          <div className="gallery-item item-4">
            <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=600&fit=crop" alt="Hair styling" />
          </div>
          <div className="gallery-item item-5">
            <img src="https://images.unsplash.com/photo-1534066060136-22442cf2fbdc?w=400&h=600&fit=crop" alt="Barber tools" />
          </div>
        </div>
      </div>
      
      <div className="hero-bottom-action" style={{ position: 'relative' }}>
        {/* Floating Arrow pointing to button */}
        <div className="float-icon" style={{ top: '-40px', right: '-40px', transform: 'rotate(15deg)', fontSize: '1.5rem', zIndex: 30 }}>
           ⬇️ 
        </div>
        <button className="book-now-btn large-btn">
          Reserve your Seat 
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 16 16 12 12 8"></polyline>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroGallery;
