export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import SectionHeading from "@/components/SectionHeading";
import TourCard from "@/components/tours/TourCard";
import PageHero from "@/components/shared/PageHero";

async function getTourPackages() {
  let tourPackages = [];
  try {
    tourPackages = await prisma.tourPackage.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        slug: true,
        description: true,
        duration: true,
        galleryImages: true,
        startingPrice: true,
        inclusions: true,
      },
    });
  } catch (e) {
    console.error("getTourPackages failed:", e?.message || e);
    return [];
  }

  const inclusionPriority = [
    "hotel", "mobil", "bbm", "driver", "guide", "makan",
    "boat", "snorkling", "dokumentasi", "tiket masuk", "parkir"
  ];

  return tourPackages.map((pkg) => {
    const coverImage = (pkg.galleryImages && pkg.galleryImages[0]) || null;

    let mainInclusions = [];
    if (Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0) {
      const lowerInclusions = pkg.inclusions.map(i => String(i || '').toLowerCase());
      mainInclusions = inclusionPriority.filter(point =>
        lowerInclusions.some(inc => inc.includes(point))
      );
      if (mainInclusions.length === 0) {
        mainInclusions = pkg.inclusions.slice(0, 5);
      } else {
        mainInclusions = mainInclusions.slice(0, 5);
      }
    }

    let shortDescription = "";
    if (pkg.description) {
        try {
            const parsed = pkg.description;
            shortDescription = (parsed.plain || parsed.text || "Klik untuk detail").substring(0, 100) + "...";
        } catch (e) {
            shortDescription = String(pkg.description).substring(0, 100) + "...";
        }
    }

    return {
      slug: pkg.slug,
      title: pkg.name,
      description: pkg.description,
      shortDescription,
      coverImage: coverImage,
      durationText: pkg.duration,
      minPrice: pkg.startingPrice,
      includes: mainInclusions,
    };
  });
}

export default async function TourListPage() {
  const tours = await getTourPackages();
  return (
    <main>
      <PageHero
        title="Paket Wisata Pilihan"
        subtitle="Temukan petualangan tak terlupakan di Lombok dengan paket wisata eksklusif kami. Dirancang untuk memberikan pengalaman terbaik dengan harga yang kompetitif."
        imageUrl="/Hero-2.png"
      />
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title={"Semua Paket Wisata"}
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
              "Pilih paket yang paling sesuai dengan kebutuhan perjalanan Anda."
            }
          />
          {tours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {tours.map((tour) => (
                <TourCard key={tour.slug} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>
                Saat ini belum ada paket wisata yang tersedia. Silakan periksa
                kembali nanti.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
