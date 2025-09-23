// /home/ryotaro/dev/mnp-dw-20250821/next.config.ts

import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [ // 既存ホスト
      { protocol: "https", hostname: "cdn.physna.com" },
      { protocol: "https", hostname: "images.microcms-assets.io" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      {
        // Payload (dev環境) - 画像エンドポイントのみ許可
        protocol: "http",
        hostname: "localhost",
        port: "3100",
        pathname: "/api/media/file/:path*",
      },
      {
        // Payload (本番環境)
        protocol: "https",
        hostname: "cms.ryotkim.com",
        pathname: "/api/media/file/:path*",
      },
    ],
    
  },
 // rewrites for legacy redirect
  async rewrites() {
    return [
      // v2 legacy へのリダイレクト的ルーティング
      {
        source: "/api/physna/:path*",
        destination: "/api/legacy/physna-v2/:path*",
      },
    ];
  },
};


export default withSentryConfig(nextConfig, { silent: true });
