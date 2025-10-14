import { NextResponse } from "next/server";
import { maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

// GET - list categories with items (optional search, optional carId) with pagination
async function listTariffs(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const carId = searchParams.get("carId") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = Math.min(parseInt(searchParams.get("limit")) || 10, 100);
    const skip = (page - 1) * limit;

    const where = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    let [categories, total] = await Promise.all([
      prisma.tariffCategory.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        include: {
          items: carId
            ? {
                where: { OR: [{ carId }, { carId: null }] },
                orderBy: [{ order: "asc" }, { name: "asc" }],
              }
            : { orderBy: [{ order: "asc" }, { name: "asc" }] },
        },
      }),
      prisma.tariffCategory.count({ where }),
    ]);
    // If carId specified, prefer per-car items (carId match) when present; otherwise use general items (carId null)
    if (carId) {
      categories = categories.map((cat) => {
        const hasOverrides = (cat.items || []).some((it) => it.carId === carId);
        const filtered = hasOverrides
          ? cat.items.filter((it) => it.carId === carId)
          : cat.items.filter((it) => it.carId === null);
        return { ...cat, items: filtered };
      });
    }

    return NextResponse.json({
      success: true,
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List tariffs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - create a category
async function createCategory(request) {
  try {
    const body = await request.json();
    const { name, description, order } = body;
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    const category = await prisma.tariffCategory.create({
      data: {
        name,
        description: description || null,
        order: typeof order === "number" ? order : 0,
      },
    });
    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = maybeWithAuth(listTariffs);
export const POST = maybeWithAuth(createCategory);
