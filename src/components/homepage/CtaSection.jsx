import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const CtaSection = () => {
  return (
    <section className="bg-white pt-[25px] md:pt-[50px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <Image
              src="/2Women.png"
              alt="Hubungi Kami"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>

          <div className="w-full lg:w-1/2 flex flex-col items-center text-center gap-6 order-1 lg:order-2">
            <h2 className="font-sans text-2xl md:text-4xl xl:text-5xl font-bold text-gray-800">
              Ada Pertanyaan? Silakan <br />
              <span className="text-emerald-700">Hubungi Kami</span>
            </h2>
            <Link href="https://wa.me/6287741861681" target="_blank">
              <Button size="lg">Hubungi Kami</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
