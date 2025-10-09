import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

function carToApi(car) {
  if (!car) return car;
  return {
    id: car.id,
    name: car.name,
    description: car.description,
    startingPrice: car.startingPrice,
    capacity: car.capacity,
    transmission: car.transmission,
    fuelType: car.fuelType,
    available: car.available,
    features: car.features,
    specifications: car.specifications,
    createdAt: car.createdAt,
    updatedAt: car.updatedAt,
    _count: car._count,
  };
}

// GET - Detail car by ID
async function getCarById(request, { params }) {
  try {
    const { id } = params;

    const car = await prisma.car.findUnique({
      where: { id },
      include: { _count: true },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: carToApi(car) });
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
    const body = await request.json();
    const {
      name,
      description,
      startingPrice,
      capacity,
      transmission,
      fuelType,
      available,
      features,
      specifications,
    } = body;

    // Cek apakah car ada
    const existingCar = await prisma.car.findUnique({
      where: { id },
    });

    if (!existingCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Validasi harga jika diubah
    if (startingPrice !== undefined && startingPrice <= 0) {
      return NextResponse.json(
        { error: "startingPrice must be positive" },
        { status: 400 }
      );
    }
    if (features && !Array.isArray(features)) {
      return NextResponse.json(
        { error: "features must be an array of strings" },
        { status: 400 }
      );
    }
    if (features && !features.every((f) => typeof f === "string")) {
      return NextResponse.json(
        { error: "each feature must be string" },
        { status: 400 }
      );
    }

    // Siapkan data update
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (startingPrice !== undefined)
      updateData.startingPrice = parseInt(startingPrice);
    if (capacity !== undefined) updateData.capacity = parseInt(capacity);
    if (transmission !== undefined) updateData.transmission = transmission;
    if (fuelType !== undefined) updateData.fuelType = fuelType;
    if (available !== undefined) updateData.available = available;
    if (features !== undefined) updateData.features = features;
    if (specifications !== undefined)
      updateData.specifications = specifications;

    // Update car
    const updatedCar = await prisma.car.update({
      where: { id },
      data: updateData,
      include: { _count: true },
    });

    return NextResponse.json({
      success: true,
      message: "Car updated successfully",
      data: carToApi(updatedCar),
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
