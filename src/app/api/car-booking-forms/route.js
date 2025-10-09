import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    { error: "Booking API has been removed" },
    { status: 410 }
  );
}
