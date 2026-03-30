import React from 'react';
import { motion } from 'framer-motion';
import { Watch, Info } from 'lucide-react';
import './Services.css';

const categories = [
  {
    id: 'haircuts',
    title: 'Precision Haircuts',
    services: [
      { name: "Signature Haircut", desc: "Our most popular service, tailored exactly to your head shape and hair type.", price: "£35", time: "45 mins" },
      { name: "Skin Fade", desc: "Expert fading from skin to your desired length on top.", price: "£38", time: "60 mins" },
      { name: "Kids Haircut", desc: "Sharp styles for our younger gentlemen under 14.", price: "£20", time: "30 mins" },
      { name: "Seniors (65+)", desc: "Classic cuts for our established gentlemen.", price: "£20", time: "30 mins" }
    ]
  },
  {
    id: 'beard',
    title: 'Beard & Face',
    services: [
      { name: "Beard Sculpture", desc: "A detailed trim, shape and razor line to define your facial hair.", price: "£25", time: "30 mins" },
      { name: "Hot Towel Shave", desc: "Traditional straight-razor shave with steam and soothing oils.", price: "£30", time: "45 mins" },
      { name: "The Beard & Mask", desc: "Sculpture combined with a detoxifying charcoal face mask.", price: "£35", time: "45 mins" }
    ]
  },
  {
    id: 'packages',
    title: 'Grooming Packages',
    services: [
      { name: "The Executive", desc: "Signature Haircut + Beard Sculpture. The full look.", price: "£55", time: "75 mins" },
      { name: "The Royal Treatment", desc: "Haircut + Beard Sculpture + Face Mask + Nose/Ear Wax.", price: "£75", time: "105 mins" }
    ]
  }
];

const Services: React.FC = () => {
  return (
    <div className="services-page-wrapper">
      
      {/* Page Hero */}
      <section className="services-page-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="services-hero-title"
          >
            OUR SERVICES
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="services-hero-desc"
          >
            Tailored grooming experiences designed to help you projects the best version of yourself.
          </motion.p>
        </div>
      </section>

      {/* Services List */}
      <section className="services-list-section">
        <div className="container">
          {categories.map((category, catIdx) => (
            <div key={category.id} className="service-category">
              <h2 className="category-title">{category.title}</h2>
              <div className="services-grid">
                {category.services.map((service, sIdx) => (
                  <motion.div 
                    key={sIdx} 
                    className="service-card-full"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: sIdx * 0.1 }}
                  >
                    <div className="card-top">
                      <h3 className="card-service-name">{service.name}</h3>
                      <span className="card-service-price">{service.price}</span>
                    </div>
                    <p className="card-service-desc">{service.desc}</p>
                    <div className="card-meta-row">
                      <span className="card-meta"><Watch size={14} /> {service.time}</span>
                      <button className="book-inline-btn">Reserve</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Deposit Policy */}
      <section className="deposit-policy-section">
        <div className="container policy-box">
          <div className="policy-icon"><Info size={24} /></div>
          <div className="policy-content">
            <h3>Booking & Deposit Information</h3>
            <p>
              To secure your premium grooming session, a 50% non-refundable deposit is required at the time of booking. 
              We offer a 24-hour grace period for rescheduling. Cancellations within 24 hours of the appointment will forfeit the deposit.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="services-cta">
        <button className="btn-filled large-btn">Book Your Appointment Now</button>
      </section>

    </div>
  );
};

export default Services;
