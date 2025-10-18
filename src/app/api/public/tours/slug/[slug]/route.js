import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json(
      { message: "Slug is required." },
      { status: 400 }
    );
  }

  try {
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { slug },
      include: {
        hotelTiers: {
          orderBy: { order: "asc" },
          include: {
            priceTiers: {
              orderBy: { price: "asc" },
            },
          },
        },
      },
    });

    if (!tourPackage) {
      return NextResponse.json(
        { message: "Tour package not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Tour package retrieved successfully.",
      data: tourPackage,
    });
  } catch (error) {
    console.error(`Error fetching tour package with slug ${slug}:`, error);
    return NextResponse.json(
      {
        message: "Failed to retrieve tour package.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
