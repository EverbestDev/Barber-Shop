import React from 'react';
import { motion } from 'framer-motion';
import { Watch, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ServicesPreview.css';

const services = [
  {
    id: 1,
    title: "Signature Haircut",
    category: "In-Studio",
    desc: "A personalized cut based on your face shape and hair type, finished with a precise line and styling.",
    price: "£20",
    time: "45 mins",
    image: "/images/mensignature.jpg"
  },
  {
    id: 3,
    title: "Beard Sculpture",
    category: "In-Studio",
    desc: "Luxury beard trim, shaping, and precise razor lining combined with a soothing hot towel treatment.",
    price: "£15",
    time: "30 mins",
    image: "/images/herobeard.jpg"
  },
  {
    id: 8,
    title: "Baby Cut",
    category: "Family Group",
    desc: "Gentle and stylish haircuts for the little ones. We make sure they feel comfortable and look sharp.",
    price: "£15",
    time: "30 mins",
    image: "/images/kids/kidcutsignature.jpg"
  },
  {
    id: 6,
    title: "Women's Taper Fade",
    category: "Specialized",
    desc: "Edgy and precise taper fades for women. A bold look executed with artistic precision and flair.",
    price: "£25",
    time: "60 mins",
    image: "/images/womentapperfade.jpg"
  },
  {
    id: 7,
    title: "Women's Signature",
    category: "Specialized",
    desc: "Customized women's styling and cutting. From classic bobs to modern pixie cuts, tailored to you.",
    price: "£25",
    time: "60 mins",
    image: "/images/womensignature.jpg"
  },
  {
    id: 2,
    title: "Skin Fade Master",
    category: "In-Studio",
    desc: "Seamless, high-precision fades executed with extreme detail. Our barbers are masters of the blend.",
    price: "£20",
    time: "60 mins",
    image: "/images/taperfade.jpg"
  },
  {
    id: 103,
    title: "The VIP Home Visit",
    category: "Home Service",
    desc: "Experience our premium grooming from the comfort of your home. We bring the full studio to your doorstep.",
    price: "£40",
    time: "60 mins",
    image: "/images/men/viphomevisit.jpg"
  },
  {
    id: 201,
    title: "Father & Son Pack",
    category: "Family Group",
    desc: "A bonding experience for the duo. Includes two signature cuts and styling for dad and the little champ.",
    price: "£35",
    time: "90 mins",
    image: "/images/kidcut2.jpg"
  },
  {
    id: 203,
    title: "Grooming Party",
    category: "Group Booking",
    desc: "Booking for 3+ people. Perfect for weddings, events, or a group day out. Includes refreshments and VIP tools.",
    price: "From £100",
    time: "3 hours+",
    image: "/images/epertbarbers.jpg"
  }
];

const ServicesPreview: React.FC = () => {
  return (
    <section id="services" className="services-preview-section section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Featured Offerings</span>
          <h2 className="section-title">Master Craftsmanship</h2>
        </div>

        <div className="services-preview-grid">
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              <div className="service-card-image">
                <img src={service.image} alt={service.title} />
                <div className="service-card-overlay">
                  <span className="overlay-tag">{service.title}</span>
                </div>
              </div>
              <div className="service-card-content">
                <div className="service-card-top">
                  <h3 className="service-card-title">{service.title}</h3>
                  <span className="service-card-price">{service.price}</span>
                </div>
                <p className="service-card-desc">{service.desc}</p>
                <div className="service-card-footer">
                  <div className="footer-meta-box">
                    <span className="service-meta"><Watch size={14} /> {service.time}</span>
                    <span className="service-meta"><CheckCircle2 size={14} /> Available</span>
                  </div>
                  <Link to={`/booking?serviceId=${service.id}`} className="book-btn-direct">Book Now</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="services-preview-cta">
          <Link to="/services" className="btn-filled">View Full Menu</Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
