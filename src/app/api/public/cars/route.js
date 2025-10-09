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

    let where = {
      isAvailable: true, // Hanya tampilkan mobil yang tersedia
    };

    // Filter berdasarkan pencarian
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter berdasarkan brand
    if (brand) {
      where.brand = { contains: brand, mode: "insensitive" };
    }

    // Filter berdasarkan harga
    if (minPrice || maxPrice) {
      where.pricePerDay = {};
      if (minPrice) where.pricePerDay.gte = parseInt(minPrice);
      if (maxPrice) where.pricePerDay.lte = parseInt(maxPrice);
    }

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        select: {
          id: true,
          name: true,
          brand: true,
          model: true,
          year: true,
          pricePerDay: true,
          description: true,
          imageUrl: true,
          capacity: true,
          transmission: true,
          fuelType: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.car.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: cars,
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
