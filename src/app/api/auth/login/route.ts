import { NextResponse } from "next/server";
import { findUserByEmail, verifyPassword } from "@/lib/auth";
import { createSessionToken, sessionCookieOptions } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const sessionUser = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
    };

    const token = await createSessionToken(sessionUser);
    const response = NextResponse.json({ user: sessionUser });
    response.cookies.set(sessionCookieOptions(token));

    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
