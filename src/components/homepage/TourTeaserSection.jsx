import SectionHeading from "@/components/SectionHeading";
import TourCard from "@/components/tours/TourCard";
import { prisma } from "@/lib/prisma";

// Server component: fetch a few latest tour packages and show as cards
export default async function TourTeaserSection() {
  let packages = [];
  try {
    // 1) Get all slugs, then sample 3 randomly to avoid heavy payloads
    const all = await prisma.tourPackage.findMany({ select: { slug: true } });
    if (!all?.length) {
      packages = [];
    } else {
      const sampleSize = Math.min(3, all.length);
      const picked = new Set();
      while (picked.size < sampleSize) {
        const idx = Math.floor(Math.random() * all.length);
        picked.add(all[idx].slug);
      }
      const selectedSlugs = Array.from(picked);
      const orderIndex = new Map(selectedSlugs.map((s, i) => [s, i]));

      // 2) Fetch only selected packages with the full fields required
      const selected = await prisma.tourPackage.findMany({
        where: { slug: { in: selectedSlugs } },
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

      // 3) Preserve the random order
      packages = (selected || []).sort(
        (a, b) => (orderIndex.get(a.slug) ?? 0) - (orderIndex.get(b.slug) ?? 0)
      );
    }
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

    // Prioritas mapping includes sama seperti page.jsx
    const inclusionPriority = [
      "hotel (sesuai pilihan) mobil full ac",
      "bbm driver",
      "local guide",
      "guide (merangkap jadi fotografer)",
      "makan siang 5x",
      "makan malam 4x",
      "parcel buah (day 1)",
      "kalung selamat datang (songket)",
      "mineral water",
      "private glash bottom boat",
      "snorkling gear (mask & life jaket)",
      "fotografer underwater",
      "premium dokumentasi by guide",
      "foto menggunakan baju adat sasak",
      "tiket masuk",
      "parkir",
    ];
    let includes = [];
    if (Array.isArray(pkg.inclusions)) {
      const lowerInclusions = pkg.inclusions.map((i) =>
        typeof i === "string" ? i.toLowerCase() : ""
      );
      includes = inclusionPriority.filter((point) => {
        const mainKeyword = point.split(" ")[0].toLowerCase();
        return lowerInclusions.some((inc) => inc.includes(mainKeyword));
      });
      if (includes.length < 4) {
        includes = lowerInclusions.slice(0, 5);
      } else {
        includes = includes.slice(0, 5);
      }
    }

    // Ambil deskripsi utama dari JSON
    let descriptionText = "";
    if (typeof pkg.description === "string") {
      descriptionText = pkg.description;
    } else if (pkg.description && typeof pkg.description === "object") {
      descriptionText =
        pkg.description.text ||
        pkg.description.plain ||
        JSON.stringify(pkg.description);
    }

    return {
      slug: pkg.slug,
      title: pkg.name,
      description: descriptionText,
      coverImage: pkg.galleryImages ? pkg.galleryImages[0] : null,
      durationText: pkg.duration,
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
