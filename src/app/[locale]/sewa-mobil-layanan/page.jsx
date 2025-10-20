"use client";

import HeroSection from "@/components/homepage/HeroSection";
import PaketTourSection from "@/components/sewa-mobil-layanan/PaketTourSection";
import ServicesSection from "@/components/homepage/ServicesSection";
import WhatsAppCtaSection from "@/components/shared/WhatsAppCtaSection";
import { useTranslations } from "next-intl";

// Note: generateMetadata is a server-side function.
export async function generateMetadata({ params: { locale } }) {
  const t = (await import(`../../../messages/${locale}.json`)).default;
  const meta = t.servicesPage.meta;
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default function SewaMobilLayanan() {
  const t = useTranslations("servicesPage.hero");

  return (
    <main>
      <HeroSection
        imageOnRight={false}
        imageSrc="/Hero-2.png"
        title={t.rich("title", {
          span: (chunks) => <span className="text-primary">{chunks}</span>,
        })}
        subtitle={t("subtitle")}
      />
      <PaketTourSection />
      <ServicesSection />
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8 pb-12">
        <WhatsAppCtaSection
          waUrlBase="https://wa.me/6285353818685"
          imageSrc="/imageforctasection.png"
          imageAlt={`Gallery`}
          className="shadow-md rounded-2xl"
        />
      </div>
    </main>
  );
}
