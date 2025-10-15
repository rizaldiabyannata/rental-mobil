import FaqSection from "@/components/homepage/FaqSection";
import SyaratSection from "@/components/syarat-ketentuan/syaratSection";
import WhatsAppCtaSection from "@/components/shared/WhatsAppCtaSection";
import HeroSection from "@/components/homepage/HeroSection";

export default function SyaratKetentuan() {
  return (
    <>
      <main>
        <HeroSection imageOnRight={false} imageSrc="/HeroSewa.png" />
        <SyaratSection />
        <FaqSection />
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
