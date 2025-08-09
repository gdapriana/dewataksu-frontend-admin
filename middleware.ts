// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, SignJWT } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(process.env.NEXT_JWT_SECRET);
const REFRESH_SECRET = new TextEncoder().encode(process.env.NEXT_REFRESH_SECRET);

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const loginUrl = new URL("/login", request.url);

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(loginUrl);
  }

  if (accessToken) {
    try {
      await jwtVerify(accessToken, ACCESS_SECRET);
      return NextResponse.next();
    } catch (err) {
      console.log("Access token expired or invalid:", err);
    }
  }

  if (refreshToken) {
    try {
      const { payload } = await jwtVerify(refreshToken, REFRESH_SECRET);

      const newAccessToken = await new SignJWT({ userId: payload.userId }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("15m").sign(ACCESS_SECRET);

      const res = NextResponse.next();
      res.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
      return res;
    } catch (err) {
      console.log("Refresh token invalid:", err);
    }
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
