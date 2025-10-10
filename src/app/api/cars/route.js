import { NextResponse } from "next/server";
import { maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

// Mapping layer between legacy API field names and Prisma schema fields
// Schema fields: startingPrice, available, features (String[]), specifications (Json?)
function carToApi(car, { includeImages = true, includeTariffs = true } = {}) {
  if (!car) return car;

  const base = {
    id: car.id,
    name: car.name,
    description: car.description,
    startingPrice: car.startingPrice,
    capacity: car.capacity,
    transmission: car.transmission,
    fuelType: car.fuelType,
    available: car.available,
    features: Array.isArray(car.features) ? car.features : [],
    specifications: car.specifications || null,
    createdAt: car.createdAt,
    updatedAt: car.updatedAt,
    _count: car._count || undefined,
  };

  if (includeImages && car.images) {
    base.images = car.images.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      alt: img.alt,
      order: img.order,
      createdAt: img.createdAt,
    }));
  }

  if (includeTariffs && car.tariffs) {
    base.tariffs = car.tariffs.map((tariff) => ({
      id: tariff.id,
      name: tariff.name,
      price: tariff.price,
      description: tariff.description,
      createdAt: tariff.createdAt,
    }));
  }

  // Convenience: expose coverImage if stored di specifications
  const coverImage = car.specifications?.coverImage;
  if (coverImage) {
    base.coverImage = coverImage;
  }

  return base;
}

function buildCarWhereFilters({ search, available }) {
  const where = {};
  if (available !== undefined && available !== null) {
    where.available = available === "true";
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { transmission: { contains: search, mode: "insensitive" } },
      { fuelType: { contains: search, mode: "insensitive" } },
    ];
  }
  return where;
}

// GET - List semua cars dengan pagination dan filter
async function getCars(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const isAvailable = searchParams.get("available");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where = buildCarWhereFilters({ search, available: isAvailable });

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { images: true, tariffs: true } },
          images: {
            orderBy: { order: "asc" },
            take: 1,
          },
        },
      }),
      prisma.car.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: cars.map((car) =>
        carToApi(
          {
            ...car,
            images: car.images,
          },
          { includeTariffs: false }
        )
      ),
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
    const body = await request.json();
    const {
      name,
      description,
      startingPrice,
      capacity,
      transmission,
      fuelType,
      available = true,
      features,
      specifications,
    } = body;

    // Validasi input
    if (!name || startingPrice === undefined) {
      return NextResponse.json(
        { error: "Name and startingPrice are required" },
        { status: 400 }
      );
    }
    if (startingPrice <= 0) {
      return NextResponse.json(
        { error: "startingPrice must be positive" },
        { status: 400 }
      );
    }
    if (features && !Array.isArray(features)) {
      return NextResponse.json(
        { error: "features must be an array of strings" },
        { status: 400 }
      );
    }
    if (features && !features.every((f) => typeof f === "string")) {
      return NextResponse.json(
        { error: "each feature must be string" },
        { status: 400 }
      );
    }

    const car = await prisma.car.create({
      data: {
        name,
        description: description || null,
        startingPrice: parseInt(startingPrice),
        capacity: capacity ? parseInt(capacity) : 0,
        transmission,
        fuelType,
        available,
        features: features || [],
        specifications: specifications || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Car created successfully",
        data: carToApi(car),
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

export const GET = maybeWithAuth(getCars);
export const POST = maybeWithAuth(createCar);
