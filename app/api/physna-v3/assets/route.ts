// /home/ryotaro/dev/mnp-dw-20250821/app/api/physna-v3/assets/route.ts

import { NextResponse } from "next/server";
import { physnaFetch } from "@/lib/physna-v3/client";

export async function GET() {
  try {
    const tenantId = process.env.PHYSNA_V3_TENANT_ID!;
    const data = await physnaFetch(`/tenants/${tenantId}/assets`);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
