import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const HeroMobil = () => {
  return (
    <>
      {/*TAMPILAN MOBILE & TABLET (< 1024px)*/}
      <section className="lg:hidden relative h-[262px] md:h-[462px] w-full flex flex-col items-center justify-center text-center text-white p-4">
        <Image
          src="/fotoLayanan.png"
          alt="Layanan Rental Mobil Lombok"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <h1 className="font-sans text-[24px] md:text-3xl font-bold text-[#059669]">
            Layanan Rental Mobil
          </h1>
          <p className="font-sans text-[12px] md:text-lg max-w-md text-black">
            Kepuasan Anda adalah yang Utama <br />
            Ingat Lombok! Ingat Reborn Lombok Trans!!
          </p>
          <Link href="https://wa.me/6287741861681">
            <Button size="lg" className="mt-4 rounded-full">
              Hubungi Kami
            </Button>
          </Link>
        </div>
      </section>

      {/*TAMPILAN DESKTOP (>= 1024px)*/}
      <section
        className="hidden lg:flex lg:min-h-[538px] xl:min-h-[738px] items-center w-full bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/layanan-BG.png')" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-12">
            <div className="w-1/2 flex flex-col items-start gap-6">
              <h1 className="font-sans lg:text-4xl xl:text-5xl font-bold text-emerald-600">
                Layanan Rental Mobil
              </h1>
              <p className="font-sans lg:text-xl xl:text-2xl text-gray-800 max-w-lg">
                Kepuasan Anda adalah yang Utama <br />
                Ingat Lombok! Ingat Reborn Lombok Trans!!
              </p>
              <Link href="https://wa.me/6287741861681">
                <Button
                  size="lg"
                  className="mt-4 rounded-full text-lg px-8 py-6"
                >
                  Hubungi Kami
                </Button>
              </Link>
            </div>
            <div className="w-[1/2] flex justify-end">
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
    </>
  );
};

export default HeroMobil;
