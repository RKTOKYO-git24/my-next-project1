// /home/ryotaro/dev/mnp-dw-20250821/app/api/physna-v3/assets/route.ts

import { NextResponse } from "next/server";
import { physnaFetch } from "@/lib/physna-v3/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = (page - 1) * limit;

  const tenantId = process.env.PHYSNA_V3_TENANT_ID!;
  const data = await physnaFetch(
    `/tenants/${tenantId}/assets?limit=${limit}&offset=${offset}`
  );

  return NextResponse.json(data);
}
