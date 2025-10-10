import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section
      className="relative h-[600px] w-full flex items-center justify-center text-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/Hero.png')" }}
    >
      {/* Konten teks di tengah */}
      <div className="relative z-10 max-w-[800px] flex flex-col items-center gap-6 px-4">
        <h1 className="font-sans text-[24px] md:text-[64px] font-bold text-emerald-700">
          Reborn Lombok Trans
        </h1>
        <p className="font-geist text-[12px] md:text-[32px] font-semibold text-center text-emerald-700 mt-[-25px]">
          Kepuasan Anda adalah yang Utama
          <br /> Ingat Lombok Ingat REBORN LOMBOK TRANS!!
        </p>
        <Link href="https://wa.me/6287741861681">
          <Button size="lg" className="mt-4">
            Hubungi Kami
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
