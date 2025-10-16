import { NextResponse } from "next/server";
import { withAuth, maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

// GET items by categoryId (optional carId)
async function listItems(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const carId = searchParams.get("carId") || "";
    if (!categoryId) {
      return NextResponse.json(
        { error: "categoryId is required" },
        { status: 400 }
      );
    }
    const where = carId
      ? { categoryId, OR: [{ carId }, { carId: null }] }
      : { categoryId };
    const items = await prisma.tariffItem.findMany({
      where,
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("List items error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create item (optional carId)
async function createItem(request) {
  try {
    const body = await request.json();
    const { categoryId, name, price, order, carId, serviceType, packageType } =
      body;
    if (!categoryId || !name || price === undefined) {
      return NextResponse.json(
        { error: "categoryId, name and price are required" },
        { status: 400 }
      );
    }
    const item = await prisma.tariffItem.create({
      data: {
        categoryId,
        name,
        price: parseInt(price),
        // season removed
        carId: carId || null,
        serviceType: serviceType || null,
        packageType: packageType || null,
        order: typeof order === "number" ? order : 0,
      },
    });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Create item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = maybeWithAuth(listItems);
export const POST = withAuth(createItem);
