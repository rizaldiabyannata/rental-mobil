import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List semua cars yang tersedia (public endpoint)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const search = searchParams.get("search") || "";
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const skip = (page - 1) * limit;

    let where = { available: true };

    // Filter berdasarkan pencarian
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { transmission: { contains: search, mode: "insensitive" } },
        { fuelType: { contains: search, mode: "insensitive" } },
      ];
    }

    // brand not in schema explicitly, treat as feature match or skip (schema lacks brand/model fields now)

    // Filter berdasarkan harga
    if (minPrice || maxPrice) {
      where.startingPrice = {};
      if (minPrice) where.startingPrice.gte = parseInt(minPrice);
      if (maxPrice) where.startingPrice.lte = parseInt(maxPrice);
    }

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          slug: true,
          name: true,
          description: true,
          startingPrice: true,
          capacity: true,
          transmission: true,
          fuelType: true,
          specifications: true, // Untuk coverImage
          images: {
            select: {
              imageUrl: true,
              alt: true,
              order: true,
            },
            orderBy: { order: "asc" },
            take: 1, // Hanya ambil 1 gambar untuk fallback
          },
        },
      }),
      prisma.car.count({ where }),
    ]);

    // Frontend (FleetSection) sudah memiliki logika untuk menangani fallback image.
    // Cukup teruskan data yang sudah dioptimalkan.
    const responseData = cars.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      startingPrice: c.startingPrice,
      capacity: c.capacity,
      transmission: c.transmission,
      fuelType: c.fuelType,
      coverImage: c.specifications?.coverImage || null, // Kirim coverImage jika ada
      gallery: c.images.map((img) => ({ // Kirim gallery (hanya 1 gambar) untuk fallback
        url: img.imageUrl,
        alt: img.alt,
        order: img.order,
      })),
    }));

    return NextResponse.json({
      success: true,
      data: responseData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get public cars error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
