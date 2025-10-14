import { NextResponse } from "next/server";
import { maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

// GET: list features for a car, ordered by `order`
async function listFeatures(request, props) {
  try {
    const { params } = await props;
    const { id } = await params;

    const car = await prisma.car.findUnique({ where: { id } });
    if (!car)
      return NextResponse.json({ error: "Car not found" }, { status: 404 });

    const features = await prisma.carFeature.findMany({
      where: { carId: id },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ success: true, data: features });
  } catch (err) {
    console.error("List features error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: replace all features for a car (enforces even count)
async function replaceFeatures(request, props) {
  try {
    const { params } = await props;
    const { id } = await params;
    const body = await request.json();
    const items = Array.isArray(body) ? body : body?.items;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Body must be an array of features or {items: [...]}." },
        { status: 400 }
      );
    }
    if (items.length % 2 !== 0) {
      return NextResponse.json(
        { error: "Jumlah fitur harus genap." },
        { status: 400 }
      );
    }

    // Basic validation
    for (const it of items) {
      if (!it || typeof it !== "object")
        return NextResponse.json(
          { error: "Invalid feature item." },
          { status: 400 }
        );
      if (!it.icon || !it.title || !it.description)
        return NextResponse.json(
          { error: "icon, title, dan description wajib diisi." },
          { status: 400 }
        );
    }

    const car = await prisma.car.findUnique({ where: { id } });
    if (!car)
      return NextResponse.json({ error: "Car not found" }, { status: 404 });

    const result = await prisma.$transaction(async (tx) => {
      await tx.carFeature.deleteMany({ where: { carId: id } });
      if (items.length === 0) return [];
      const toCreate = items.map((it, idx) => ({
        carId: id,
        icon: String(it.icon),
        title: String(it.title),
        description: String(it.description),
        order: typeof it.order === "number" ? it.order : idx,
      }));
      await tx.carFeature.createMany({ data: toCreate });
      return tx.carFeature.findMany({
        where: { carId: id },
        orderBy: { order: "asc" },
      });
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("Replace features error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = maybeWithAuth(listFeatures);
export const PUT = maybeWithAuth(replaceFeatures);
