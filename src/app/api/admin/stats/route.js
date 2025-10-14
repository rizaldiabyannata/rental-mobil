import { NextResponse } from "next/server";
import { maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

async function getStats() {
  try {
    const [
      totalCars,
      availableCars,
      partners,
      faqs,
      activeTerms,
      tariffCategories,
      tariffItems,
    ] = await Promise.all([
      prisma.car.count(),
      prisma.car.count({ where: { available: true } }),
      prisma.partner.count(),
      prisma.fAQ.count(),
      prisma.termsAndConditions.count({ where: { isActive: true } }),
      prisma.tariffCategory.count(),
      prisma.tariffItem.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        cars: {
          total: totalCars,
          available: availableCars,
          unavailable: Math.max(totalCars - availableCars, 0),
        },
        tariffs: {
          categories: tariffCategories,
          items: tariffItems,
        },
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
