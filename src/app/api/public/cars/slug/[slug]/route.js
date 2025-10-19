import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Detail car by SLUG (public endpoint)
export async function GET(request, props) {
  try {
    const { params } = await props;
    const { slug } = params;

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "id";

    const car = await prisma.car.findFirst({
      where: { slug, available: true },
      select: {
        slug: true,
        name_id: true,
        name_en: true,
        description_id: true,
        description_en: true,
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
          select: {
            icon: true,
            title_id: true,
            title_en: true,
            description_id: true,
            description_en: true,
            order: true,
          },
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
        name: locale === "en" ? car.name_en : car.name_id,
        description: locale === "en" ? car.description_en : car.description_id,
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
          title: locale === "en" ? fb.title_en : fb.title_id,
          description: locale === "en" ? fb.description_en : fb.description_id,
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
