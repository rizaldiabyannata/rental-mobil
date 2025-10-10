import { NextResponse } from "next/server";
import { maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";
import {
  saveImageFile,
  saveMultipleImages,
  deleteUploadedFile,
} from "@/lib/upload";
import { uploadRateLimiter } from "@/lib/rateLimit";

// POST /api/cars/images/upload
// Accepts multipart/form-data
// Fields:
// - carId (required)
// - cover (optional single file) OR coverUrl previously saved
// - images (multiple)
// - removeImageIds (optional JSON array of CarImage IDs to delete)
// - alt_<index> for alt text of uploaded images
async function uploadCarImagesHandler(request) {
  // Rate limit
  const rl = uploadRateLimiter(request);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded", retryAfter: rl.retryAfter },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const carId = formData.get("carId");
    if (!carId) {
      return NextResponse.json({ error: "carId required" }, { status: 400 });
    }

    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Handle new images
    const imageFiles = formData
      .getAll("images")
      .filter((f) => f && typeof f !== "string");
    const savedImages = await saveMultipleImages(imageFiles, {
      subfolder: "cars",
      maxSizeMB: 5,
    });

    // Persist new images
    const createdImages = [];
    for (let i = 0; i < savedImages.length; i++) {
      const saved = savedImages[i];
      const alt = formData.get(`alt_${i}`) || null;
      const img = await prisma.carImage.create({
        data: {
          carId,
          imageUrl: saved.path,
          alt,
          order: 0, // will reorder later
        },
      });
      createdImages.push(img);
    }

    // Handle cover image if provided
    let coverFile = formData.get("cover");
    let coverResult;
    if (coverFile && typeof coverFile !== "string") {
      coverResult = await saveImageFile(coverFile, {
        subfolder: "cars",
        maxSizeMB: 5,
      });
      // Optionally: store a coverUrl inside Car specifications JSON or add a field (not present now)
      // We'll store inside specifications JSON under key coverImage
      const specs = car.specifications || {};
      // Cleanup previous cover if there is one stored in specs.coverImage
      if (specs.coverImage && specs.coverImage.startsWith("/uploads/")) {
        deleteUploadedFile(specs.coverImage);
      }
      specs.coverImage = coverResult.path;
      await prisma.car.update({
        where: { id: carId },
        data: { specifications: specs },
      });
    }

    // Remove images if requested
    const removeRaw = formData.get("removeImageIds");
    if (removeRaw) {
      let ids = [];
      try {
        ids = JSON.parse(removeRaw);
      } catch (e) {
        // ignore parse error
      }
      if (Array.isArray(ids) && ids.length) {
        const existing = await prisma.carImage.findMany({
          where: { id: { in: ids }, carId },
        });
        for (const img of existing) {
          if (img.imageUrl) deleteUploadedFile(img.imageUrl);
        }
        await prisma.carImage.deleteMany({ where: { id: { in: ids }, carId } });
      }
    }

    // Reorder images if provided: orderMapping = JSON string of {imageId: orderNumber}
    const orderMappingRaw = formData.get("orderMapping");
    if (orderMappingRaw) {
      try {
        const mapping = JSON.parse(orderMappingRaw);
        const updates = Object.entries(mapping).map(([id, order]) =>
          prisma.carImage.update({
            where: { id },
            data: { order: Number(order) || 0 },
          })
        );
        await Promise.all(updates);
      } catch (e) {
        // ignore
      }
    }

    // Return updated list
    const allImages = await prisma.carImage.findMany({
      where: { carId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      message: "Images processed",
      data: {
        coverImage: coverResult?.path || car.specifications?.coverImage || null,
        newImages: createdImages,
        images: allImages,
      },
      rateLimit: { remaining: rl.remaining },
    });
  } catch (error) {
    console.error("Upload car images error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = maybeWithAuth(uploadCarImagesHandler);
