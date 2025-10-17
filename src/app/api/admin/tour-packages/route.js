import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const packages = await prisma.tourPackage.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        hotelTiers: {
          orderBy: { order: "asc" },
          include: {
            priceTiers: {
              orderBy: { price: "asc" },
            },
          },
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
      description = "",
      duration,
      inclusions = [],
      galleryImages = [],
      showHotels = true,
      hotelTiers = [],
    } = body || {};
    if (!name || !slug || !duration) {
      return new Response("Field wajib: name, slug, duration", { status: 400 });
    }
    // Ensure slug unique
    const existing = await prisma.tourPackage.findUnique({ where: { slug } });
    if (existing) {
      return new Response("Slug sudah digunakan", { status: 409 });
    }
    const created = await prisma.tourPackage.create({
      data: {
        name,
        slug,
        description,
        duration,
        inclusions,
        galleryImages,
        showHotels: Boolean(showHotels),
      },
    });

    // Create hotel tiers if provided
    if (Array.isArray(hotelTiers) && hotelTiers.length) {
      for (let i = 0; i < hotelTiers.length; i++) {
        const t = hotelTiers[i];
        if (!t) continue;
        const tier = await prisma.hotelTier.create({
          data: {
            tourPackageId: created.id,
            name:
              t.name ||
              (typeof t.starRating === "number"
                ? `Hotel Bintang ${t.starRating}`
                : `Tier ${i + 1}`),
            hotels: Array.isArray(t.hotels) ? t.hotels : [],
            order: typeof t.order === "number" ? t.order : i,
            starRating: typeof t.starRating === "number" ? t.starRating : null,
          },
        });
        if (Array.isArray(t.priceTiers) && t.priceTiers.length) {
          for (const p of t.priceTiers) {
            if (!p) continue;
            await prisma.priceTier.create({
              data: {
                hotelTierId: tier.id,
                paxRange: String(p.paxRange || "").trim(),
                price: Number(p.price || 0),
              },
            });
          }
        }
      }
    }
    return Response.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/tour-packages error", err);
    return new Response("Gagal membuat paket tour", { status: 500 });
  }
}
