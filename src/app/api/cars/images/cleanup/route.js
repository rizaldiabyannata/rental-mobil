import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";
import { listUploadedFiles, deleteUploadedFile } from "@/lib/upload";

// POST /api/cars/images/cleanup
// Finds orphan files in /uploads/cars that are not referenced in CarImage or as coverImage in car.specifications
async function cleanupCarImagesHandler() {
  try {
    const dbImages = await prisma.carImage.findMany({
      select: { imageUrl: true },
    });
    const carSpecs = await prisma.car.findMany({
      select: { specifications: true },
    });

    const referenced = new Set();
    for (const img of dbImages) {
      if (img.imageUrl) referenced.add(img.imageUrl);
    }
    for (const car of carSpecs) {
      const cover = car.specifications?.coverImage;
      if (cover) referenced.add(cover);
    }

    const allFiles = await listUploadedFiles("cars");

    const orphan = allFiles.filter((f) => !referenced.has(f));

    for (const file of orphan) {
      await deleteUploadedFile(file);
    }

    return NextResponse.json({
      success: true,
      deleted: orphan.length,
      files: orphan,
    });
  } catch (error) {
    console.error("Cleanup car images error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(cleanupCarImagesHandler);
