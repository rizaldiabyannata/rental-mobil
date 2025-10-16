import { NextResponse } from "next/server";
import { withAuth, maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";
import { saveImageFile, deleteUploadedFile } from "@/lib/upload";

// GET - Detail partner
async function getPartner(request, props) {
  try {
    const { params } = await props;
    const { id } = params;
    const partner = await prisma.partner.findUnique({ where: { id } });
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: partner });
  } catch (error) {
    console.error("Get partner error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update partner (name, order, optional new logo)
async function updatePartner(request, props) {
  try {
    const { params } = await props;
    const { id } = params;

    const existing = await prisma.partner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") || "";

    let name;
    let order;
    let newLogoFile;
    let updateData = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      name = formData.get("name") || undefined;
      order = formData.get("order")
        ? parseInt(formData.get("order"))
        : undefined;
      newLogoFile = formData.get("logo");

      if (name) updateData.name = name;
      if (order !== undefined) updateData.order = order;

      if (newLogoFile && typeof newLogoFile !== "string") {
        // Upload new logo
        const stored = await saveImageFile(newLogoFile, {
          subfolder: "partners",
          maxSizeMB: 3,
        });
        updateData.logoUrl = stored.path;
        // Delete old logo asynchronously
        if (existing.logoUrl) {
          deleteUploadedFile(existing.logoUrl);
        }
      }
    } else {
      // Assume JSON
      const body = await request.json();
      if (body.name) updateData.name = body.name;
      if (body.order !== undefined) updateData.order = parseInt(body.order);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No update fields provided" },
        { status: 400 }
      );
    }

    const updated = await prisma.partner.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Partner updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update partner error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus partner
async function deletePartner(request, props) {
  try {
    const { params } = await props;
    const { id } = params;

    const existing = await prisma.partner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    await prisma.partner.delete({ where: { id } });

    if (existing.logoUrl) {
      deleteUploadedFile(existing.logoUrl);
    }

    return NextResponse.json({
      success: true,
      message: "Partner deleted successfully",
    });
  } catch (error) {
    console.error("Delete partner error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = maybeWithAuth(getPartner);
export const PUT = withAuth(updatePartner);
export const DELETE = withAuth(deletePartner);
