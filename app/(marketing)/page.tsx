import { PremiumHero } from "@/components/landing/premium-hero";
import { TrustedBy } from "@/components/landing/trusted-by";
import { PremiumFeatures } from "@/components/landing/premium-features";
import { PremiumAIShowcase } from "@/components/landing/premium-ai-showcase";
import { PremiumUniversityCategories } from "@/components/landing/premium-university-categories";
import { PremiumTestimonials } from "@/components/landing/premium-testimonials";
import { PremiumFAQ } from "@/components/landing/premium-faq";
import { PremiumCTA } from "@/components/landing/premium-cta";

export default function HomePage() {
  return (
    <>
      <PremiumHero />
      <TrustedBy />
      <PremiumFeatures />
      <PremiumAIShowcase />
      <PremiumUniversityCategories />
      <PremiumTestimonials />
      <PremiumFAQ />
      <PremiumCTA />
    </>
  );
}
