// /home/ryotaro/dev/mnp-dw-20250821/app/api/physna-v3/folders/[id]/route.ts

import { NextResponse } from "next/server";
import { physnaFetch } from "@/lib/physna-v3/client";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = process.env.PHYSNA_V3_TENANT_ID!;
    const folderId = params.id;

    const data = await physnaFetch(
      `/tenants/${tenantId}/folders/${folderId}`
    );

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Folder detail API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch folder detail", detail: err.message },
      { status: 500 }
    );
  }
}
