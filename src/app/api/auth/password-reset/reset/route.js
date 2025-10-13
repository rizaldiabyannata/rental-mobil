import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth/jwt";
import { hashPassword } from "@/lib/auth/password";

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();
    if (!token || !newPassword)
      return NextResponse.json(
        { error: "token and newPassword required" },
        { status: 400 }
      );
    if (newPassword.length < 6)
      return NextResponse.json(
        { error: "Password too short" },
        { status: 400 }
      );

    const decoded = verifyToken(token);
    if (!decoded || decoded.purpose !== "password-reset")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = decoded.sub;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
    // Consume latest pending request
    await prisma.passwordResetRequest.updateMany({
      where: { userId, consumed: false },
      data: { consumed: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
