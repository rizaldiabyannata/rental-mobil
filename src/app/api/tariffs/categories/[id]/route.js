import { NextResponse } from "next/server";
import { withAuth, maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

async function getCategory(_req, props) {
  try {
    const { id } = await props.params;
    const category = await prisma.tariffCategory.findUnique({ where: { id } });
    if (!category)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Get category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function updateCategory(request, props) {
  try {
    const { id } = await props.params;
    const body = await request.json();
    const { name, description, order } = body;

    const exists = await prisma.tariffCategory.findUnique({ where: { id } });
    if (!exists)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const category = await prisma.tariffCategory.update({
      where: { id },
      data: {
        name: name ?? exists.name,
        description:
          description !== undefined ? description : exists.description,
        order: typeof order === "number" ? order : exists.order,
      },
    });
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function deleteCategory(_req, props) {
  try {
    const { id } = await props.params;
    await prisma.tariffCategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = maybeWithAuth(getCategory);
export const PUT = withAuth(updateCategory);
export const DELETE = withAuth(deleteCategory);
