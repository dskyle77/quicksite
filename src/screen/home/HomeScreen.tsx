// src/features/home/HomeScreen.tsx
"use client"
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import MobileReadySection from "./MobileReadySection";
import TestimonialsSection from "./TestimonialsSection";
import PricingSection from "./PricingSection";
import CtaSection from "./CtaSection";

export default function HomeScreen() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <MobileReadySection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
    </main>
  );
}