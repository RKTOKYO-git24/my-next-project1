// /home/ryotaro/dev/mnp-dw-20250821/app/api/physna-v3/folders/route.ts

import { NextResponse } from "next/server";
import { physnaFetch } from "@/lib/physna-v3/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("perPage") || "20", 10);

    const tenantId = process.env.PHYSNA_V3_TENANT_ID!;
    const data = await physnaFetch(
      `/tenants/${tenantId}/folders?page=${page}&perPage=${perPage}`
    );

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Folders API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch folders", detail: err.message },
      { status: 500 }
    );
  }
}
