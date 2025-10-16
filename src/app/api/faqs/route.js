import { NextResponse } from "next/server";
import { withAuth, maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

// GET - List semua FAQs dengan pagination dan search
async function getFAQs(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { question: { contains: search, mode: "insensitive" } },
            { answer: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [faqs, total] = await Promise.all([
      prisma.fAQ.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
      }),
      prisma.fAQ.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: faqs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get FAQs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create FAQ baru (hanya admin)
async function createFAQ(request) {
  try {
    const { question, answer, order } = await request.json();

    // Validasi input
    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    // Ambil order tertinggi jika order tidak dikirim
    let nextOrder = 0;
    if (order === undefined || order === null || order === "") {
      const maxOrder = await prisma.fAQ.aggregate({
        _max: { order: true },
      });
      nextOrder = (maxOrder._max.order ?? -1) + 1;
    } else {
      nextOrder = parseInt(order);
    }

    // Create FAQ
    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        order: nextOrder,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "FAQ created successfully",
        data: faq,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create FAQ error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = maybeWithAuth(getFAQs);
export const POST = withAuth(createFAQ);
