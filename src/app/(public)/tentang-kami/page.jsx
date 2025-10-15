import TentangSection from "@/components/tentang-kami/TentangSection";
import VisiMisiSection from "@/components/tentang-kami/VisiMisiSection";
import GallerySection from "@/components/tentang-kami/GallerySection";
import HeroSection from "@/components/homepage/HeroSection";
import WhatsAppCtaSection from "@/components/shared/WhatsAppCtaSection";

export default function TentangKami() {
  return (
    <>
      <main>
        <HeroSection imageOnRight={false} imageSrc="/HeroSewa.png" />
        <TentangSection />
        <VisiMisiSection />
        <GallerySection />
        <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8 pb-12">
          <WhatsAppCtaSection
            waUrlBase="https://wa.me/6287741861681"
            imageSrc="/imageforctasection.png"
            imageAlt={`Gallery`}
            className="shadow-md rounded-2xl"
          />
        </div>
      </main>
    </>
  );
}
