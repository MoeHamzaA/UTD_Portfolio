import Container from '@/components/common/Container';
import About from '@/components/landing/About';
import CTA from '@/components/landing/CTA';
import Experience from '@/components/landing/Experience';
import Github from '@/components/landing/Github';
import Hero from '@/components/landing/Hero';
import Work from '@/components/landing/Projects';
import Stats from '@/components/landing/Stats';
import React from 'react';

export default function page() {
  return (
    <Container className="min-h-screen py-16">
      <Hero />
      <Stats />
      <Experience />
      <Work />
      <About />
      <Github />
      <CTA />
    </Container>
  );
}
