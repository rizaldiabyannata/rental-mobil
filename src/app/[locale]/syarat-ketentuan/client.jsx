"use client";

import SyaratSection from "@/components/syarat-ketentuan/TermSection";
import WhatsAppCtaSection from "@/components/shared/WhatsAppCtaSection";
import HeroSection from "@/components/homepage/HeroSection";
import FaqSection from "@/components/homepage/FaqSection";
import { useTranslations } from "next-intl";

export default function SyaratKetentuanClient({ terms, faqs }) {
  const t = useTranslations("terms.hero");
  return (
    <>
      <main>
        <HeroSection
          imageOnRight={false}
          imageSrc="/Hero-1.png"
          title={t.rich("title", {
            span: (chunks) => <span className="text-primary">{chunks}</span>,
          })}
          subtitle={t("subtitle")}
        />
        <SyaratSection terms={terms} />
        <FaqSection faqs={faqs} />
        <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8 pb-12">
          <WhatsAppCtaSection
            waUrlBase="https://wa.me/6285353818685"
            imageSrc="/imageforctasection.png"
            imageAlt={`Gallery`}
            className="shadow-md rounded-2xl"
          />
        </div>
      </main>
    </>
  );
}
