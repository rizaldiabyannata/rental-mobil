import PageHero from "@/components/shared/PageHero";
import TentangSection from "@/components/tentang-kami/TentangSection";
import VisiMisiSection from "@/components/tentang-kami/VisiMisiSection";
import GallerySection from "@/components/tentang-kami/GallerySection";
import CtaSection from "@/components/homepage/CtaSection";

export default function TentangKami() {
  return (
    <>
      <PageHero title="Tentang Kami" breadcrumbs={[{ label: "Tentang Kami" }]} />
      <main>
        <TentangSection />
        <VisiMisiSection />
        <GallerySection />
        <CtaSection />
      </main>
    </>
  );
}
