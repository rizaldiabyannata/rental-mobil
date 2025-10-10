import { NextResponse } from "next/server";
import { maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

// GET - Detail Terms & Conditions by ID
async function getTermsAndConditionsById(request, props) {
  try {
    const { params } = await props;
    const { id } = params;

    const terms = await prisma.termsAndConditions.findUnique({
      where: { id },
    });

    if (!terms) {
      return NextResponse.json(
        { error: "Terms & Conditions not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: terms,
    });
  } catch (error) {
    console.error("Get Terms & Conditions by ID error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update Terms & Conditions by ID (hanya admin)
async function updateTermsAndConditions(request, props) {
  try {
    const { params } = await props;
    const { id } = params;
    const { category, title, content, order, isActive } = await request.json();

    // Cek apakah Terms & Conditions ada
    const existingTerms = await prisma.termsAndConditions.findUnique({
      where: { id },
    });

    if (!existingTerms) {
      return NextResponse.json(
        { error: "Terms & Conditions not found" },
        { status: 404 }
      );
    }

    // Siapkan data update
    const updateData = {};
    if (category) updateData.category = category;
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (order !== undefined) updateData.order = parseInt(order);
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update Terms & Conditions
    const updatedTerms = await prisma.termsAndConditions.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Terms & Conditions updated successfully",
      data: updatedTerms,
    });
  } catch (error) {
    console.error("Update Terms & Conditions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus Terms & Conditions by ID (hanya admin)
async function deleteTermsAndConditions(request, props) {
  try {
    const { params } = await props;
    const { id } = params;

    // Cek apakah Terms & Conditions ada
    const existingTerms = await prisma.termsAndConditions.findUnique({
      where: { id },
    });

    if (!existingTerms) {
      return NextResponse.json(
        { error: "Terms & Conditions not found" },
        { status: 404 }
      );
    }

    // Hapus Terms & Conditions
    await prisma.termsAndConditions.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Terms & Conditions deleted successfully",
    });
  } catch (error) {
    console.error("Delete Terms & Conditions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = maybeWithAuth(getTermsAndConditionsById);
export const PUT = maybeWithAuth(updateTermsAndConditions);
export const DELETE = maybeWithAuth(deleteTermsAndConditions);
