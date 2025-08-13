import FAQ from "./_components/FAQ";
import FeatureGrid from "./_components/FeatureGrid";
import FinalCTA from "./_components/FinalCTA";
import Hero from "./_components/Hero";
import HowItWorks from "./_components/HowItWorks";
import Metrics from "./_components/Metrics";
import PricingTeaser from "./_components/PricingTeaser";
import SocialProof from "./_components/SocialProof";
import Testimonials from "./_components/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <FeatureGrid />
      <HowItWorks />
      <Metrics />
      <Testimonials />
      <PricingTeaser />
      <FAQ />
      <FinalCTA />
    </>
  );
}
