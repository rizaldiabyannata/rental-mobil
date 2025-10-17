import SectionHeading from "@/components/SectionHeading";
import TourCard from "@/components/tours/TourCard";
import HeroSection from "@/components/homepage/HeroSection";

// Placeholder data with features
async function getTours() {
  return [
    {
      slug: "explore-mataram",
      title: "Explore Mataram",
      shortDescription: "City tour Mataram & kuliner lokal",
      coverImage: "/Hero-1.png",
      durationDays: 1,
      minPrice: 450000,
      features: ["city", "car", "group"],
    },
    {
      slug: "gili-island-daytrip",
      title: "Gili Island Daytrip",
      shortDescription: "Snorkeling & pantai",
      coverImage: "/Hero-2.png",
      durationDays: 1,
      minPrice: 750000,
      features: ["beach", "car", "group"],
    },
  ];
}

export default async function TourListPage() {
  const tours = await getTours();
  return (
    <main>
      <HeroSection
        imageOnRight={false}
        imageSrc="/Hero-1.png"
        title={
          <>
            <span className="text-black">Paket Tour </span>
            <span className="text-emerald-700">Kami</span>
          </>
        }
        subtitle="Selamat datang di layanan rental mobil Reborn Lombok Trans. Dengan melanjutkan proses pemesanan, Anda menyatakan telah membaca, memahami, dan setuju untuk terikat pada semua syarat dan ketentuan yang tercantum di halaman ini. Mohon luangkan waktu untuk mempelajarinya dengan saksama."
      />
      <section className="w-full py-8 md:py-12">
        <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8">
          <SectionHeading
            title="Paket Tour Lombok"
            align="center"
            size="md"
            underline
            underlineColor="bg-amber-500"
            underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
            className="mb-6 md:mb-10"
            description="Pilih paket tour terbaik sesuai kebutuhan Anda."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((t) => (
              <TourCard key={t.slug} tour={t} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
