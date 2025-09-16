// /home/ryotaro/dev/mnp-dw-20250821/sentry.edge.config.ts

// sentry.edge.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
