// /app/api/physna-v3/asset-state/route.ts
import { NextResponse } from "next/server";
import { physnaFetch } from "@/lib/physna-v3/client";

/**
 * GET /api/physna-v3/asset-state
 * テナント全体、またはフォルダ指定時のアセットステータスを取得
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const folderName = searchParams.get("folderName");
    const tenantId = process.env.PHYSNA_V3_TENANT_ID;

    if (!tenantId) {
      return NextResponse.json(
        { error: "Missing PHYSNA_V3_TENANT_ID" },
        { status: 500 }
      );
    }

    // ✅ ベースURLをフォルダ指定なしで構築
    // 例: https://app-api.physna.com/v3/tenants/{tenantId}/assets/state
    const basePath = `/tenants/${tenantId}/assets/state`;
    const apiUrl = folderName
      ? `${basePath}?folderName=${encodeURIComponent(folderName)}`
      : basePath;

    console.log("📡 Fetching asset state:", apiUrl);

    const data = await physnaFetch(apiUrl);

    if (!data || typeof data !== "object") {
      throw new Error("Unexpected Physna API response structure");
    }

    // ✅ 期待されるレスポンス構造:
    // { indexing, finished, failed, unsupported, "no-3d-data" }
    return NextResponse.json({
      indexing: data.indexing || 0,
      finished: data.finished || 0,
      failed: data.failed || 0,
      unsupported: data.unsupported || 0,
      "no-3d-data": data["no-3d-data"] || 0,
    });
  } catch (err: any) {
    console.error("❌ Asset state API error:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch asset state",
        detail: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
