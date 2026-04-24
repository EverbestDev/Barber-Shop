import React from 'react';
import Hero from '../../components/layout/Hero/Hero';
import ServicesPreview from '../../components/sections/home/ServicesPreview';
import WhyChooseUs from '../../components/sections/home/WhyChooseUs';
import VideoShowcase from '../../components/sections/home/VideoShowcase';
import ProfessionalTeam from '../../components/sections/home/ProfessionalTeam';
import PricingSnippet from '../../components/sections/home/PricingSnippet';
import Testimonials from '../../components/sections/home/Testimonials';
import FAQ from '../../components/sections/home/FAQ';
import Newsletter from '../../components/sections/home/Newsletter';
import CTA from '../../components/sections/home/CTA';

const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <ServicesPreview />
      <WhyChooseUs />
      <VideoShowcase />
      <ProfessionalTeam />
      <PricingSnippet />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <CTA />
    </main>
  );
};

export default Home;
