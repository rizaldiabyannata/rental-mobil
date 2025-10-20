import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import {
  uploadMultipleFilesToMinio,
  deleteFileFromMinio,
} from "@/lib/minio-upload";
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

    // Optional: delete previously uploaded files by URL
    const removeRaw = formData.get("removeUrls");
    let removed = [];
    if (removeRaw) {
      try {
        const urls = JSON.parse(removeRaw);
        if (Array.isArray(urls) && urls.length) {
          for (const url of urls) {
            if (typeof url === "string" && url) {
              await deleteFileFromMinio(url);
              removed.push(url);
            }
          }
        }
      } catch (e) {
        // ignore parse error
      }
    }

    const imageFiles = formData
      .getAll("images")
      .filter((f) => f && typeof f !== "string");

    let saved = [];
    if (imageFiles.length) {
      saved = await uploadMultipleFilesToMinio(imageFiles, {
        subfolder: "tours",
        maxSizeMB: 5,
      });
    }

    if (!imageFiles.length && removed.length === 0) {
      return NextResponse.json(
        { error: "No images provided and nothing to remove" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tours images processed",
      files: saved, // detail dari MinIO
      urls: saved.map((s) => s.url), // array URL lengkap untuk frontend
      removed,
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
