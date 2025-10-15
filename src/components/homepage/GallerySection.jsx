
import Image from "next/image";

const images = [
  { src: "/gallery-1.jpg", alt: "Interior Mobil Bersih" },
  { src: "/gallery-2.jpg", alt: "Armada Toyota Hiace" },
  { src: "/gallery-3.jpg", alt: "Perjalanan di Lombok" },
  { src: "/gallery-4.jpg", alt: "Toyota Innova Reborn" },
  { src: "/gallery-5.jpg", alt: "Liburan Keluarga" },
  { src: "/gallery-6.jpg", alt: "Pemandangan Pantai Lombok" },
];

const GallerySection = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Galeri Armada & Perjalanan
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Lihat lebih dekat armada kami dan momen perjalanan pelanggan kami.
          </p>
        </div>
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
