export const dynamic = 'force-dynamic';

import HeroSection from "@/components/homepage/HeroSection";
import WhyUsSection from "@/components/homepage/WhyUsSection";
import ServicesSection from "@/components/homepage/ServicesSection";
import FleetSection from "@/components/homepage/FleetSection";
import GallerySection from "@/components/homepage/GallerySection";
import FaqSectionWrapper from "@/components/homepage/FaqSectionWrapper";
import WhatsAppCtaSection from "@/components/shared/WhatsAppCtaSection";
import PaketTourSection from "@/components/sewa-mobil-layanan/PaketTourSection";
import TourTeaserSection from "@/components/homepage/TourTeaserSection";
import PartnersSection from "@/components/homepage/PartnersSection";
import VideoSection from "@/components/homepage/VideoSection";

export const metadata = {
  title: "Reborn Lombok Trans - Rental Mobil Terpercaya di Lombok",
  description:
    "Cari sewa mobil di Lombok? Kami menyediakan armada terbaru untuk rental mobil lepas kunci atau dengan sopir. Harga terjangkau, pelayanan terbaik. Hubungi kami!",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <VideoSection />
      <WhyUsSection />
      <ServicesSection />
      <FleetSection />
      <TourTeaserSection />
      <PaketTourSection />
      <GallerySection />
      <PartnersSection />
      <FaqSectionWrapper />
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8 pb-12">
        <WhatsAppCtaSection
          waUrlBase="https://wa.me/6285353818685"
          imageSrc="/imageforctasection.png"
          imageAlt={`Gallery`}
          className="shadow-md rounded-2xl"
        />
      </div>
    </>
  );
}
