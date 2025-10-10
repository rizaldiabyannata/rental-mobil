import { NextResponse } from "next/server";
import { maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

// GET - Get semua kategori Terms & Conditions yang unik
async function getTermsCategories(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeCount = searchParams.get("includeCount") === "true";

    if (includeCount) {
      // Get categories dengan jumlah terms
      const categoriesWithCount = await prisma.termsAndConditions.groupBy({
        by: ["category"],
        _count: {
          category: true,
        },
        orderBy: {
          category: "asc",
        },
      });

      const categories = categoriesWithCount.map((item) => ({
        category: item.category,
        count: item._count.category,
      }));

      return NextResponse.json({
        success: true,
        data: categories,
      });
    } else {
      // Get categories saja
      const categories = await prisma.termsAndConditions.findMany({
        select: { category: true },
        distinct: ["category"],
        orderBy: { category: "asc" },
      });

      return NextResponse.json({
        success: true,
        data: categories.map((c) => c.category),
      });
    }
  } catch (error) {
    console.error("Get Terms categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = maybeWithAuth(getTermsCategories);
