import React from 'react';
import Hero from '../../components/layout/Hero/Hero';
import ServicesPreview from '../../components/sections/home/ServicesPreview';
import WhyChooseUs from '../../components/sections/home/WhyChooseUs';
import ProfessionalTeam from '../../components/sections/home/ProfessionalTeam';
import PricingSnippet from '../../components/sections/home/PricingSnippet';
import Testimonials from '../../components/sections/home/Testimonials';
import FAQ from '../../components/sections/home/FAQ';
import CTA from '../../components/sections/home/CTA';

const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <ServicesPreview />
      <WhyChooseUs />
      <ProfessionalTeam />
      <PricingSnippet />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
};

export default Home;
