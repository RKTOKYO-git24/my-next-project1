// /home/ryotaro/dev/mnp-dw-20250821/app/api/physna-v3/folders/[id]/contents/route.ts

import { NextResponse } from "next/server";
import { physnaFetch } from "@/lib/physna-v3/client";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id: folderId } = params;
  const tenantId = process.env.PHYSNA_V3_TENANT_ID;

  if (!tenantId) {
    console.error("❌ Missing PHYSNA_V3_TENANT_ID in environment");
    return NextResponse.json(
      { error: "Tenant ID not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("perPage") || "20";
  const contentType = searchParams.get("contentType") || ""; // "folders" or "assets"

  try {
    // ✅ contentTypeパラメータを可変にして汎用化
    const apiUrl = `/tenants/${tenantId}/folders/${folderId}/contents?page=${page}&perPage=${perPage}${
      contentType ? `&contentType=${contentType}` : ""
    }`;

    console.log("📡 Fetching:", apiUrl);

    const data = await physnaFetch(apiUrl);

    // ✅ 構造チェック（想定外データならエラーに）
    if (!data || typeof data !== "object" || !data.contents) {
      throw new Error("Unexpected Physna API response structure");
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("❌ Folder contents API error:", err?.message || err);

    return NextResponse.json(
      {
        error: "Failed to fetch folder contents",
        detail: err?.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? err?.stack : undefined,
      },
      { status: 500 }
    );
  }
}
