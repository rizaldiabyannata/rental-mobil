import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { saveMultipleImages } from "@/lib/upload";
import { uploadRateLimiter } from "@/lib/rateLimit";

// POST /api/tours/images/upload
// Accepts multipart/form-data
// Fields:
// - images (multiple)
// Returns: { success, files: [...], urls: [string] }
async function uploadTourImagesHandler(request) {
  const rl = uploadRateLimiter(request);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded", retryAfter: rl.retryAfter },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const imageFiles = formData
      .getAll("images")
      .filter((f) => f && typeof f !== "string");
    if (!imageFiles.length) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    const saved = await saveMultipleImages(imageFiles, {
      subfolder: "tours",
      maxSizeMB: 5,
    });

    return NextResponse.json({
      success: true,
      files: saved,
      urls: saved.map((s) => s.path),
      rateLimit: { remaining: rl.remaining },
    });
  } catch (error) {
    console.error("Upload tour images error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(uploadTourImagesHandler);
