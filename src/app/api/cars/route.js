import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

// GET - List semua cars dengan pagination dan filter
async function getCars(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const isAvailable = searchParams.get("isAvailable");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    let where = {};

    // Filter berdasarkan ketersediaan
    if (isAvailable !== null && isAvailable !== undefined) {
      where.isAvailable = isAvailable === "true";
    }

    // Filter berdasarkan pencarian
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
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
      data: cars,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get cars error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create car baru (hanya admin)
async function createCar(request) {
  try {
    const {
      name,
      brand,
      model,
      year,
      pricePerDay,
      description,
      imageUrl,
      capacity,
      transmission,
      fuelType,
      isAvailable = true,
    } = await request.json();

    // Validasi input
    if (!name || !brand || !model || !year || !pricePerDay) {
      return NextResponse.json(
        { error: "Name, brand, model, year, and pricePerDay are required" },
        { status: 400 }
      );
    }

    // Validasi harga harus positif
    if (pricePerDay <= 0) {
      return NextResponse.json(
        { error: "Price per day must be positive" },
        { status: 400 }
      );
    }

    // Create car
    const car = await prisma.car.create({
      data: {
        name,
        brand,
        model,
        year: parseInt(year),
        pricePerDay: parseInt(pricePerDay),
        description,
        imageUrl,
        capacity: capacity ? parseInt(capacity) : null,
        transmission,
        fuelType,
        isAvailable,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Car created successfully",
        data: car,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create car error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getCars);
export const POST = withAuth(createCar);
