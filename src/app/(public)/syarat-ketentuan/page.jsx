import SyaratSectionWrapper from "@/components/syarat-ketentuan/SyaratSectionWrapper";
import WhatsAppCtaSection from "@/components/shared/WhatsAppCtaSection";
import HeroSection from "@/components/homepage/HeroSection";
import FaqSectionWrapper from "@/components/homepage/FaqSectionWrapper";

export const metadata = {
  title: "Syarat dan Ketentuan Sewa Mobil di Lombok",
  description:
    "Pahami syarat dan ketentuan yang berlaku untuk semua layanan sewa mobil kami di Lombok. Informasi penting mengenai pemesanan, pembayaran, dan penggunaan kendaraan.",
};

export default function SyaratKetentuan() {
  return (
    <>
      <main>
        <HeroSection
          imageOnRight={false}
          imageSrc="/Hero-1.png"
          title={
            <>
              <span className="text-black">Syarat & Ketentuaan </span>
              <span className="text-primary">Sewa Kendaraan</span>
            </>
          }
          subtitle="Selamat datang di layanan rental mobil Reborn Lombok Trans. Dengan melanjutkan proses pemesanan, Anda menyatakan telah membaca, memahami, dan setuju untuk terikat pada semua syarat dan ketentuan yang tercantum di halaman ini. Mohon luangkan waktu untuk mempelajarinya dengan saksama."
        />
        <SyaratSectionWrapper />
        <FaqSectionWrapper />
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
