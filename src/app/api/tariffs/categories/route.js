import { NextResponse } from "next/server";
import { withAuth, maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

async function listCategories() {
  try {
    const categories = await prisma.tariffCategory.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("List categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function createCategory(request) {
  try {
    const body = await request.json();
    const { name, description, order } = body;
    if (!name)
      return NextResponse.json({ error: "name is required" }, { status: 400 });
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

export const GET = maybeWithAuth(listCategories);
export const POST = withAuth(createCategory);
