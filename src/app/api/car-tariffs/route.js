import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

// GET - List car tariffs with optional carId filter and search
async function getCarTariffs(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const carId = searchParams.get("carId") || undefined;

    const skip = (page - 1) * limit;
    const where = {};
    if (carId) where.carId = carId;
    if (search) where.name = { contains: search, mode: "insensitive" };

    const [items, total] = await Promise.all([
      prisma.carTariff.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.carTariff.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get car tariffs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a car tariff
async function createCarTariff(request) {
  try {
    const body = await request.json();
    const { carId, name, price, description } = body;

    if (!carId || !name || price === undefined) {
      return NextResponse.json(
        { error: "carId, name, and price are required" },
        { status: 400 }
      );
    }

    // Validate car exists
    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const item = await prisma.carTariff.create({
      data: {
        carId,
        name,
        price: parseInt(price),
        description: description || null,
      },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Create car tariff error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getCarTariffs);
export const POST = withAuth(createCarTariff);
