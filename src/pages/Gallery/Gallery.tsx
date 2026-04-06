import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import CTA from '../../components/sections/home/CTA';
import { useOutletContext } from 'react-router-dom';
import './Gallery.css';

const categories = ['All', 'Haircuts', 'Fades', 'Beard', 'Styling'];

const images = [
  { id: 1, category: 'Haircuts', src: '/images/mensignature.jpg', title: 'Signature Cut' },
  { id: 2, category: 'Fades', src: '/images/taperfade.jpg', title: 'Sharp Skin Fade' },
  { id: 3, category: 'Beard', src: '/images/beardshaving.jpg', title: 'Beard Sculpting' },
  { id: 4, category: 'Haircuts', src: '/images/womensignature.jpg', title: "Women's Signature" },
  { id: 5, category: 'Fades', src: '/images/womentapperfade.jpg', title: "Women's Taper Fade" },
  { id: 6, category: 'Haircuts', src: '/images/In The Barbershop.jpg', title: 'Classic Grooming' }
];

const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { onAuthOpen } = useOutletContext<{ onAuthOpen: () => void }>();

  const filteredImages = activeFilter === 'All' 
    ? images 
    : images.filter(img => img.category === activeFilter);

  return (
    <div className="gallery-page-wrapper">
      
      {/* Hero */}
      <section className="gallery-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="gallery-title"
          >
            MASTERPIECE <br /> GALLERY
          </motion.h1>
          <p className="gallery-desc">A visual showcase of our dedication to the craft.</p>
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
            <AnimatePresence mode='popLayout'>
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
