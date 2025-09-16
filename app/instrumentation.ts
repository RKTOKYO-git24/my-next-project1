// /home/ryotaro/dev/mnp-dw-20250821/app/instrumentation.ts

import * as Sentry from "@sentry/nextjs";

console.log("🚀 instrumentation.ts loaded");

export function register() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, // 👈 修正！
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
