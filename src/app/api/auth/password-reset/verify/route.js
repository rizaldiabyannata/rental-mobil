import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp)
      return NextResponse.json(
        { error: "email and otp required" },
        { status: 400 }
      );

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    const reqItem = await prisma.passwordResetRequest.findFirst({
      where: { userId: user.id, consumed: false },
      orderBy: { createdAt: "desc" },
    });
    if (!reqItem)
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    if (reqItem.expiresAt < new Date())
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });

    const isMatch = reqItem.otp === String(otp).trim();
    const attempts = reqItem.attempts + 1;
    await prisma.passwordResetRequest.update({
      where: { id: reqItem.id },
      data: { attempts, verified: isMatch },
    });
    if (!isMatch)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    // Create a short-lived token (15m) to authorize password reset
    const token = jwt.sign(
      { sub: user.id, purpose: "password-reset" },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("password reset verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
