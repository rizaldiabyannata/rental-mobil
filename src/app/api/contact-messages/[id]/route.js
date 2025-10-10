import { NextResponse } from "next/server";
import { maybeWithAuth } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

async function getById(_req, props) {
  try {
    const { params } = await props;
    const { id } = params;
    const item = await prisma.contactMessage.findUnique({ where: { id } });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Get contact message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function updateById(request, props) {
  try {
    const { params } = await props;
    const { id } = params;
    const body = await request.json();
    const { status, fullName, phoneNumber, email, subject, message } = body;

    const exists = await prisma.contactMessage.findUnique({ where: { id } });
    if (!exists)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const item = await prisma.contactMessage.update({
      where: { id },
      data: {
        status: status ?? exists.status,
        fullName: fullName ?? exists.fullName,
        phoneNumber: phoneNumber ?? exists.phoneNumber,
        email: email !== undefined ? email : exists.email,
        subject: subject !== undefined ? subject : exists.subject,
        message: message ?? exists.message,
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Update contact message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function deleteById(_req, props) {
  try {
    const { params } = await props;
    const { id } = params;
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === "P2025")
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("Delete contact message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = maybeWithAuth(getById);
export const PUT = maybeWithAuth(updateById);
export const DELETE = maybeWithAuth(deleteById);
