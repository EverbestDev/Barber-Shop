import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import CTA from '../../components/sections/home/CTA';
import { useOutletContext } from 'react-router-dom';
import './Gallery.css';

const categories = ['All', 'Haircuts', 'Fades', 'Beard', 'Styling', 'Kids', 'Ladies'];

const galleryHeroSlides = [
  '/images/LuxuryLounge.jpg',
  '/images/barbers/2.jpg',
  '/images/viphomevisit.jpg',
  '/images/premiumtools.jpg',
  '/images/epertbarbers.jpg'
];

const staticImages = [
  // Base Images
  { id: 1, category: 'Haircuts', src: '/images/mensignature.jpg', title: 'Signature Cut' },
  { id: 2, category: 'Fades', src: '/images/taperfade.jpg', title: 'Sharp Skin Fade' },
  { id: 3, category: 'Beard', src: '/images/herobeard.jpg', title: 'Beard Sculpting' },
  { id: 6, category: 'Haircuts', src: '/images/InTheBarbershop.jpg', title: 'Classic Grooming' },

  // Men Collection
  { id: 7, category: 'Beard', src: '/images/men/beardandfademen.jpg', title: 'Premium Beard & Fade' },
  { id: 8, category: 'Beard', src: '/images/men/cleanbeard.jpg', title: 'Defined Beard Lineup' },
  { id: 9, category: 'Haircuts', src: '/images/men/curly.jpg', title: 'Natural Curly Texture' },
  { id: 11, category: 'Haircuts', src: '/images/men/skincutbaldmen.jpg', title: 'Precision Razor Head Shave' },
  { id: 12, category: 'Haircuts', src: '/images/men/viphomevisit.jpg', title: 'VIP Signature Cut' },
  { id: 13, category: 'Styling', src: '/images/men/youthbraid.jpg', title: 'Artistic Youth Braids' },
  { id: 14, category: 'Styling', src: '/images/men/youthbraid2.jpg', title: 'Intricate Braid Patterns' },
  { id: 34, category: 'Haircuts', src: '/images/men/baldmen1.jpg', title: 'Classic Clean Shave' },
  { id: 35, category: 'Haircuts', src: '/images/men/baldmen2.jpg', title: 'Elite Smooth Shave' },
  { id: 36, category: 'Beard', src: '/images/men/menbeardcuts.jpg', title: 'Artistic Beard Design' },
  { id: 37, category: 'Styling', src: '/images/men/menbraids.jpg', title: 'Signature Men Braids' },
  { id: 38, category: 'Styling', src: '/images/men/menbraids2.jpg', title: 'Patterned Braids' },
  { id: 39, category: 'Haircuts', src: '/images/men/menfadedread.jpg', title: 'Fade & Dread Lock Combination' },
  { id: 40, category: 'Fades', src: '/images/men/menfadesignature3.jpg', title: 'Master Level Skin Fade' },

  // Ladies Collection
  { id: 15, category: 'Ladies', src: '/images/ladies/womencurly.jpg', title: "Women's Curly Taper" },
  { id: 16, category: 'Ladies', src: '/images/ladies/womensig2.jpg', title: "Elite Women's Styling" },
  { id: 17, category: 'Ladies', src: '/images/ladies/womensignature.jpg', title: "Women's Master Cut" },
  { id: 18, category: 'Ladies', src: '/images/ladies/womentapperfade.jpg', title: "Sharp Female Taper" },
  { id: 41, category: 'Ladies', src: '/images/ladies/baldwomen1.jpg', title: "Elite Bold Shave" },
  { id: 42, category: 'Ladies', src: '/images/ladies/baldwomen2.jpg', title: "Graceful Clean Cut" },
  { id: 43, category: 'Ladies', src: '/images/ladies/womenfadesignature.jpg', title: "Signature Lady Fade" },
  { id: 44, category: 'Ladies', src: '/images/ladies/womensignaturecurly.jpg', title: "Artistic Curly Styling" },
  { id: 45, category: 'Ladies', src: '/images/ladies/womensignaturecut.jpg', title: "Master Female Styling" },

  // Kids Collection
  { id: 19, category: 'Kids', src: '/images/kids/childbarreltwists.jpg', title: 'Child Barrel Twists' },
  { id: 24, category: 'Kids', src: '/images/kids/fade.jpg', title: 'Classic Kid Fade' },
  { id: 25, category: 'Kids', src: '/images/kids/femalechilddeepfadepattern.jpg', title: 'Female Child Deep Fade' },
  { id: 26, category: 'Kids', src: '/images/kids/greatfade.jpg', title: 'Great Kid Fade' },
  { id: 27, category: 'Kids', src: '/images/kids/kidcut2.jpg', title: 'Clean Kid Cut' },
  { id: 28, category: 'Kids', src: '/images/kids/kidcutherobg.jpg', title: 'Signature Kid Design' },
  { id: 29, category: 'Kids', src: '/images/kids/kidcutsignature.jpg', title: 'Elite Kid Styling' },
  { id: 30, category: 'Kids', src: '/images/kids/kidlowcut.jpg', title: 'Kid Low Cut' },
  { id: 31, category: 'Kids', src: '/images/kids/kidslowcut.jpg', title: 'Balanced Kid Cut' },
  { id: 46, category: 'Kids', src: '/images/kids/childfadesignature.jpg', title: 'Sharp Child Fade' },
  { id: 47, category: 'Kids', src: '/images/kids/fadekidsignature.jpg', title: 'Elite Kid Fade' },
  { id: 48, category: 'Kids', src: '/images/kids/freshkidfadesignature.jpg', title: 'Fresh Kid Signature' },
  { id: 49, category: 'Kids', src: '/images/kids/kidlowcutsignature.jpg', title: 'Classic Kid Low Cut' },
  { id: 50, category: 'Kids', src: '/images/kids/kidsignaturevariant.jpg', title: 'Artistic Kid Variant' },
  { id: 51, category: 'Kids', src: '/images/kids/lowcutkid.jpg', title: 'Clean Child Low Cut' }
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
