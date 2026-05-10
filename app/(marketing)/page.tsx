import { Hero } from "@/components/landing/hero";
import { TrustedBy } from "@/components/landing/trusted-by";
import { Features } from "@/components/landing/features";
import { AIShowcase } from "@/components/landing/ai-showcase";
import { UniversityCategories } from "@/components/landing/university-categories";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Features />
      <AIShowcase />
      <UniversityCategories />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
