// app/api/physna-v3/folders/[id]/contents/route.ts
import { NextResponse } from "next/server";
import { physnaFetch } from "@/lib/physna-v3/client";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("perPage") || "20";

  try {
    const tenantId = process.env.PHYSNA_V3_TENANT_ID!;
    const folderId = params.id;

    const data = await physnaFetch(
      `/tenants/${tenantId}/folders/${folderId}/contents?page=${page}&perPage=${perPage}&contentType=all`
    );

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Folder contents API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch folder contents", detail: err.message },
      { status: 500 }
    );
  }
}
