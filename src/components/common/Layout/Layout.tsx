import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import AuthDrawer from '../AuthDrawer/AuthDrawer';
import CookieConsent from '../CookieConsent/CookieConsent';

const Layout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  useEffect(() => {
     if (searchParams.get('session_expired') === 'true') {
         setIsAuthDrawerOpen(true);
     }
  }, [location.search]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Reset scroll on path change
  useEffect(() => {
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when drawer is open
  useEffect(() => {
    if (isAuthDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isAuthDrawerOpen]);

  return (
    <div className={`app-layout ${isAuthDrawerOpen ? 'drawer-open' : ''}`}>
      {/* Scroll Progress Bar */}
      <motion.div className="progress-bar" style={{ scaleX }} />

      <Navbar 
        isScrolled={isScrolled} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
        onAuthOpen={() => setIsAuthDrawerOpen(true)}
      />
      
      <div className="main-content">
        <Outlet context={{ onAuthOpen: () => setIsAuthDrawerOpen(true) }} />
      </div>

      <AnimatePresence>
        {isAuthDrawerOpen && (
          <>
            <motion.div 
              className="drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuthDrawerOpen(false)}
            ></motion.div>
            <AuthDrawer onClose={() => setIsAuthDrawerOpen(false)} />
          </>
        )}
      </AnimatePresence>

      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Layout;
