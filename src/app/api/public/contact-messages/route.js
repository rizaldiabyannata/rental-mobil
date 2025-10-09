import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Submit a contact message (public)
export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, phoneNumber, email, subject, message } = body;

    if (!fullName || !phoneNumber || !message) {
      return NextResponse.json(
        { error: "fullName, phoneNumber, and message are required" },
        { status: 400 }
      );
    }

    const item = await prisma.contactMessage.create({
      data: {
        fullName,
        phoneNumber,
        email: email || null,
        subject: subject || null,
        message,
      },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Create contact message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
