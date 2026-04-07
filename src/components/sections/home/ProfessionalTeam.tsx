import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './ProfessionalTeam.css';

const team = [
  {
    name: "Master J",
    role: "Senior Barber & Founder",
    image: "/images/barbers/1.jpg",
    bio: "Over 15 years of absolute mastery in traditional grooming and urban styling."
  },
  {
    name: "Dexter",
    role: "Lead Stylist",
    image: "/images/barbers/2.jpg",
    bio: "The specialist for sharp skin fades and contemporary beard design."
  },
  {
    name: "Leo 'The Blade'",
    role: "Master Artisan",
    image: "/images/barbers/3.jpg",
    bio: "Expert in straight-razor precision and luxury hot-towel experiences."
  },
  {
    name: "Sarah V.",
    role: "Executive Stylist",
    image: "/images/barbers/4.jpg",
    bio: "Specializing in family cuts and premium hair health treatments."
  }
];

const ProfessionalTeam: React.FC = () => {
  return (
    <section className="team-section section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">The Elite Crew</span>
          <h2 className="section-title">Meet Our Professionals</h2>
        </div>

        <div className="team-grid">
          {team.map((member, index) => (
            <motion.div 
              key={index} 
              className="team-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
            >
              <div className="team-image-box">
                <img src={member.image} alt={member.name} />
                <div className="team-social-overlay">
                  <FaInstagram size={20} />
                  <FaTwitter size={20} />
                  <FaEnvelope size={20} />
                </div>
              </div>
              <div className="team-info">
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <div className="team-bio-box">
                  <p className="team-bio">{member.bio}</p>
                </div>
                <Link to="/booking" className="team-book-btn">Book Session</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalTeam;
