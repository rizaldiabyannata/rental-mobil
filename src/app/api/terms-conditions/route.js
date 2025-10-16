import { NextResponse } from "next/server";
import { withAuth, maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

// GET - List semua Terms & Conditions dengan pagination dan filter
async function getTermsAndConditions(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    let where = {};

    // Filter berdasarkan kategori
    if (category) {
      where.category = { contains: category, mode: "insensitive" };
    }

    // Filter berdasarkan status aktif
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    // Filter berdasarkan pencarian
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    const [terms, total] = await Promise.all([
      prisma.termsAndConditions.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ category: "asc" }, { order: "asc" }],
      }),
      prisma.termsAndConditions.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: terms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Terms & Conditions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create Terms & Conditions baru (hanya admin)
async function createTermsAndConditions(request) {
  try {
    const { category, title, content, isActive = true } = await request.json();

    // Validasi input
    if (!category || !title || !content) {
      return NextResponse.json(
        { error: "Category, title, and content are required" },
        { status: 400 }
      );
    }

    // Cari order maksimum
    const maxOrder = await prisma.termsAndConditions.aggregate({
      _max: { order: true },
    });
    const nextOrder =
      typeof maxOrder._max.order === "number" ? maxOrder._max.order + 1 : 1;

    // Create Terms & Conditions dengan order otomatis
    const terms = await prisma.termsAndConditions.create({
      data: {
        category,
        title,
        content,
        order: nextOrder,
        isActive,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Terms & Conditions created successfully",
        data: terms,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Terms & Conditions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = maybeWithAuth(getTermsAndConditions);
export const POST = withAuth(createTermsAndConditions);
