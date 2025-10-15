import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const HeroSyaratSection = () => {
  return (
    <>
      {/*TAMPILAN MOBILE & TABLET (< 1024px)*/}
      <section className="lg:hidden relative h-[352px] md:h-[552px] w-full flex flex-col items-center justify-center text-center text-white p-4">
        <Image
          src="/sdank.png"
          alt="Layanan Rental Mobil Lombok"
          fill
          className="object-cover brightness-50"
          style={{ filter: "blur(6.5px)" }}
          priority
        />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <h1 className="font-sans text-[24px] md:text-3xl font-bold text-black">
            Syarat & Ketentuaan <br />
            <span className="text-emerald-700">Sewa Kendaraan</span>
          </h1>
          <p className="font-sans font-normal text-center text-[12px] md:text-lg max-w-md text-black">
            Selamat datang di layanan rental mobil Reborn Lombok Trans. Dengan
            melanjutkan proses pemesanan, Anda menyatakan telah membaca,
            memahami, dan setuju untuk terikat pada semua syarat dan ketentuan
            yang tercantum di halaman ini. Mohon luangkan waktu untuk
            mempelajarinya dengan saksama.
          </p>
          <Link href="https://wa.me/6287741861681">
            <Button size="lg" className="mt-4 rounded-[12px]">
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-12">
            <div className="w-1/2 flex flex-col items-start gap-6">
              <h1 className="font-sans lg:text-4xl xl:text-5xl font-bold text-black">
                Syarat & Ketentuaan <br />
                <span className="text-emerald-700">Sewa Kendaraan</span>
              </h1>
              <p className="font-sans lg:text-xl xl:text-2xl text-gray-800 max-w-lg text-justify">
                Selamat datang di layanan rental mobil Reborn Lombok Trans.
                Dengan melanjutkan proses pemesanan, Anda menyatakan telah
                membaca, memahami, dan setuju untuk terikat pada semua syarat
                dan ketentuan yang tercantum di halaman ini. Mohon luangkan
                waktu untuk mempelajarinya dengan saksama.
              </p>
            </div>
            <div className="w-1/2 flex justify-end">
              <Image
                src="/sdank.png"
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

export default HeroSyaratSection;
