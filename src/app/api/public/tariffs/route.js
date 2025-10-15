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

    // Fetch categories dengan items
    const categories = await prisma.tariffCategory.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      include: {
        items: {
          where,
          orderBy: [{ order: "asc" }, { name: "asc" }],
          include: {
            car: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    // Filter out categories dengan items kosong
    const filteredCategories = categories
      .filter((cat) => cat.items.length > 0)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        order: cat.order,
        items: cat.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          serviceType: item.serviceType,
          packageType: item.packageType,
          order: item.order,
          car: item.car
            ? {
                id: item.car.id,
                name: item.car.name,
                slug: item.car.slug,
              }
            : null,
        })),
      }));

    // Group data by serviceType untuk frontend
    const groupedByService = {};
    filteredCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        const service = item.serviceType || "Umum";
        if (!groupedByService[service]) {
          groupedByService[service] = [];
        }
        groupedByService[service].push({
          ...item,
          category: cat.name,
          categoryId: cat.id,
        });
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        categories: filteredCategories,
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
