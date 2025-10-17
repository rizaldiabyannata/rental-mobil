import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const HeroMobil = () => {
  return (
    <section className="relative w-full bg-cover bg-center py-24 md:py-32 lg:py-0 lg:min-h-[538px] xl:min-h-[738px] lg:bg-[url('/layanan-BG.png')]">
      {/* Mobile Background Image */}
      <div className="lg:hidden absolute inset-0">
        <Image
          src="/fotoLayanan.png"
          alt="Layanan Rental Mobil Lombok"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="container relative z-10 mx-auto h-full px-4">
        <div className="flex h-full flex-col items-center justify-center gap-12 text-center lg:flex-row lg:justify-between lg:text-left">
          {/* Text Content */}
          <div className="flex max-w-xl flex-col items-center gap-6 lg:items-start">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-primary xl:text-5xl">
              Layanan Rental Mobil
            </h1>
            <p className="text-lg text-gray-100 lg:text-xl lg:text-gray-800 xl:text-2xl">
              Kepuasan Anda adalah yang Utama <br />
              Ingat Lombok! Ingat Reborn Lombok Trans!!
            </p>
            <Link href="https://wa.me/6287741861681" className="mt-4">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg">
                Hubungi Kami
              </Button>
            </Link>
          </div>

          {/* Image Content (Desktop Only) */}
          <div className="hidden lg:block">
            <Image
              src="/fotoLayanan.png"
              alt="Armada Reborn Lombok Trans"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroMobil;
