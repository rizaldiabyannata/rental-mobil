import Image from "next/image";

const galleryImages = [
  { src: "/sopir.png", alt: "Sopir Ramah" },
  { src: "/antar-jemput.png", alt: "Antar Jemput Bandara" },
  { src: "/tour.png", alt: "Paket Wisata Tour" },
  { src: "/armada.png", alt: "Armada Innova Reborn" },
  { src: "/pembayaran.png", alt: "Proses Mudah" },
];

const GallerySection = () => {
  return (
    <section className="py-[15px] md:py-[25px]">
      <div className="w-full overflow-x-auto flex gap-4 md:gap-6 snap-x snap-mandatory scrollbar-hide pl-4 md:pl-8 lg:pl-16">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 snap-center w-4/5 sm:w-1/2 md:w-1/3 lg:w-1/4"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 80vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GallerySection;
