import { NextResponse } from "next/server";
import { removeTokenCookie } from "@/lib/auth/jwt";

export async function POST() {
  try {
    // Remove token dari cookie
    await removeTokenCookie();

    return NextResponse.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
