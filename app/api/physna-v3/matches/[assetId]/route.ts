// /home/ryotaro/dev/mnp-dw-20250821/app/api/physna-v3/matches/[assetId]/route.ts

import { NextResponse } from "next/server";
import { physnaFetch } from "@/lib/physna-v3/client";

export async function GET(
  req: Request,
  context: { params: Promise<{ assetId: string }> }
) {
   const { assetId } = await context.params; 
  const { searchParams } = new URL(req.url);
  const minThreshold = parseInt(searchParams.get("threshold") || "80", 10);

  try {
    const tenantId = process.env.PHYSNA_V3_TENANT_ID!;
    const data = await physnaFetch(
      `/tenants/${tenantId}/assets/${assetId}/geometric-search`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: 1,
          perPage: 20,
          minThreshold, // ✅ Swagger と同じプロパティ名
        }),
      }
    );

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Matches API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch matches", detail: err.message },
      { status: 500 }
    );
  }
}
