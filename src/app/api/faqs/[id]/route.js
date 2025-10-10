import { NextResponse } from "next/server";
import { maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

// GET - Detail FAQ by ID
async function getFAQById(request, props) {
  try {
    const { params } = await props;
    const { id } = params;

    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("Get FAQ by ID error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update FAQ by ID (hanya admin)
async function updateFAQ(request, props) {
  try {
    const { params } = await props;
    const { id } = params;
    const { question, answer, order } = await request.json();

    // Cek apakah FAQ ada
    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!existingFAQ) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    // Siapkan data update
    const updateData = {};
    if (question) updateData.question = question;
    if (answer) updateData.answer = answer;
    if (order !== undefined) updateData.order = parseInt(order);

    // Update FAQ
    const updatedFAQ = await prisma.fAQ.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "FAQ updated successfully",
      data: updatedFAQ,
    });
  } catch (error) {
    console.error("Update FAQ error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus FAQ by ID (hanya admin)
async function deleteFAQ(request, props) {
  try {
    const { params } = await props;
    const { id } = params;

    // Cek apakah FAQ ada
    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!existingFAQ) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    // Hapus FAQ
    await prisma.fAQ.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.error("Delete FAQ error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = maybeWithAuth(getFAQById);
export const PUT = maybeWithAuth(updateFAQ);
export const DELETE = maybeWithAuth(deleteFAQ);
