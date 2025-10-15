import HeroSection from "@/components/homepage/HeroSection";
import PaketTourSection from "@/components/sewa-mobil-layanan/PaketTourSection";
import ServicesSection from "@/components/homepage/ServicesSection";
import WhatsAppCtaSection from "@/components/shared/WhatsAppCtaSection";
export default function SewaMobilLayanan() {
  return (
    <main>
      <HeroSection
        imageOnRight={false}
        imageSrc="/Hero-2.png"
        title={
          <>
            <span className="text-black">Layanan </span>
            <span className="text-emerald-700">Rental Mobil</span>
          </>
        }
        subtitle="Kepuasan Anda adalah yang Utama. Ingat Lombok! Ingat Reborn Lombok Trans!!"
      />
      <PaketTourSection />
      <ServicesSection />
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8 pb-12">
        <WhatsAppCtaSection
          waUrlBase="https://wa.me/6287741861681"
          imageSrc="/imageforctasection.png"
          imageAlt={`Gallery`}
          className="shadow-md rounded-2xl"
        />
      </div>
    </main>
  );
}
