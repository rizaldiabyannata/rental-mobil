import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

// GET - Detail car booking form by ID
async function getCarBookingFormById(request, { params }) {
  try {
    const { id } = params;

    const form = await prisma.carBookingForm.findUnique({
      where: { id },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            model: true,
            pricePerDay: true,
          },
        },
      },
    });

    if (!form) {
      return NextResponse.json(
        { error: "Car booking form not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: form,
    });
  } catch (error) {
    console.error("Get car booking form by ID error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update status car booking form
async function updateCarBookingForm(request, { params }) {
  try {
    const { id } = params;
    const { status, notes } = await request.json();

    // Validasi status
    const validStatuses = ["PENDING", "CONTACTED", "CONFIRMED", "CANCELLED"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Cek apakah form ada
    const existingForm = await prisma.carBookingForm.findUnique({
      where: { id },
    });

    if (!existingForm) {
      return NextResponse.json(
        { error: "Car booking form not found" },
        { status: 404 }
      );
    }

    // Update form
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updatedForm = await prisma.carBookingForm.update({
      where: { id },
      data: updateData,
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            model: true,
            pricePerDay: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Car booking form updated successfully",
      data: updatedForm,
    });
  } catch (error) {
    console.error("Update car booking form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus car booking form
async function deleteCarBookingForm(request, { params }) {
  try {
    const { id } = params;

    // Cek apakah form ada
    const existingForm = await prisma.carBookingForm.findUnique({
      where: { id },
    });

    if (!existingForm) {
      return NextResponse.json(
        { error: "Car booking form not found" },
        { status: 404 }
      );
    }

    // Hapus form
    await prisma.carBookingForm.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Car booking form deleted successfully",
    });
  } catch (error) {
    console.error("Delete car booking form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getCarBookingFormById);
export const PUT = withAuth(updateCarBookingForm);
export const DELETE = withAuth(deleteCarBookingForm);
