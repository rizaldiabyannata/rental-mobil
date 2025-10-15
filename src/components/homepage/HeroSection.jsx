import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookingForm from "./BookingForm";

const HeroSection = () => {
  return (
    <section className="relative w-full bg-cover bg-center bg-[url('/Hero.png')]">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 container mx-auto grid min-h-[600px] grid-cols-1 items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-24">
        {/* Left Column: Text Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Sewa Mobil Terbaik di Lombok
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Jelajahi keindahan Lombok dengan nyaman bersama Reborn Lombok Trans.
            Armada terawat, supir profesional, dan harga terbaik.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Link href="#armada">
              <Button size="lg" className="w-full sm:w-auto">
                Lihat Armada
              </Button>
            </Link>
            <Link href="https://wa.me/6287741861681">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="flex justify-center lg:justify-end">
          <BookingForm />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
