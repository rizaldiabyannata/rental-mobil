import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Detail car by ID (public endpoint)
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const car = await prisma.car.findUnique({
      where: {
        id,
        isAvailable: true, // Hanya tampilkan jika tersedia
      },
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
        createdAt: true,
      },
    });

    if (!car) {
      return NextResponse.json(
        { error: "Car not found or not available" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: car,
    });
  } catch (error) {
    console.error("Get public car by ID error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
