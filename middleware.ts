import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createNextAuthMiddleware } from "nextjs-basic-auth-middleware";

// 元のBASIC認証ミドルウェア
const basicAuthMiddleware = createNextAuthMiddleware();

// ✅ favicon系ファイルを除外したいパス
const publicPathsToBypassAuth = [
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/site.webmanifest",
];

// カスタムmiddlewareラッパー
export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host");
  const pathname = request.nextUrl.pathname;

  const isDev =
    hostname?.startsWith("localhost") || process.env.NODE_ENV === "development";

  // ✅ faviconやmanifestなどは認証をスキップ
  if (publicPathsToBypassAuth.includes(pathname)) {
    return NextResponse.next();
  }

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
