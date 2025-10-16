import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List public partners (mitra)
export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      where: {},
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        order: true,
      },
    });
    return NextResponse.json({ success: true, data: partners });
  } catch (error) {
    console.error("Get public partners error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
