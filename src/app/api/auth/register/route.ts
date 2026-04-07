import { NextResponse } from "next/server";
import { createUser, findUserByEmail, findUserByUsername, isValidUsername } from "@/lib/auth";
import { createSessionToken, sessionCookieOptions } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!isValidUsername(username)) {
      return NextResponse.json(
        { error: "Username must be 3-20 characters, letters, numbers, and underscores only" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    const user = await createUser(email, username, password);

    const sessionUser = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
    };

    const token = await createSessionToken(sessionUser);
    const response = NextResponse.json({ user: sessionUser }, { status: 201 });
    response.cookies.set(sessionCookieOptions(token));

    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
