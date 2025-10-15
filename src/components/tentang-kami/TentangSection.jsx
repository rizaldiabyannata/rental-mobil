import Image from "next/image";

const FeatureBlock = ({ imageSrc, title, description, imageLeft = false }) => {
  const imageOrder = imageLeft ? "md:order-first" : "md:order-last";
  const textAlign = imageLeft ? "md:text-left" : "md:text-left"; // Tetap text-left di desktop

  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
      <div className={`relative aspect-video w-full ${imageOrder}`}>
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="rounded-lg object-cover shadow-lg"
        />
      </div>
      <div className={`text-center ${textAlign}`}>
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {title}
        </h3>
        <p className="mt-4 text-lg text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const TentangSection = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto space-y-16 px-4">
        <FeatureBlock
          imageSrc="/gallery-1.jpg"
          title="Tentang Reborn Lombok Trans"
          description="Reborn Lombok Trans adalah solusi rental mobil Anda di Mataram untuk seluruh wilayah Lombok. Kami menawarkan paket praktis sudah termasuk mobil, sopir berpengalaman, dan bensin, sehingga perjalanan Anda nyaman tanpa biaya tersembunyi."
          imageLeft={true}
        />
        <FeatureBlock
          imageSrc="/gallery-4.jpg"
          title="Armada Terbaik & Terawat"
          description="Dengan armada terbaru tahun 2025 yang bersih dan terawat, kami siap melayani kebutuhan wisata, perjalanan bisnis, hingga antar-jemput bandara. Keamanan, kenyamanan, dan kepuasan Anda adalah prioritas kami."
          imageLeft={false}
        />
      </div>
    </section>
  );
};
export default TentangSection;
