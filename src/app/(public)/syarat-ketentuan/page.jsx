import PageHero from "@/components/shared/PageHero";
import FaqSection from "@/components/homepage/FaqSection";
import SyaratSection from "@/components/syarat-ketentuan/syaratSection";
import CtaSection from "@/components/homepage/CtaSection";

export default function SyaratKetentuan() {
  return (
    <>
      <PageHero
        title="Syarat & Ketentuan"
        breadcrumbs={[{ label: "Syarat & Ketentuan" }]}
      />
      <main>
        <SyaratSection />
        <FaqSection />
        <CtaSection />
      </main>
    </>
  );
}
