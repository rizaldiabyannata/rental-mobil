import prisma from "@/lib/prisma";

export async function GET(_request, { params }) {
  try {
    const id = params?.id;
    if (!id || typeof id !== "string") {
      return new Response("ID tidak valid", { status: 400 });
    }
    const data = await prisma.tourPackage.findUnique({
      where: { id },
      include: {
        hotelTiers: {
          orderBy: { order: "asc" },
          include: { priceTiers: { orderBy: { price: "asc" } } },
        },
      },
    });
    if (!data) return new Response("Tidak ditemukan", { status: 404 });
    console.log("Tour package data:", data);
    return Response.json(data);
  } catch (err) {
    console.error(`GET /api/admin/tour-packages/${params?.id} error`, err);
    return new Response("Gagal memuat paket tour", { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const id = params?.id;
    if (!id || typeof id !== "string") {
      return new Response("ID tidak valid", { status: 400 });
    }
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
    // If slug changes, ensure it's still unique
    const existing = await prisma.tourPackage.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      return new Response("Slug sudah digunakan", { status: 409 });
    }
    const updated = await prisma.$transaction(async (tx) => {
      const pkg = await tx.tourPackage.update({
        where: { id },
        data: {
          name,
          slug,
          description:
            typeof description === "object"
              ? JSON.stringify(description)
              : description,
          duration,
          inclusions,
          galleryImages,
          showHotels: Boolean(showHotels),
        },
      });

      // Replace tiers: delete existing and recreate
      const existingTiers = await tx.hotelTier.findMany({
        where: { tourPackageId: id },
        select: { id: true },
      });
      const existingTierIds = existingTiers.map((t) => t.id);
      if (existingTierIds.length) {
        await tx.priceTier.deleteMany({
          where: { hotelTierId: { in: existingTierIds } },
        });
        await tx.hotelTier.deleteMany({
          where: { id: { in: existingTierIds } },
        });
      }

      if (Array.isArray(hotelTiers) && hotelTiers.length) {
        for (let i = 0; i < hotelTiers.length; i++) {
          const t = hotelTiers[i];
          if (!t) continue;
          const tier = await tx.hotelTier.create({
            data: {
              tourPackageId: id,
              name:
                t.name ||
                (typeof t.starRating === "number"
                  ? `Hotel Bintang ${t.starRating}`
                  : `Tier ${i + 1}`),
              hotels: Array.isArray(t.hotels) ? t.hotels : [],
              order: typeof t.order === "number" ? t.order : i,
              starRating:
                typeof t.starRating === "number" ? t.starRating : null,
            },
          });
          if (Array.isArray(t.priceTiers) && t.priceTiers.length) {
            for (const p of t.priceTiers) {
              if (!p) continue;
              await tx.priceTier.create({
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

      return pkg;
    });
    return Response.json(updated);
  } catch (err) {
    console.error(
      `PUT /api/admin/tour-packages/${await params?.id} error`,
      err
    );
    return new Response("Gagal memperbarui paket tour", { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const id = params?.id;
    if (!id || typeof id !== "string") {
      return new Response(JSON.stringify({ message: "ID tidak valid" }), {
        status: 400,
      });
    }

    // Optional: delete related tiers first if onDelete is not cascading
    // await prisma.priceTier.deleteMany({ where: { hotelTier: { tourPackageId: id } } });
    // await prisma.hotelTier.deleteMany({ where: { tourPackageId: id } });

    const deleted = await prisma.tourPackage.delete({ where: { id } });
    return Response.json({ success: true, deleted });
  } catch (err) {
    console.error(`DELETE /api/admin/tour-packages/${params?.id} error`, err);
    return new Response(
      JSON.stringify({ message: "Gagal menghapus paket tour" }),
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
