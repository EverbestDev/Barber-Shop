import React from 'react';
import AboutHeader from '../../components/layout/About/About'; // We can reuse the section as a layout block
import WhyChooseUs from '../../components/sections/home/WhyChooseUs';
import CTA from '../../components/sections/home/CTA';

const AboutPage: React.FC = () => {
  return (
    <main className="about-page-wrapper">
      {/* Reusing existing About section as the main introduction */}
      <AboutHeader />

      {/* Added WhyChooseUs to fill the About page with more context */}
      <WhyChooseUs />

      <CTA />
    </main>
  );
};

export default AboutPage;
