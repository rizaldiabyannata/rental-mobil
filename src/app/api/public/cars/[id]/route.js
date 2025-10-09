import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Detail car by ID (public endpoint)
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const car = await prisma.car.findUnique({
      where: { id, available: true },
      include: { images: { orderBy: { order: "asc" } }, tariffs: true },
    });

    if (!car) {
      return NextResponse.json(
        { error: "Car not found or not available" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: car.id,
        name: car.name,
        description: car.description,
        startingPrice: car.startingPrice,
        capacity: car.capacity,
        transmission: car.transmission,
        fuelType: car.fuelType,
        features: car.features,
        coverImage: car.specifications?.coverImage || null,
        gallery: car.images.map((i) => ({
          id: i.id,
          url: i.imageUrl,
          alt: i.alt,
          order: i.order,
        })),
        tariffs: car.tariffs.map((t) => ({
          id: t.id,
          name: t.name,
          price: t.price,
          description: t.description,
        })),
        createdAt: car.createdAt,
      },
    });
  } catch (error) {
    console.error("Get public car by ID error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
