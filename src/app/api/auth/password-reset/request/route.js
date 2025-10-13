import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpMail } from "@/lib/mailer";

function generateOtp(length = 6) {
  const digits = "0123456789";
  let out = "";
  for (let i = 0; i < length; i++)
    out += digits[Math.floor(Math.random() * 10)];
  return out;
}

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email)
      return NextResponse.json({ error: "email required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // avoid leaking user existence
      return NextResponse.json({
        success: true,
        message: "If the email exists, an OTP has been sent",
      });
    }

    const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // invalidate previous pending requests
    await prisma.passwordResetRequest.updateMany({
      where: { userId: user.id, consumed: false },
      data: { consumed: true },
    });

    await prisma.passwordResetRequest.create({
      data: { userId: user.id, otp, expiresAt },
    });

    await sendOtpMail({ to: email, otp });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("password reset request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
