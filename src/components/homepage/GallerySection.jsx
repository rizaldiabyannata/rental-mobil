import Image from "next/image";
import SectionHeading from "../SectionHeading";

const images = [
  { src: "/sopir.png", alt: "Sopir Ramah" },
  { src: "/antar-jemput.png", alt: "Antar Jemput Bandara" },
  { src: "/tour.png", alt: "Paket Wisata Tour" },
  { src: "/armada.png", alt: "Armada Innova Reborn" },
  { src: "/pembayaran.png", alt: "Proses Mudah" },
  { src: "/Hiace-2.png", alt: "Toyota HiAce" },
];

const GallerySection = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={"Galeri Armada & Perjalanan"}
          align="center"
          size="md"
          underline
          underlineColor="bg-amber-500"
          underlineWidth="lg"
          underlineOffset="md"
          titleClassName="text-primary"
          underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
          className="mb-6 md:mb-10"
          description={
            "Lihat lebih dekat armada kami dan momen perjalanan pelanggan kami."
          }
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
