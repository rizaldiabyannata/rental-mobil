import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Detail car by SLUG (public endpoint)
export async function GET(request, props) {
  try {
    const { params } = await props;
    const { slug } = params;

    const car = await prisma.car.findFirst({
      where: { slug, available: true },
      include: {
        images: { orderBy: { order: "asc" } },
        tariffItems: {
          orderBy: { order: "asc" },
          include: { category: true },
        },
        featureBlocks: { orderBy: { order: "asc" } },
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
      data: {
        id: car.id,
        slug: car.slug,
        name: car.name,
        description: car.description,
        startingPrice: car.startingPrice,
        capacity: car.capacity,
        transmission: car.transmission,
        fuelType: car.fuelType,
        features: car.features,
        coverImage: car.specifications?.coverImage || null,
        details: Array.isArray(car.specifications?.details)
          ? car.specifications.details
          : [],
        featureCards: Array.isArray(car.specifications?.featureCards)
          ? car.specifications.featureCards
          : [],
        featureBlocks: car.featureBlocks
          ? car.featureBlocks.map((fb) => ({
              icon: fb.icon,
              title: fb.title,
              description: fb.description,
              order: fb.order,
            }))
          : [],
        gallery: car.images.map((i) => ({
          id: i.id,
          url: i.imageUrl,
          alt: i.alt,
          order: i.order,
        })),
        tariffs: car.tariffItems
          ? car.tariffItems.map((t) => ({
              id: t.id,
              name: t.name,
              price: t.price,
              description: t.description,
              category: t.category?.name || null,
              order: typeof t.order === "number" ? t.order : 0,
            }))
          : [],
        createdAt: car.createdAt,
      },
    });
  } catch (error) {
    console.error("Get public car by slug error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
