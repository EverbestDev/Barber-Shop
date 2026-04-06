import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import './FAQ.css';

const faqs = [
  {
    question: "Do I need to book in advance or can I walk in?",
    answer: "While we always do our best to accommodate everyone, we highly recommend booking your session in advance. This ensures you project the best version of yourself without the wait, and it guarantees time with your preferred master barber. Walk-ins are handled on a first-come, first-served basis and are subject to availability."
  },
  {
    question: "What happens if I need to cancel my appointment?",
    answer: "We understand that plans can change. We maintain a 24-hour cancellation and rescheduling policy. If you need to make changes, please let us know at least 24 hours before your scheduled time. Cancellations made within the 24-hour window may result in a forfeit of the deposit to cover the reserved time slot."
  },
  {
    question: "Is there parking available near the shop?",
    answer: "Yes, there is ample public parking available along Stanstead Road and the surrounding side streets. We suggest arriving approximately 5 to 10 minutes early to secure a parking spot and enjoy a complimentary refreshment in our lounge before your session begins."
  },
  {
    question: "Do you offer haircuts for children?",
    answer: "Absolutely! We take pride in being a family-friendly establishment. Our barbers are experts at working with younger guests (under 14), providing a calm, safe, and professional environment. We ensure they leave the chair looking sharp and feeling confident."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept a wide range of payment options for your convenience, including all major credit and debit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and cash. To secure your online reservation, a small 50% deposit is processed through our secure payment gateway at the time of booking."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq-section section-padding">
      <div className="container">
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
