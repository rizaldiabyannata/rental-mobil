import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List semua Terms & Conditions yang aktif untuk publik
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search") || "";

    let where = { isActive: true };

    // Filter berdasarkan kategori
    if (category) {
      where.category = { contains: category, mode: "insensitive" };
    }

    // Filter berdasarkan pencarian
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get semua kategori yang aktif
    const categories = await prisma.termsAndConditions.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    // Get terms berdasarkan filter
    const terms = await prisma.termsAndConditions.findMany({
      where,
      select: {
        id: true,
        category: true,
        title: true,
        content: true,
        order: true,
      },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });

    // Group terms by category
    const groupedTerms = terms.reduce((acc, term) => {
      if (!acc[term.category]) {
        acc[term.category] = [];
      }
      acc[term.category].push(term);
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        categories: categories.map((c) => c.category),
        terms: groupedTerms,
        allTerms: terms,
      },
    });
  } catch (error) {
    console.error("Get public Terms & Conditions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
