import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const packages = await prisma.tourPackage.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        name: true,
        duration: true,
        startingPrice: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { hotelTiers: true, itinerary: true },
        },
      },
    });
    return Response.json(packages);
  } catch (err) {
    console.error("GET /api/admin/tour-packages error", err);
    return new Response("Gagal memuat data paket tour", { status: 500 });
  }
}

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      duration,
      inclusions = [],
      galleryImages = [],
      showHotels = true,
      hotelTiers = [],
      itinerary = [],
    } = body || {};

    if (!name || !slug || !duration) {
      return new Response("Field wajib: name, slug, duration", { status: 400 });
    }

    // Ensure slug is unique
    const existing = await prisma.tourPackage.findUnique({ where: { slug } });
    if (existing) {
      return new Response("Slug sudah digunakan", { status: 409 });
    }

    // Calculate starting price from all price tiers
    let startingPrice = 0;
    try {
      const allPrices = hotelTiers
        .flatMap((ht) => ht.priceTiers || [])
        .map((pt) => Number(pt.price))
        .filter((p) => !isNaN(p) && p > 0);

      if (allPrices.length > 0) {
        startingPrice = Math.min(...allPrices);
      }
    } catch (e) {
      console.error("Error calculating startingPrice:", e);
      startingPrice = 0;
    }

    const result = await prisma.$transaction(async (tx) => {
      const newTourPackage = await tx.tourPackage.create({
        data: {
          name,
          slug,
          duration,
          startingPrice,
          description: description || Prisma.JsonNull,
          inclusions: inclusions || [],
          galleryImages: galleryImages || [],
          showHotels: Boolean(showHotels),
        },
      });

      if (Array.isArray(itinerary) && itinerary.length > 0) {
        await tx.itineraryDay.createMany({
          data: itinerary.map((day, index) => ({
            packageId: newTourPackage.id,
            day: day.day || index + 1,
            title: day.title,
            description: day.description || "",
            activities: day.activities || [],
            images: day.images || Prisma.JsonNull,
          })),
        });
      }

      if (Array.isArray(hotelTiers) && hotelTiers.length > 0) {
        for (let i = 0; i < hotelTiers.length; i++) {
          const t = hotelTiers[i];
          if (!t) continue;

          const createdTier = await tx.hotelTier.create({
            data: {
              tourPackageId: newTourPackage.id,
              name: t.name || `Tier ${i + 1}`,
              order: typeof t.order === "number" ? t.order : i,
              starRating: typeof t.starRating === "number" ? t.starRating : null,
              hotels: t.hotels || [],
            },
          });

          if (Array.isArray(t.priceTiers) && t.priceTiers.length > 0) {
            await tx.priceTier.createMany({
              data: t.priceTiers.map((p) => ({
                hotelTierId: createdTier.id,
                paxRange: String(p.paxRange || "").trim(),
                price: Number(p.price || 0),
              })),
            });
          }
        }
      }

      return newTourPackage;
    });

    return Response.json(result, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/tour-packages error", err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return new Response("Data yang dimasukkan duplikat (misal: slug sudah ada).", { status: 409 });
      }
    }

    return new Response("Gagal membuat paket tour", { status: 500 });
  }
}
