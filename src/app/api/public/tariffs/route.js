import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Public endpoint untuk tariff dengan grouping berdasarkan serviceType dan carId
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get("serviceType") || "";
    const carId = searchParams.get("carId") || "";

    // Build where filter untuk TariffItem
    let where = {};
    if (serviceType) {
      where.serviceType = { contains: serviceType, mode: "insensitive" };
    }
    if (carId) {
      where.OR = [{ carId }, { carId: null }];
    }

    // Langsung query TariffItem dengan select yang efisien
    const tariffItems = await prisma.tariffItem.findMany({
      where,
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: {
        name: true,
        price: true,
        serviceType: true,
        packageType: true,
        car: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    // Group data by serviceType untuk frontend, sama seperti sebelumnya
    const groupedByService = {};
    tariffItems.forEach((item) => {
      const service = item.serviceType || "Umum";
      if (!groupedByService[service]) {
        groupedByService[service] = [];
      }
      // Bentuk objek yang dibutuhkan frontend
      groupedByService[service].push({
        name: item.name,
        price: item.price,
        packageType: item.packageType,
        car: item.car ? { name: item.car.name } : null,
        category: item.category.name,
      });
    });

    return NextResponse.json({
      success: true,
      // Hanya kirim data yang dibutuhkan klien
      data: {
        groupedByService,
      },
    });
  } catch (error) {
    console.error("Get public tariffs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
