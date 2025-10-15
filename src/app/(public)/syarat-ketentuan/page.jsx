import FaqSection from "@/components/homepage/FaqSection";
import SyaratSection from "@/components/syarat-ketentuan/SyaratSection";
import WhatsAppCtaSection from "@/components/shared/WhatsAppCtaSection";
import HeroSection from "@/components/homepage/HeroSection";

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
              <span className="text-emerald-700">Sewa Kendaraan</span>
            </>
          }
          subtitle="Selamat datang di layanan rental mobil Reborn Lombok Trans. Dengan melanjutkan proses pemesanan, Anda menyatakan telah membaca, memahami, dan setuju untuk terikat pada semua syarat dan ketentuan yang tercantum di halaman ini. Mohon luangkan waktu untuk mempelajarinya dengan saksama."
        />
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
