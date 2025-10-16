import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List semua FAQs yang aktif untuk publik
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const where = search
      ? {
          OR: [
            { question: { contains: search, mode: "insensitive" } },
            { answer: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const faqs = await prisma.fAQ.findMany({
      where,
      select: {
        question: true,
        answer: true,
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error("Get public FAQs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
