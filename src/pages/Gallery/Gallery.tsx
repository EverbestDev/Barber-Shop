import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import CTA from '../../components/sections/home/CTA';
import { useOutletContext } from 'react-router-dom';
import './Gallery.css';

const categories = ['All', 'Haircuts', 'Fades', 'Beard', 'Styling'];

const images = [
  { id: 1, category: 'Haircuts', src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop', title: 'Classic Side Part' },
  { id: 2, category: 'Fades', src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop', title: 'Sharp Skin Fade' },
  { id: 3, category: 'Beard', src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop', title: 'Beard Sculpting' },
  { id: 4, category: 'Styling', src: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?q=80&w=800&auto=format&fit=crop', title: 'Textured Crop' },
  { id: 5, category: 'Haircuts', src: 'https://images.unsplash.com/photo-1512592534063-8aee09da4cbb?q=80&w=800&auto=format&fit=crop', title: 'Pompadour' },
  { id: 6, category: 'Fades', src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=800&auto=format&fit=crop', title: 'Burst Fade' }
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
            MASTERPIECE GALLERY
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
