import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 認証を完全にスキップするミドルウェア
export function middleware(request: NextRequest) {
  return NextResponse.next(); // 全てのリクエストをそのまま通す
}

// 必要なら matcher は維持
export const config = {
  matcher: ["/:path*"],
};
