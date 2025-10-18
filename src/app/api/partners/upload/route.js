import { NextResponse } from "next/server";
import { withAuth, maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";
import { uploadFileToMinio } from "@/lib/minio-upload";

// POST - Upload partner logo & create partner
async function uploadPartner(request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name");
    const order = formData.get("order") ? parseInt(formData.get("order")) : 0;
    const file = formData.get("logo");

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Logo file is required" },
        { status: 400 }
      );
    }

    // Upload file to MinIO
    const stored = await uploadFileToMinio(file, {
      subfolder: "partners",
      maxSizeMB: 3,
    });

    // Create partner with MinIO URL
    const partner = await prisma.partner.create({
      data: {
        name,
        logoUrl: stored.url, // Simpan URL lengkap dari MinIO
        order,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Partner created successfully",
        data: partner,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload partner error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(uploadPartner);
