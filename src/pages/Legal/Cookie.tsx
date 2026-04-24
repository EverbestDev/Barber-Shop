import React from 'react';
import { Shield, Activity, Megaphone } from 'lucide-react';
import './Legal.css';

const CookiePolicy: React.FC = () => {
  return (
    <div className="legal-page-wrapper">
      <section className="legal-hero cookie-bg">
        <div className="legal-container">
          <h1 className="legal-title">COOKIE <br /> <span className="text-gold">POLICY</span></h1>
          <p className="legal-desc">Last updated: April 2026. This policy explains how Bazetwo Barbers uses cookies and similar technologies.</p>
        </div>
      </section>

      <section className="legal-content-section section-padding">
        <div className="legal-container">
          <div className="legal-content-intro">
            <h3>Our approach to transparency</h3>
            <p>At Bazetwo Barbers, we believe in being clear and open about how we collect and use data related to you. In the spirit of transparency, this policy provides detailed information about how and when we use cookies.</p>
          </div>

          <div className="cookie-types-grid">
            <div className="cookie-type-card">
              <div className="cookie-type-icon"><Shield size={24} /></div>
              <h4>Essential Cookies</h4>
              <p>Strictly necessary for the website to function. They ensure security and core site functionality. Cannot be disabled.</p>
            </div>
            <div className="cookie-type-card">
              <div className="cookie-type-icon"><Activity size={24} /></div>
              <h4>Performance & Analytics</h4>
              <p>Help us understand how visitors interact with our site, allowing us to optimize our booking experience and layout.</p>
            </div>
            <div className="cookie-type-card">
              <div className="cookie-type-icon"><Megaphone size={24} /></div>
              <h4>Marketing & Insights</h4>
              <p>Used to track the effectiveness of our campaigns and provide you with relevant content and offers.</p>
            </div>
          </div>

          <div className="legal-text-block">
            <h3>1. What are cookies?</h3>
            <p>
              Cookies are small pieces of text used to store information on web browsers. Cookies are used to store and receive identifiers and other information on computers, phones, and other devices. Other technologies, including data we store on your web browser or device, identifiers associated with your device, and other software, are used for similar purposes.
            </p>

            <h3>2. Controlling your preferences</h3>
            <p>
              By using our website, you agree to our use of cookies according to this policy. You can manage your preferences through the floating settings banner at the bottom of the screen. If you have already accepted or rejected and wish to change, clearing your browser cache for this site will reset the prompt.
            </p>

            <h3>3. Updates to this policy</h3>
            <p>
              We may update this policy from time to time to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this page regularly to stay informed about our use of cookies and related technologies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;
