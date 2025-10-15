import CarDetailSection from "@/components/detail-armada/CarDetailSection";
import KeyFeatureSection from "@/components/detail-armada/KeyFeatureSection";
import SpecsSection from "@/components/detail-armada/SpecsSection";
import TariffDetailSection from "@/components/detail-armada/TariffDetailSection";
import WhatsAppCtaSection from "@/components/shared/WhatsAppCtaSection";

export default function DetailArmada() {
  const carData = {
    name: "Toyota Kijang Innova Reborn",
    description:
      "Pilihan sempurna untuk kenyamanan perjalanan keluarga dan bisnis Anda.",
    price: "650.000",
    priceUnit: "/ 12 Jam (Termasuk Driver)",
    longDescription:
      "Nikmati pengalaman berkendara yang premium dengan Toyota Innova Reborn. Dikenal dengan ketangguhan, ruang kabin yang sangat lega, dan suspensi yang nyaman, mobil ini adalah partner terbaik untuk menjelajahi keindahan Lombok, mulai dari pantai Senggigi hingga perbukitan Mandalika.",
    images: [
      { id: 1, src: "/car-1.jpg", alt: "Toyota Innova Reborn - Front View" },
      { id: 2, src: "/car-2.jpg", alt: "Toyota Innova Reborn - Side View" },
      { id: 3, src: "/car-3.jpg", alt: "Toyota Innova Reborn - Interior" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CarDetailSection car={carData} />
      <KeyFeatureSection />
      <SpecsSection
        title="Spesifikasi Lengkap"
        align="left"
        items={[
          { label: "Transmisi", value: "Automatic / Matic" },
          { label: "Kapasitas Penumpang", value: "Hingga 7 orang" },
          { label: "Bahan Bakar", value: "Bensin" },
          {
            label: "Kapasitas Bagasi",
            value: "Besar (2 koper besar + 2 koper kecil)",
          },
        ]}
        className="bg-white"
      />
      <TariffDetailSection />
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8 pb-12">
        <WhatsAppCtaSection
          carName={carData.name}
          waUrlBase="https://wa.me/6287741861681"
          imageSrc="/imageforctasection.png"
          imageAlt={`${carData.name} - Gallery`}
        />
      </div>
    </div>
  );
}
