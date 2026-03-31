import React from 'react';
import { Check } from 'lucide-react';
import './PricingSnippet.css';

const mainServices = [
  { group: 'Haircuts', items: [
    { name: "Signature Haircut", price: "£35" },
    { name: "Skin Fade", price: "£38" },
    { name: "Kids Haircut", price: "£20" }
  ]},
  { group: 'Beard & Face', items: [
    { name: "Beard Sculpture", price: "£25" },
    { name: "Hot Towel Shave", price: "£30" },
    { name: "The Beard & Mask", price: "£35" }
  ]}
];

const homeAndGroup = [
  { name: "Executive Home Visit", price: "£85" },
  { name: "Father & Son Pack", price: "£50" },
  { name: "Grooming Party (3+)", price: "£150+" }
];

const PricingSnippet: React.FC = () => {
  return (
    <section className="pricing-snippet-section section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Premium Value</span>
          <h2 className="section-title">Service Pricing</h2>
        </div>

        <div className="pricing-grid">
          <div className="pricing-column">
            {mainServices.map((cat, i) => (
              <div key={i} className="pricing-cat-box">
                <h3 className="cat-title">{cat.group}</h3>
                <div className="price-list">
                  {cat.items.map((item, j) => (
                    <div key={j} className="price-item">
                      <span className="item-name">{item.name}</span>
                      <div className="item-dots"></div>
                      <span className="item-price">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pricing-column highlight-column">
            <h3 className="cat-title">Specialty & Doorstep</h3>
            <div className="price-list">
              {homeAndGroup.map((item, i) => (
                <div key={i} className="price-item featured">
                  <div className="item-header">
                    <Check size={16} className="gold-icon" />
                    <span className="item-name">{item.name}</span>
                  </div>
                  <span className="item-price">{item.price}</span>
                </div>
              ))}
            </div>
            
            <div className="pricing-cta-box">
              <p>All services include luxury styling and premium products.</p>
              <button className="btn-filled wide-btn">See Full Pricing Menu</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSnippet;
