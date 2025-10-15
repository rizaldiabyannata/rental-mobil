import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Layanan Unggulan Kami
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Kami menyediakan beberapa layanan utama untuk menemani perjalanan
            Anda di Lombok.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tourPackages.map((pkg, index) => (
            <Card
              key={index}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className={`object-cover ${pkg.imagePosition}`}
                />
              </div>
              <CardContent className="flex flex-1 flex-col p-6">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {pkg.title}
                </CardTitle>
                <p className="mt-2 flex-1 text-base text-gray-600">
                  {pkg.description}
                </p>
                <div className="mt-4">
                  <Link href={pkg.href}>
                    <Button variant="link" className="p-0 text-base">
                      Selengkapnya &rarr;
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default PaketTourSection;
