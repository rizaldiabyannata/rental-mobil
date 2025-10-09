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
      }),
      prisma.car.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: cars.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        startingPrice: c.startingPrice,
        capacity: c.capacity,
        transmission: c.transmission,
        fuelType: c.fuelType,
        available: c.available,
        features: c.features,
        coverImage: c.specifications?.coverImage || null,
      })),
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
