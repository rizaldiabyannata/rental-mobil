import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

// GET - Detail car by ID
async function getCarById(request, { params }) {
  try {
    const { id } = params;

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            carBookingForms: true,
          },
        },
      },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: car,
    });
  } catch (error) {
    console.error("Get car by ID error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update car by ID (hanya admin)
async function updateCar(request, { params }) {
  try {
    const { id } = params;
    const {
      name,
      brand,
      model,
      year,
      pricePerDay,
      description,
      imageUrl,
      capacity,
      transmission,
      fuelType,
      isAvailable,
    } = await request.json();

    // Cek apakah car ada
    const existingCar = await prisma.car.findUnique({
      where: { id },
    });

    if (!existingCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Validasi harga jika diubah
    if (pricePerDay && pricePerDay <= 0) {
      return NextResponse.json(
        { error: "Price per day must be positive" },
        { status: 400 }
      );
    }

    // Siapkan data update
    const updateData = {};
    if (name) updateData.name = name;
    if (brand) updateData.brand = brand;
    if (model) updateData.model = model;
    if (year) updateData.year = parseInt(year);
    if (pricePerDay) updateData.pricePerDay = parseInt(pricePerDay);
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (capacity) updateData.capacity = parseInt(capacity);
    if (transmission) updateData.transmission = transmission;
    if (fuelType) updateData.fuelType = fuelType;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

    // Update car
    const updatedCar = await prisma.car.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Car updated successfully",
      data: updatedCar,
    });
  } catch (error) {
    console.error("Update car error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus car by ID (hanya admin)
async function deleteCar(request, { params }) {
  try {
    const { id } = params;

    // Cek apakah car ada
    const existingCar = await prisma.car.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            carBookingForms: true,
          },
        },
      },
    });

    if (!existingCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Cek apakah ada booking form yang terkait
    if (existingCar._count.carBookingForms > 0) {
      return NextResponse.json(
        { error: "Cannot delete car with existing booking forms" },
        { status: 400 }
      );
    }

    // Hapus car
    await prisma.car.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.error("Delete car error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getCarById);
export const PUT = withAuth(updateCar);
export const DELETE = withAuth(deleteCar);
