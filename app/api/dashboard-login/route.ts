import { NextResponse, type NextRequest } from "next/server";

import { DASHBOARD_COOKIE, passwordToken } from "@/lib/dashboardAuth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const input = String(formData.get("password") ?? "");
  const password = process.env.DASHBOARD_PASSWORD;

  if (!password || input !== password) {
    return NextResponse.redirect(
      new URL("/dashboard/login?error=1", request.url),
      { status: 303 },
    );
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url), {
    status: 303,
  });

  response.cookies.set(DASHBOARD_COOKIE, await passwordToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/dashboard",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
