import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createNextAuthMiddleware } from "nextjs-basic-auth-middleware";

// 元のBASIC認証ミドルウェア
const basicAuthMiddleware = createNextAuthMiddleware();

// カスタムmiddlewareラッパー
export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host");
  const isDev =
    hostname?.startsWith("localhost") || process.env.NODE_ENV === "development";

  // 許可するドメインだけを明示
  const allowedHosts = ["ryotkim.com", "www.ryotkim.com"];

  //  開発環境では常に許可
  if (isDev) {
    return basicAuthMiddleware(request);
  }

  if (!hostname || !allowedHosts.includes(hostname)) {
    // .vercelappなど → Googleにリダイレクト
    return NextResponse.redirect("https://www.google.com");

    // .vercel.appなどからのアクセスを拒否
    // return new Response("403 - Access Denied", { status: 403 });
  }

  // 許可されたドメインのみBASIC認証を通す
  return basicAuthMiddleware(request);
}

export const config = {
  matcher: ["/:path*"],
};
