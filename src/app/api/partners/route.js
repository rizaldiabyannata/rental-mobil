// POST - Create partner (order otomatis)
async function createPartner(request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const logo = formData.get("logo");

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Cari order maksimum
    const maxOrder = await prisma.partner.aggregate({ _max: { order: true } });
    const nextOrder =
      typeof maxOrder._max.order === "number" ? maxOrder._max.order + 1 : 1;

    // Simpan logo jika ada
    let logoUrl = "";
    if (logo && logo.size > 0) {
      // Simpan file logo ke public/uploads/partners/ (implementasi upload disesuaikan)
      // ...implementasi upload logo...
      // logoUrl = hasil upload
    }

    const partner = await prisma.partner.create({
      data: {
        name,
        logoUrl,
        order: nextOrder,
      },
    });

    return NextResponse.json({ success: true, data: partner }, { status: 201 });
  } catch (error) {
    console.error("Create partner error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = maybeWithAuth(createPartner);
import { NextResponse } from "next/server";
import { maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

// GET - List partners
async function getPartners(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const [partners, total] = await Promise.all([
      prisma.partner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
      }),
      prisma.partner.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: partners,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get partners error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = maybeWithAuth(getPartners);
