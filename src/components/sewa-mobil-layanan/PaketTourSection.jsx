import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const tourPackages = [
  {
    title: "Sewa Mobil Harian",
    description:
      "Sewa mobil per 12 jam dengan berbagai pilihan paket, termasuk dengan supir dan BBM.",
    image: "/sewa.png",
    href: "/harga/sewa-harian",
    imagePosition: "object-top",
  },
  {
    title: "Antar Jemput Bandara",
    description:
      "Layanan antar jemput dari/ke Bandara Internasional Lombok ke berbagai destinasi utama.",
    image: "/antar-jemput.png",
    href: "/harga/antar-jemput",
    imagePosition: "object-bottom",
  },
  {
    title: "Paket Wisata Tour",
    description:
      "Jelajahi destinasi terbaik di Lombok dengan paket tour lengkap kami, dari pantai hingga pegunungan.",
    image: "/tour.png",
    href: "/harga/paket-tour",
    imagePosition: "object-center",
  },
];

const PaketTourSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-sans text-2xl md:text-4xl font-bold text-emerald-700">
            Paket Tour
          </h2>
          <div className="w-[147px] md:w-[268px] h-[1px] bg-[#FF9700] mt-2 mx-auto" />
          <p className="text-gray-600 mt-6 text-base md:text-lg">
            Kami menyediakan beberapa paket tour yang memanjakan anda
          </p>
        </div>

        <div className="flex md:justify-center">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-stretch md:overflow-x-auto md:pb-4 snap-x snap-mandatory scrollbar-hide">
            {tourPackages.map((pkg, index) => (
              <Card
                key={index}
                className="w-full max-w-[319px] md:w-[319px] flex-shrink-0 bg-[#F8F8F8] rounded-[15px] shadow-md p-5 flex flex-col items-center gap-2.5 snap-center"
              >
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  width={279}
                  height={186}
                  className={`w-full rounded-xl aspect-video object-cover ${pkg.imagePosition}`}
                />
                <CardContent className="flex flex-col items-center p-0 gap-2 text-center">
                  <CardTitle className="font-sans text-xl font-bold text-emerald-700">
                    {pkg.title}
                  </CardTitle>
                  <p className="font-poppins text-start text-[13px] font-normal text-black">
                    {pkg.description}
                  </p>
                </CardContent>
                <Link
                  href={pkg.href}
                  className="font-poppins text-sm font-bold text-emerald-700 mt-auto pt-2 self-start"
                >
                  Selengkapnya &gt;
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default PaketTourSection;
