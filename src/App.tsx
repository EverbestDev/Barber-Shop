import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Scissors, ShoppingBag, Clock, MapPin, Phone, ChevronRight } from 'lucide-react'
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

import Navbar from './components/layout/Navbar/Navbar'
import Hero from './components/layout/Hero/Hero'
import About from './components/layout/About/About'

function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)

    // Scroll reveal animations
    const revealElements = document.querySelectorAll('.service-card')
    revealElements.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app-wrapper">
      <motion.div className="progress-bar" style={{ scaleX, position: 'fixed', top: 0, left: 0, right: 0, height: '4px', backgroundColor: 'var(--gold)', zIndex: 1001, transformOrigin: '0%' }} />

      {/* Navigation */}
      <Navbar isScrolled={isScrolled} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Hero Section */}
      <Hero />

      {/* Services */}
      <section id="services" style={{ padding: '8rem 0', background: 'var(--primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span className="hero-subtitle">MASTER CRAFTSMANSHIP</span>
            <h2 className="title-serif" style={{ fontSize: '3.5rem' }}>Core Services</h2>
            <div style={{ width: '60px', height: '2px', background: 'var(--gold)', margin: '1.5rem auto' }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            <div className="service-card">
              <Scissors className="service-icon" />
              <h3 className="title-serif" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Hair Design</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Tailored haircuts that complement your style and facial structure. From classic to contemporary.</p>
              <a href="#" className="nav-link" style={{ fontSize: '0.75rem' }}>Explore <ChevronRight size={14} style={{ verticalAlign: 'middle' }} /></a>
            </div>

            <div className="service-card">
              <ShoppingBag className="service-icon" />
              <h3 className="title-serif" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Beard Sculpting</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Expert shaping and grooming with premium oils to keep your facial hair looking its best.</p>
              <a href="#" className="nav-link" style={{ fontSize: '0.75rem' }}>Explore <ChevronRight size={14} style={{ verticalAlign: 'middle' }} /></a>
            </div>

            <div className="service-card">
              <Clock className="service-icon" />
              <h3 className="title-serif" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>The Ritual</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Our ultimate experience featuring a haircut, beard trim, hot towel, and scalp massage.</p>
              <a href="#" className="nav-link" style={{ fontSize: '0.75rem' }}>Explore <ChevronRight size={14} style={{ verticalAlign: 'middle' }} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '8rem 0', background: 'var(--secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '5rem' }}>
            <div>
              <span className="hero-subtitle">THE DETAILS</span>
              <h2 className="title-serif" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Exquisite Services & Pricing</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '400px' }}>
                We believe in providing value through excellence. Every service includes a personalized consultation.
              </p>
              <button className="btn-primary">View Full Menu</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="pricing-row">
                <span className="title-serif" style={{ fontSize: '1.25rem' }}>Classic Haircut</span>
                <span className="text-gold" style={{ fontSize: '1.25rem', fontWeight: '600' }}>$45</span>
              </div>
              <div className="pricing-row">
                <span className="title-serif" style={{ fontSize: '1.25rem' }}>Signature Fade</span>
                <span className="text-gold" style={{ fontSize: '1.25rem', fontWeight: '600' }}>$55</span>
              </div>
              <div className="pricing-row">
                <span className="title-serif" style={{ fontSize: '1.25rem' }}>Beard Sculpt & Shape</span>
                <span className="text-gold" style={{ fontSize: '1.25rem', fontWeight: '600' }}>$35</span>
              </div>
              <div className="pricing-row">
                <span className="title-serif" style={{ fontSize: '1.25rem' }}>The Royal Shave</span>
                <span className="text-gold" style={{ fontSize: '1.25rem', fontWeight: '600' }}>$65</span>
              </div>
              <div className="pricing-row">
                <span className="title-serif" style={{ fontSize: '1.25rem' }}>Head Shave</span>
                <span className="text-gold" style={{ fontSize: '1.25rem', fontWeight: '600' }}>$40</span>
              </div>
              <div className="pricing-row">
                <span className="title-serif" style={{ fontSize: '1.25rem' }}>Youth Modern Cut</span>
                <span className="text-gold" style={{ fontSize: '1.25rem', fontWeight: '600' }}>$35</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '5rem 0', background: 'var(--primary)', borderTop: '1px solid rgba(197, 160, 89, 0.1)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="nav-logo" style={{ marginBottom: '3rem', fontSize: '2.5rem' }}>
            THE<span className="text-gold"> BABER</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
            <MapPin size={24} className="text-gold" />
            <Phone size={24} className="text-gold" />
            <FaInstagram size={24} className="text-gold" />
            <FaFacebook size={24} className="text-gold" />
            <FaTwitter size={24} className="text-gold" />
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            © 2024 The Baber Shop. Crafted with precision.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
