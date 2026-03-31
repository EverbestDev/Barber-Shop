import React from 'react';
import Hero from '../../components/layout/Hero/Hero';
import ServicesPreview from '../../components/sections/home/ServicesPreview';
import WhyChooseUs from '../../components/sections/home/WhyChooseUs';
import FAQ from '../../components/sections/home/FAQ';
import CTA from '../../components/sections/home/CTA';

const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <ServicesPreview />
      <WhyChooseUs />
      <FAQ />
      <CTA />
    </main>
  );
};

export default Home;
