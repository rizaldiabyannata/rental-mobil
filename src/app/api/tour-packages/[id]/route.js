import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

async function getById(_req, { params }) {
  try {
    const { id } = params;
    const item = await prisma.tourPackage.findUnique({ where: { id } });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Get tour package error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function updateById(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, imageUrl, itinerary, price, duration } = body;
    const exists = await prisma.tourPackage.findUnique({ where: { id } });
    if (!exists)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const item = await prisma.tourPackage.update({
      where: { id },
      data: {
        name: name ?? exists.name,
        description: description ?? exists.description,
        imageUrl: imageUrl !== undefined ? imageUrl : exists.imageUrl,
        itinerary: itinerary !== undefined ? itinerary : exists.itinerary,
        price: price !== undefined ? parseInt(price) : exists.price,
        duration: duration !== undefined ? duration : exists.duration,
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Update tour package error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function deleteById(_req, { params }) {
  try {
    const { id } = params;
    await prisma.tourPackage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("Delete tour package error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getById);
export const PUT = withAuth(updateById);
export const DELETE = withAuth(deleteById);
