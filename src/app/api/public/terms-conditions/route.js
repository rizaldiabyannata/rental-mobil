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

    // Frontend hanya butuh flat list of terms, jadi kita sederhanakan query
    const terms = await prisma.termsAndConditions.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        order: true,
      },
      orderBy: [{ order: "asc" }], // Urutkan berdasarkan order saja
    });

    return NextResponse.json({
      success: true,
      // Langsung kembalikan array of terms
      data: terms,
    });
  } catch (error) {
    console.error("Get public Terms & Conditions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
