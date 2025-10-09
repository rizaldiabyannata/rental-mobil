import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

// POST /api/cars/images/reorder
// Body JSON: { carId: string, orders: [{id: string, order: number}] }
async function reorderCarImagesHandler(request) {
  try {
    const { carId, orders } = await request.json();
    if (!carId || !Array.isArray(orders)) {
      return NextResponse.json(
        { error: "carId and orders array required" },
        { status: 400 }
      );
    }

    const imageIds = orders.map((o) => o.id);
    const existing = await prisma.carImage.findMany({
      where: { carId, id: { in: imageIds } },
    });
    const existingIds = new Set(existing.map((e) => e.id));

    const ops = [];
    for (const { id, order } of orders) {
      if (!existingIds.has(id)) continue;
      ops.push(
        prisma.carImage.update({
          where: { id },
          data: { order: Number(order) || 0 },
        })
      );
    }
    await prisma.$transaction(ops);

    const updated = await prisma.carImage.findMany({
      where: { carId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      message: "Reordered",
      data: updated,
    });
  } catch (error) {
    console.error("Reorder car images error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(reorderCarImagesHandler);
