import { NextResponse } from "next/server";
import { maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

async function getTariff(_req, props) {
  try {
    const { params } = await props;
    const { id } = params;
    const item = await prisma.carTariff.findUnique({ where: { id } });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Get car tariff error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function updateTariff(request, props) {
  try {
    const { params } = await props;
    const { id } = params;
    const body = await request.json();
    const { name, price, description, category, order } = body;

    const exists = await prisma.carTariff.findUnique({ where: { id } });
    if (!exists)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const item = await prisma.carTariff.update({
      where: { id },
      data: {
        name: name ?? exists.name,
        price: price !== undefined ? parseInt(price) : exists.price,
        description:
          description !== undefined ? description : exists.description,
        category: category !== undefined ? category : exists.category,
        order:
          order !== undefined
            ? typeof order === "number"
              ? order
              : exists.order
            : exists.order,
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Update car tariff error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function deleteTariff(_req, props) {
  try {
    const { params } = await props;
    const { id } = params;
    await prisma.carTariff.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("Delete car tariff error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = maybeWithAuth(getTariff);
export const PUT = maybeWithAuth(updateTariff);
export const DELETE = maybeWithAuth(deleteTariff);
