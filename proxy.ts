import { NextResponse, type NextRequest } from "next/server";

import { DASHBOARD_COOKIE, passwordToken } from "@/lib/dashboardAuth";

export const config = {
  matcher: ["/dashboard/:path*"],
};

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/dashboard/login") {
    return NextResponse.next();
  }

  const password = process.env.DASHBOARD_PASSWORD;

  // 비밀번호가 설정되지 않았다면 열어두지 말고 막는다.
  if (!password) {
    return new NextResponse(
      "DASHBOARD_PASSWORD 환경변수가 설정되지 않아 대시보드를 열 수 없습니다.",
      { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  const cookie = request.cookies.get(DASHBOARD_COOKIE)?.value;

  if (cookie && cookie === (await passwordToken(password))) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/dashboard/login", request.url));
}
