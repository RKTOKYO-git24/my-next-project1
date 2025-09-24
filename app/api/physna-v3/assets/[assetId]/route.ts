// /home/ryotaro/dev/mnp-dw-20250821/app/api/physna-v3/assets/[assetId]/route.ts

import { NextResponse } from "next/server";
import { physnaFetch } from "@/lib/physna-v3/client";

export async function GET(
  req: Request,
  { params }: { params: { assetId: string } }
) {
  try {
    const tenantId = process.env.PHYSNA_V3_TENANT_ID!;
    const data = await physnaFetch(
      `/tenants/${tenantId}/assets/${params.assetId}`
    );

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Asset API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch asset", detail: err.message },
      { status: 500 }
    );
  }
}