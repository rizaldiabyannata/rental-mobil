import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Detail car by SLUG (public endpoint)
export async function GET(request, props) {
  try {
    const { params } = await props;
    const { slug } = params;

    const car = await prisma.car.findFirst({
      where: { slug, available: true },
      select: {
        slug: true,
        name: true,
        description: true,
        startingPrice: true,
        capacity: true,
        transmission: true,
        fuelType: true,
        specifications: true, // Needed for coverImage and details
        images: {
          select: { id: true, imageUrl: true, alt: true, order: true },
          orderBy: { order: "asc" },
        },
        tariffItems: {
          select: {
            name: true,
            price: true,
            order: true,
            category: { select: { name: true } },
          },
          orderBy: { order: "asc" },
        },
        featureBlocks: {
          select: { icon: true, title: true, description: true, order: true },
          orderBy: { order: "asc" },
        },
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
        slug: car.slug,
        name: car.name,
        description: car.description,
        startingPrice: car.startingPrice,
        capacity: car.capacity,
        transmission: car.transmission,
        fuelType: car.fuelType,
        coverImage: car.specifications?.coverImage || null,
        details: Array.isArray(car.specifications?.details)
          ? car.specifications.details
          : [],
        // The frontend uses `featureBlocks`, so we map that.
        featureBlocks: car.featureBlocks.map((fb) => ({
          icon: fb.icon,
          title: fb.title,
          description: fb.description,
          order: fb.order,
        })),
        gallery: car.images.map((i) => ({
          id: i.id, // id is needed for react keys
          url: i.imageUrl,
          alt: i.alt,
          order: i.order,
        })),
        // The frontend uses `tariffs`, so we map `tariffItems` to that.
        tariffs: car.tariffItems.map((t) => ({
          name: t.name,
          price: t.price,
          category: t.category?.name || null,
          order: t.order,
        })),
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
