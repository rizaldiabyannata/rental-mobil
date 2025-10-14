import { NextResponse } from "next/server";
import { maybeWithAuth } from "@/lib/auth/middleware";
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
    features: Array.isArray(car.features) ? car.features : [],
    specifications: car.specifications || null,
    createdAt: car.createdAt,
    updatedAt: car.updatedAt,
    _count: car._count || undefined,
    coverImage: car.specifications?.coverImage,
    images: car.images
      ? car.images.map((img) => ({
          id: img.id,
          imageUrl: img.imageUrl,
          alt: img.alt,
          order: img.order,
          createdAt: img.createdAt,
        }))
      : undefined,
    // Back-compat: expose 'tariffs' from TariffItem
    tariffs: car.tariffItems
      ? car.tariffItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          category: item.category?.name || undefined,
          order: typeof item.order === "number" ? item.order : 0,
          createdAt: item.createdAt,
          serviceType: item.serviceType,
          packageType: item.packageType,
          carId: item.carId || null,
        }))
      : undefined,
    featureCards: Array.isArray(car.specifications?.featureCards)
      ? car.specifications.featureCards
      : [],
  };
}

// GET - Detail car by ID
async function getCarById(request, props) {
  try {
    const { params } = await props;
    const { id } = await params;

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        tariffItems: {
          orderBy: { order: "asc" },
          include: { category: true },
        },
        featureBlocks: { orderBy: { order: "asc" } },
        _count: { select: { images: true, tariffItems: true } },
      },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const api = carToApi(car);
    // Add featureBlocks from CarFeature model
    api.featureBlocks = car.featureBlocks
      ? car.featureBlocks.map((fb) => ({
          id: fb.id,
          icon: fb.icon,
          title: fb.title,
          description: fb.description,
          order: fb.order,
        }))
      : [];
    return NextResponse.json({ success: true, data: api });
  } catch (error) {
    console.error("Get car by ID error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update car by ID (hanya admin)
async function updateCar(request, props) {
  try {
    const { params } = await props;
    const { id } = await params;
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
      include: {
        images: { orderBy: { order: "asc" } },
        tariffItems: {
          orderBy: { order: "asc" },
          include: { category: true },
        },
        featureBlocks: { orderBy: { order: "asc" } },
        _count: { select: { images: true, tariffItems: true } },
      },
    });

    const api = carToApi(updatedCar);
    return NextResponse.json({
      success: true,
      message: "Car updated successfully",
      data: api,
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
async function deleteCar(request, props) {
  try {
    const { params } = await props;
    const { id } = await params;

    // Cek apakah car ada
    const existingCar = await prisma.car.findUnique({
      where: { id },
      include: {},
    });

    if (!existingCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
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

export const GET = maybeWithAuth(getCarById);
export const PUT = maybeWithAuth(updateCar);
export const DELETE = maybeWithAuth(deleteCar);
