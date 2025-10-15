// Public landing page
import HeroSection from "@/components/homepage/HeroSection";
import WhyUsSection from "@/components/homepage/WhyUsSection";
import ServicesSection from "@/components/homepage/ServicesSection";
import FleetSection from "@/components/homepage/FleetSection";
import FaqSection from "@/components/homepage/FaqSection";
import CtaSection from "@/components/homepage/CtaSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhyUsSection />
      <ServicesSection />
      <FleetSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
