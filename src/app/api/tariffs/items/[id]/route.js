import { NextResponse } from "next/server";
import { maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

async function getItem(_req, props) {
  try {
    const { params } = await props;
    const { id } = params;
    const item = await prisma.tariffItem.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Get tariff item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function updateItem(request, props) {
  try {
    const { params } = await props;
    const { id } = params;
    const body = await request.json();
    const { name, price, order, serviceType, packageType, categoryId, carId } = body;

    const exists = await prisma.tariffItem.findUnique({ where: { id } });
    if (!exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.tariffItem.update({
      where: { id },
      data: {
        name: name ?? exists.name,
        price: price !== undefined ? parseInt(price) : exists.price,
        order: typeof order === "number" ? order : exists.order,
        serviceType: serviceType === undefined ? exists.serviceType : serviceType,
        packageType: packageType === undefined ? exists.packageType : packageType,
        categoryId: categoryId ?? exists.categoryId,
        carId: carId === undefined ? exists.carId : carId || null,
      },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update tariff item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function deleteItem(_req, props) {
  try {
    const { params } = await props;
    const { id } = params;
    await prisma.tariffItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("Delete tariff item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const GET = maybeWithAuth(getItem);
export const PUT = maybeWithAuth(updateItem);
export const DELETE = maybeWithAuth(deleteItem);
