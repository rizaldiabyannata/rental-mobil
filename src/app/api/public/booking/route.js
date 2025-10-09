import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Create booking form (public endpoint untuk customer)
export async function POST(request) {
  try {
    const {
      carId,
      fullName,
      whatsappNumber,
      rentalStartDate,
      rentalEndDate,
      message,
    } = await request.json();

    // Validasi input
    if (
      !carId ||
      !fullName ||
      !whatsappNumber ||
      !rentalStartDate ||
      !rentalEndDate
    ) {
      return NextResponse.json(
        {
          error:
            "CarId, fullName, whatsappNumber, rentalStartDate, and rentalEndDate are required",
        },
        { status: 400 }
      );
    }

    // Validasi tanggal
    const startDate = new Date(rentalStartDate);
    const endDate = new Date(rentalEndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return NextResponse.json(
        { error: "Rental start date cannot be in the past" },
        { status: 400 }
      );
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: "Rental end date must be after start date" },
        { status: 400 }
      );
    }

    // Cek apakah car ada dan tersedia
    const car = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    if (!car.isAvailable) {
      return NextResponse.json(
        { error: "Car is not available" },
        { status: 400 }
      );
    }

    // Hitung total hari dan harga
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalPrice = daysDiff * car.pricePerDay;

    // Create booking form
    const bookingForm = await prisma.carBookingForm.create({
      data: {
        carId,
        fullName,
        whatsappNumber,
        rentalStartDate: startDate,
        rentalEndDate: endDate,
        message,
        totalPrice,
        status: "PENDING",
      },
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

    return NextResponse.json(
      {
        success: true,
        message: "Booking form submitted successfully",
        data: bookingForm,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create booking form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
