import { NextResponse } from "next/server";
import { findUserByUsername, isValidUsername } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username || !isValidUsername(username)) {
    return NextResponse.json({ available: false, error: "Invalid username" });
  }

  const existing = await findUserByUsername(username);
  return NextResponse.json({ available: !existing });
}
