import SectionHeading from "@/components/SectionHeading";
import TourCard from "@/components/tours/TourCard";
import { prisma } from "@/lib/prisma";

// Server component: fetch a few latest tour packages and show as cards
export default async function TourTeaserSection() {
  let packages = [];
  try {
    packages = await prisma.tourPackage.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        name: true,
        slug: true,
        description: true,
        duration: true,
        inclusions: true,
        galleryImages: true,
        hotelTiers: {
          select: {
            priceTiers: {
              select: { price: true },
              orderBy: { price: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });
  } catch (e) {
    console.error("TourTeaserSection fetch failed:", e?.message || e);
    packages = [];
  }

  const cards = packages.map((pkg) => {
    // compute minimal price if hotel tiers exist
    let minPrice = null;
    try {
      const prices = (pkg.hotelTiers || [])
        .flatMap((t) => t.priceTiers || [])
        .map((p) => p.price)
        .filter((n) => typeof n === "number" && !isNaN(n));
      if (prices.length) minPrice = Math.min(...prices);
    } catch {}
    // Map inclusions text to icon keys used by TourCard
    const includes = Array.isArray(pkg.inclusions)
      ? pkg.inclusions
          .map((i) => (typeof i === "string" ? i.toLowerCase() : ""))
          .reduce((acc, text) => {
            if (!text) return acc;
            if (
              text.includes("dokumentasi") ||
              text.includes("dokumentation") ||
              text.includes("documentation") ||
              text.includes("foto") ||
              text.includes("photo") ||
              text.includes("kamera") ||
              text.includes("camera") ||
              text.includes("video")
            )
              acc.add("camera");
            if (text.includes("hotel")) acc.add("hotel");
            if (text.includes("mobil")) acc.add("car");
            if (text.includes("driver") || text.includes("sopir"))
              acc.add("driver");
            if (text.includes("tiket")) acc.add("ticket");
            if (
              text.includes("makan") ||
              text.includes("lunch") ||
              text.includes("meal")
            )
              acc.add("meal");
            if (text.includes("air") || text.includes("mineral"))
              acc.add("water");
            return acc;
          }, new Set())
      : new Set();

    return {
      slug: pkg.slug,
      title: pkg.name,
      shortDescription: pkg.description,
      coverImage: pkg.galleryImages ? pkg.galleryImages[0] : null,
      durationText: pkg.duration,
      // Include minPrice only when available; TourCard will render price conditionally
      ...(minPrice !== null ? { minPrice } : {}),
      features: [],
      includes: Array.from(includes),
    };
  });

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading
          title="Paket Tour Populer"
          align="center"
          size="md"
          underline
          underlineColor="bg-amber-500"
          underlineWidth="lg"
          underlineOffset="md"
          titleClassName="text-primary"
          underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
          className="mb-6 md:mb-10"
          description="Pilihan paket yang sering dipesan pelanggan kami."
        />
        {cards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {cards.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Belum ada paket tour yang tersedia.
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <a
            href="/paket-tour"
            className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-primary hover:bg-primary/10"
          >
            Lihat Semua Paket
          </a>
        </div>
      </div>
    </section>
  );
}
