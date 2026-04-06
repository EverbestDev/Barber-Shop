import React, { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './VideoShowcase.css';

const VideoShowcase: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setShowControls(true);
      } else {
        videoRef.current.play();
        // Delay hiding controls to let user see feedback
        setTimeout(() => isPlaying && setShowControls(false), 2000);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMouseEnter = () => setShowControls(true);
  const handleMouseLeave = () => isPlaying && setShowControls(false);

  return (
    <section className="video-showcase-section section-padding">
      <div className="video-showcase-container">
        <div 
          className={`video-viewport ${isPlaying ? 'is-playing' : 'is-paused'}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <video 
            ref={videoRef}
            className="main-showcase-video"
            loop
            muted
            playsInline
            poster="/images/LuxuryLounge.jpg" /* Updated banner image */
          >
            <source src="/videos/homectavideo.mp4" type="video/mp4" />
          </video>
          
          <div className="video-glass-overlay" onClick={togglePlay}>
            <AnimatePresence>
              {showControls && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-controller-card"
                >
                  <div className="play-pulse-ring"></div>
                  <button className="glass-play-btn">
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" style={{ marginLeft: '4px' }} />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!isPlaying && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="video-branding-overlay"
              >
                <span className="branding-tag">Exclusive Experience</span>
                <h3 className="branding-title">MASTERY IN MOTION</h3>
              </motion.div>
            )}
          </div>

          <div className="video-edge-glow"></div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
