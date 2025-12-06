import React from 'react';
import LandingHeader from './LandingHeader';
import LandingHero from './LandingHero';
import LandingFeatures from './LandingFeatures';
import LandingSocialProof from './LandingSocialProof';
import LandingTestimonials from './LandingTestimonials';
import LandingCTA from './LandingCTA';
import LandingFooter from './LandingFooter';
import FadeInSection from './FadeInSection';

export const MarketingLanding = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
      <LandingHeader />
      
      <main>
        <FadeInSection>
          <LandingHero />
        </FadeInSection>

        <FadeInSection>
          <LandingSocialProof />
        </FadeInSection>

        <FadeInSection>
          <LandingFeatures />
        </FadeInSection>

        <FadeInSection>
          <LandingTestimonials />
        </FadeInSection>

        <FadeInSection>
          <LandingCTA />
        </FadeInSection>
      </main>

      <LandingFooter />
    </div>
  );
};
