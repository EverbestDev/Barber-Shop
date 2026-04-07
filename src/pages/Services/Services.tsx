import React from 'react';
import { motion } from 'framer-motion';
import { Watch, Info } from 'lucide-react';
import CTA from '../../components/sections/home/CTA';
import { useOutletContext } from 'react-router-dom';
import './Services.css';

const categories = [
  {
    id: 'haircuts',
    title: 'Precision Haircuts',
    services: [
      { name: "Signature Haircut", desc: "Our most popular service, tailored exactly to your head shape and hair type.", price: "£35", time: "45 mins" },
      { name: "Skin Fade", desc: "Expert fading from skin to your desired length on top.", price: "£38", time: "60 mins" },
      { name: "Buzz Cut", desc: "Uniform short cut all over with precise lineup and neck finish.", price: "£25", time: "30 mins" },
      { name: "Shape Up (Lineup)", desc: "Quick maintenance: Razored hairline, temples, and neck only.", price: "£15", time: "20 mins" },
      { name: "Kids Haircut", desc: "Sharp styles for our younger guests under 14.", price: "£22", time: "30 mins" },
      { name: "Seniors (65+)", desc: "Classic cuts for our established clients.", price: "£20", time: "30 mins" }
    ]
  },
  {
    id: 'beard',
    title: 'Beard & Face',
    services: [
      { name: "Beard Sculpture", desc: "A detailed trim, shape and razor line to define your facial hair.", price: "£25", time: "30 mins" },
      { name: "Beard Line-up (Razored)", desc: "Quick razor lining for the cheeks and neck.", price: "£15", time: "15 mins" },
      { name: "Hot Towel Shave", desc: "Traditional straight-razor shave with steam and soothing oils.", price: "£35", time: "45 mins" },
      { name: "The Beard & Mask", desc: "Sculpture combined with a detoxifying charcoal face mask.", price: "£40", time: "45 mins" },
      { name: "Nose & Ear Waxing", desc: "Professional and painless removal of unwanted hair.", price: "£10", time: "10 mins" }
    ]
  },
  {
    id: 'packages',
    title: 'Grooming Packages',
    services: [
      { name: "The Executive", desc: "Signature Haircut + Beard Sculpture. The full look.", price: "£55", time: "75 mins" },
      { name: "The Royal Treatment", desc: "Haircut + Beard Sculpture + Face Mask + Nose/Ear Wax.", price: "£80", time: "105 mins" },
      { name: "The Wedding Ritual", desc: "Signature Haircut + Royal Shave + Detailed Styling + Drink.", price: "£100", time: "120 mins" }
    ]
  },
  {
    id: 'home-services',
    title: 'Premium Home Services (Doorstep)',
    services: [
      { name: "Executive Home Visit", desc: "Our master barber comes to your location. Includes haircut & styling.", price: "£85", time: "60 mins" },
      { name: "Full Grooming Home Visit", desc: "Haircut + Beard Sculpture at your location.", price: "£110", time: "90 mins" },
      { name: "V.I.P Doorstep Session", desc: "Includes all extras: Face Mask, Waxing & Signature Styling.", price: "£140", time: "120 mins" }
    ]
  },
  {
    id: 'womens-cuts',
    title: "Women's Specialized Cuts",
    services: [
      { name: "Women's Taper Fade", desc: "Edgy and precise taper fades for women. A bold look executed with artistic precision and flair.", price: "£40", time: "60 mins" },
      { name: "Women's Signature", desc: "Customized women's styling and cutting. From classic bobs to modern pixie cuts, tailored to you.", price: "£45", time: "60 mins" },
      { name: "Undercut Design", desc: "Precision shaved patterns or artistic lines added to your undercut for a unique look.", price: "£25", time: "30 mins" },
      { name: "Short Cut & Style", desc: "Classic precision short cuts (jawline and above), expertly styled and finished.", price: "£35", time: "45 mins" }
    ]
  },
  {
    id: 'group',
    title: 'Group & Family Packages',
    services: [
      { name: "The Father & Son", desc: "Adult Haircut + Child (under 14). Perfect bonding time.", price: "£55", time: "90 mins" },
      { name: "The Duo Pack", desc: "Two signature haircuts for you and a friend.", price: "£65", time: "90 mins" },
      { name: "The Grooming Party (3-5 users)", desc: "Perfect for weddings or events. Exclusive booking for your group.", price: "From £150", time: "3 hours+" },
      { name: "The Triple Threat (3 Friends)", desc: "Three signature cuts for you and two buddies.", price: "£90", time: "120 mins" }
    ]
  }
];

const Services: React.FC = () => {
  const { onAuthOpen } = useOutletContext<{ onAuthOpen: () => void }>();

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
            OUR <br /> <span className="text-gold">SERVICES</span>
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
          {categories.map((category) => (
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
      <CTA onAuthOpen={onAuthOpen} />

    </div>
  );
};

export default Services;
