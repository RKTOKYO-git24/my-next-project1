// /home/ryotaro/dev/mnp-dw-20250821/sentry.client.config.ts

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN, // ← .env.local に設定済みのDSN
  tracesSampleRate: 1.0,       // パフォーマンス計測（必要なら調整）
});
