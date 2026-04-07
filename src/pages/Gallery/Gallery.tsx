import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import CTA from '../../components/sections/home/CTA';
import { useOutletContext } from 'react-router-dom';
import './Gallery.css';

const categories = ['All', 'Haircuts', 'Fades', 'Beard', 'Styling', 'Kids', 'Ladies'];

const galleryHeroSlides = [
  '/images/beardshavinghero.jpg',
  '/images/masterbarbers.jpg',
  '/images/viphomevisit.jpg',
  '/images/premiumtools.jpg'
];

const staticImages = [
  // Original / Base Images
  { id: 1, category: 'Haircuts', src: '/images/mensignature.jpg', title: 'Signature Cut' },
  { id: 2, category: 'Fades', src: '/images/taperfade.jpg', title: 'Sharp Skin Fade' },
  { id: 3, category: 'Beard', src: '/images/beardshaving.jpg', title: 'Beard Sculpting' },
  { id: 6, category: 'Haircuts', src: '/images/In The Barbershop.jpg', title: 'Classic Grooming' },

  // Men Collection
  { id: 7, category: 'Beard', src: '/images/men/beardandfade.jpg', title: 'Premium Beard & Fade' },
  { id: 8, category: 'Beard', src: '/images/men/cleanbeard.jpg', title: 'Defined Beard Lineup' },
  { id: 9, category: 'Haircuts', src: '/images/men/curly.jpg', title: 'Natural Curly Texture' },
  { id: 10, category: 'Fades', src: '/images/men/hottappperfade.jpg', title: 'Hot Taper Fade' },
  { id: 11, category: 'Haircuts', src: '/images/men/skincutbaldmen.jpg', title: 'Precision Razor Head Shave' },
  { id: 12, category: 'Haircuts', src: '/images/men/viphomevisit.jpg', title: 'VIP Signature Cut' },
  { id: 13, category: 'Styling', src: '/images/men/youthbraid.jpg', title: 'Artistic Youth Braids' },
  { id: 14, category: 'Styling', src: '/images/men/youthbraid2.jpg', title: 'Intricate Braid Patterns' },

  // Ladies Collection
  { id: 15, category: 'Ladies', src: '/images/ladies/womencurly.jpg', title: "Women's Curly Taper" },
  { id: 16, category: 'Ladies', src: '/images/ladies/womensig2.jpg', title: "Elite Women's Styling" },
  { id: 17, category: 'Ladies', src: '/images/ladies/womensignature.jpg', title: "Women's Master Cut" },
  { id: 18, category: 'Ladies', src: '/images/ladies/womentapperfade.jpg', title: "Sharp Female Taper" },

  // Kids Collection
  { id: 19, category: 'Kids', src: '/images/kids/childbarreltwists.jpg', title: 'Child Barrel Twists' },
  { id: 20, category: 'Kids', src: '/images/kids/childfade.jpg', title: 'Child Fade' },
  { id: 21, category: 'Kids', src: '/images/kids/coolfade.jpg', title: 'Cool Child Fade' },
  { id: 22, category: 'Kids', src: '/images/kids/curlychild.jpg', title: 'Curly Child Style' },
  { id: 23, category: 'Kids', src: '/images/kids/curlyfadekid.jpg', title: 'Curly Fade Kid' },
  { id: 24, category: 'Kids', src: '/images/kids/fade.jpg', title: 'Classic Kid Fade' },
  { id: 25, category: 'Kids', src: '/images/kids/femalechilddeepfadepattern.jpg', title: 'Female Child Deep Fade' },
  { id: 26, category: 'Kids', src: '/images/kids/greatfade.jpg', title: 'Great Kid Fade' },
  { id: 27, category: 'Kids', src: '/images/kids/kidcut2.jpg', title: 'Clean Kid Cut' },
  { id: 28, category: 'Kids', src: '/images/kids/kidcutherobg.jpg', title: 'Signature Kid Design' },
  { id: 29, category: 'Kids', src: '/images/kids/kidcutsignature.jpg', title: 'Elite Kid Styling' },
  { id: 30, category: 'Kids', src: '/images/kids/kidlowcut.jpg', title: 'Kid Low Cut' },
  { id: 31, category: 'Kids', src: '/images/kids/kidslowcut.jpg', title: 'Balanced Kid Cut' },
  { id: 32, category: 'Kids', src: '/images/kids/signatureandcurlyfade.jpg', title: 'Signature Curly Fade' },
  { id: 33, category: 'Kids', src: '/images/kids/urlyfade.jpg', title: 'Curly Artistic Fade' }
];

const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const { onAuthOpen } = useOutletContext<{ onAuthOpen: () => void }>();

  // Rotate hero backgrounds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % galleryHeroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const [shuffledImages, setShuffledImages] = useState<typeof staticImages>([]);

  // Shuffle images on component mount (once)
  useEffect(() => {
    const shuffled = [...staticImages].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  }, []);

  const filteredImages = activeFilter === 'All' 
    ? (shuffledImages.length > 0 ? shuffledImages : staticImages)
    : (shuffledImages.length > 0 ? shuffledImages : staticImages).filter(img => img.category === activeFilter);

  return (
    <div className="gallery-page-wrapper">
      
      {/* Dynamic Hero with Bg Transitions */}
      <section className="gallery-hero">
        <AnimatePresence mode="wait">
          <motion.div 
            key={heroIndex}
            className="gallery-hero-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ backgroundImage: `url(${galleryHeroSlides[heroIndex]})` }}
          />
        </AnimatePresence>
        <div className="hero-overlay-darker"></div>
        
        <div className="container relative-z">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="gallery-title"
          >
            MASTERPIECE <br /> <span className="text-gold">GALLERY</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="gallery-desc"
          >
            A visual showcase of our dedication to the craft. Shuffled for variety, refined for mastery.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="gallery-filters-section">
        <div className="container flex-center">
          <div className="filter-chips">
            {categories.map(cat => (
              <button 
                className={`filter-chip ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="gallery-grid-section">
        <div className="container">
          <motion.div layout className="gallery-masonry">
            <AnimatePresence mode='wait'>
              {filteredImages.map((img) => (
                <motion.div 
                  layout
                  key={img.id} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="gallery-item"
                  onClick={() => setSelectedImage(img.src)}
                >
                  <img src={img.src} alt={img.title} />
                  <div className="gallery-item-overlay">
                    <Maximize2 size={24} />
                    <span className="item-category">{img.category}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Simple Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button className="close-lightbox"><X size={32} /></button>
            <motion.img 
              src={selectedImage} 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <CTA onAuthOpen={onAuthOpen} />

    </div>
  );
};

export default Gallery;
