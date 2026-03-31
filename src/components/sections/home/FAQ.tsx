import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import './FAQ.css';

const faqs = [
  {
    question: "Do I need to book in advance or can I walk in?",
    answer: "We highly recommend booking in advance to ensure you get your preferred time with your favorite barber. However, we do accept walk-ins if there is availability."
  },
  {
    question: "What happens if I need to cancel my appointment?",
    answer: "We have a 24-hour cancellation policy. We appreciate at least 24 hours' notice if you need to reschedule or cancel your grooming session."
  },
  {
    question: "Is there parking available near the shop?",
    answer: "Yes, there is public parking available on Stanstead Road and nearby side streets. We recommend arriving 5-10 minutes early to find a spot."
  },
  {
    question: "Do you offer haircuts for children?",
    answer: "Absolutely! We specialize in kids' styles and ensure a comfortable, safe experience for little ones while keeping them sharp."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, Apple Pay, Google Pay, and cash. Deposit payments are required for secure online booking."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq-section section-padding">
      <div className="faq-container">
        <div className="section-header">
          <span className="section-tag">Got Questions?</span>
          <h2 className="section-title">Common Inquiries</h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? 'active' : ''}`}
            >
              <button 
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="faq-q-text">
                  <HelpCircle className="faq-q-icon" size={20} />
                  <span>{faq.question}</span>
                </div>
                <ChevronDown className="faq-chevron" size={20} />
              </button>
              <div className="faq-answer">
                <div className="faq-answer-inner">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
