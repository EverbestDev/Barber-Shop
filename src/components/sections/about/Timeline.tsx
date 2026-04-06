import React from 'react';
import { motion } from 'framer-motion';
import './Timeline.css';

const timelineEvents = [
  {
    year: '2018',
    title: 'THE BEGINNING',
    description: 'Baze 2 Barbers opened its doors in Catford with a simple mission: to provide the sharpest fades and high-end grooming in an atmosphere that feels like home.'
  },
  {
    year: '2020',
    title: 'THE EXPANSION',
    description: 'Recognized as Catford\'s premium grooming destination, we expanded our team and space to accommodate our growing community of discerning gentlemen.'
  },
  {
    year: '2022',
    title: 'AWARD WINNING CRAFT',
    description: 'Voted London\'s "Best Independent Barbershop" by local style critics. We solidified our reputation for precision and artistic excellence in every cut.'
  },
  {
    year: '2024',
    title: 'THE NEW ERA',
    description: 'Launching our digital booking platform and exclusive product line, merging traditional barbering heritage with modern convenience and style.'
  }
];

const Timeline: React.FC = () => {
  return (
    <section className="timeline-section section-padding">
      <div className="container">
        <div className="section-header center-align">
          <span className="section-tag">Our Journey</span>
          <h2 className="section-title">THE LEGACY OF <br /> <span className="brand-italic">BAZE 2 BARBERS</span></h2>
        </div>

        <div className="timeline-container">
          <div className="timeline-line"></div>
          
          {timelineEvents.map((event, index) => (
            <motion.div 
              key={index}
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="timeline-content">
                <div className="timeline-year">{event.year}</div>
                <h3 className="timeline-title">{event.title}</h3>
                <p className="timeline-desc">{event.description}</p>
                <div className="timeline-dot"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
