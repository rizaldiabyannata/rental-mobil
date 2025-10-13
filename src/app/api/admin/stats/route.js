import { NextResponse } from "next/server";
import { maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

async function getStats() {
  try {
    const [
      totalCars,
      availableCars,
      tourPackages,
      partners,
      faqs,
      activeTerms,
    ] = await Promise.all([
      prisma.car.count(),
      prisma.car.count({ where: { available: true } }),
      prisma.tourPackage.count(),
      prisma.partner.count(),
      prisma.fAQ.count(),
      prisma.termsAndConditions.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        cars: {
          total: totalCars,
          available: availableCars,
          unavailable: Math.max(totalCars - availableCars, 0),
        },
        tourPackages: { total: tourPackages },
        partners: { total: partners },
        faqs: { total: faqs },
        terms: { active: activeTerms },
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = maybeWithAuth(getStats);
