import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tourPackages = await prisma.tourPackage.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        slug: true,
        description: true,
        duration: true,
        inclusions: true,
        galleryImages: true,
        hotelTiers: {
          select: {
            priceTiers: {
              select: { price: true },
              orderBy: { price: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    // This data processing logic is moved from the original Server Component
    // to ensure the API provides the data in the shape the frontend component expects.
    const processedTours = tourPackages.map((pkg) => {
      let minPrice = null;
      const prices = pkg.hotelTiers.flatMap((tier) =>
        tier.priceTiers.map((p) => p.price)
      );
      if (prices.length > 0) {
        minPrice = Math.min(...prices);
      }

      const includes = Array.isArray(pkg.inclusions)
        ? pkg.inclusions
            .map((i) => (typeof i === "string" ? i.toLowerCase() : ""))
            .reduce((acc, text) => {
              if (!text) return acc;
              if (
                text.includes("dokumentasi") || text.includes("foto") || text.includes("camera")
              ) {
                acc.add("camera");
              }
              if (text.includes("hotel")) acc.add("hotel");
              if (text.includes("mobil")) acc.add("car");
              if (text.includes("driver") || text.includes("sopir")) acc.add("driver");
              if (text.includes("tiket")) acc.add("ticket");
              if (text.includes("makan") || text.includes("meal")) acc.add("meal");
              if (text.includes("air") || text.includes("mineral")) acc.add("water");
              return acc;
            }, new Set())
        : new Set();

      return {
        slug: pkg.slug,
        title: pkg.name, // The client component expects 'title'
        shortDescription: pkg.description,
        coverImage: pkg.galleryImages ? pkg.galleryImages[0] : null,
        durationText: pkg.duration,
        minPrice: minPrice,
        includes: Array.from(includes),
      };
    });

    return NextResponse.json({
      message: "Tour packages retrieved successfully.",
      data: processedTours,
    });
  } catch (error) {
    console.error("Error fetching tour packages:", error);
    return NextResponse.json(
      {
        message: "Failed to retrieve tour packages.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
