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

  if (includeTariffs) {
    const items = car.tariffItems || car.tariffs;
    if (items) {
      base.tariffs = items.map((t) => ({
        id: t.id,
        name: t.name,
        price: t.price,
        description: t.description,
        category: t.category?.name || t.category || null,
        order: typeof t.order === "number" ? t.order : 0,
        createdAt: t.createdAt,
        serviceType: t.serviceType,
        packageType: t.packageType,
        carId: t.carId || null,
      }));
    }
  }

  // Convenience: expose coverImage if stored di specifications
  const coverImage = car.specifications?.coverImage;
  if (coverImage) {
    base.coverImage = coverImage;
  }
  if (Array.isArray(car.specifications?.featureCards)) {
    base.featureCards = car.specifications.featureCards;
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
          _count: { select: { images: true, tariffItems: true } },
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

    // Validasi input dasar
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

    // Normalisasi specifications: boleh object atau array (akan jadi { details: [...] })
    let specsNormalized = null;
    if (Array.isArray(specifications)) {
      specsNormalized = { details: specifications };
    } else if (
      specifications &&
      typeof specifications === "object" &&
      !Array.isArray(specifications)
    ) {
      specsNormalized = { ...specifications };
    } else if (specifications == null) {
      specsNormalized = null;
    } else {
      return NextResponse.json(
        { error: "specifications must be an object or array" },
        { status: 400 }
      );
    }

    // Normalisasi features: terima array string ATAU array objek fitur unggulan
    let featuresStrings = [];
    if (features == null) {
      featuresStrings = [];
    } else if (
      Array.isArray(features) &&
      features.every((f) => typeof f === "string")
    ) {
      featuresStrings = features;
    } else if (
      Array.isArray(features) &&
      features.every((f) => f && typeof f === "object" && !Array.isArray(f))
    ) {
      // Pindahkan ke specifications.featureCards
      specsNormalized = specsNormalized || {};
      specsNormalized.featureCards = features;
      featuresStrings = [];
    } else {
      return NextResponse.json(
        { error: "features must be an array of strings or array of objects" },
        { status: 400 }
      );
    }

    // Kumpulkan featureBlocks dari body atau dari specifications.featureCards
    const incomingFeatureBlocks = Array.isArray(body.featureBlocks)
      ? body.featureBlocks
      : Array.isArray(specsNormalized?.featureCards)
      ? specsNormalized.featureCards
      : [];

    // Buat dalam transaksi agar konsisten
    const created = await prisma.$transaction(async (tx) => {
      const newCar = await tx.car.create({
        data: {
          name,
          description: description || null,
          startingPrice: parseInt(startingPrice),
          capacity: capacity ? parseInt(capacity) : 0,
          transmission,
          fuelType,
          available,
          features: featuresStrings,
          specifications: specsNormalized,
        },
      });

      // Normalisasi dan simpan featureBlocks jika ada
      if (
        Array.isArray(incomingFeatureBlocks) &&
        incomingFeatureBlocks.length
      ) {
        const normalized = incomingFeatureBlocks
          .filter(
            (b) =>
              b &&
              b.icon &&
              b.title &&
              typeof b.title === "string" &&
              b.title.trim() !== ""
          )
          .map((b, idx) => ({
            carId: newCar.id,
            icon: String(b.icon),
            title: String(b.title).trim(),
            description: b.description ? String(b.description).trim() : "",
            order: typeof b.order === "number" ? b.order : idx,
          }));

        if (normalized.length) {
          await tx.carFeature.createMany({ data: normalized });
        }
      }

      // Ambil kembali car lengkap jika ingin dipakai di response
      return tx.car.findUnique({ where: { id: newCar.id } });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Car created successfully",
        data: carToApi(created),
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
