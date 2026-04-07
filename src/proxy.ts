import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedApiRoutes = [
  "/api/communities", // POST only
  "/api/ai/chat",
];

const authPages = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("loom-session")?.value;

  // Redirect logged-in users away from auth pages
  if (authPages.some((p) => pathname.startsWith(p)) && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect write operations on API routes (POST/PUT/DELETE)
  if (request.method !== "GET") {
    const needsAuth = protectedApiRoutes.some((r) => pathname.startsWith(r));
    if (needsAuth && !sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
