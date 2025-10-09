import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json(
    { error: "Booking API has been removed" },
    { status: 410 }
  );
}
