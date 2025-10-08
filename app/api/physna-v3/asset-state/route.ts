import { NextResponse } from "next/server";
import { physnaFetch } from "@/lib/physna-v3/client";

/**
 * GET /api/physna-v3/asset-state?folderName=Molex
 *
 * 指定フォルダ名（例: Molex）に属する全アセットの状態をPhysna APIから取得。
 * 返り値は Physna Swagger UI の /assets/state エンドポイントと同じ形式。
 */
export async function GET(req: Request) {
  try {
    const tenantId = process.env.PHYSNA_V3_TENANT_ID;
    if (!tenantId) {
      return NextResponse.json(
        { error: "Missing PHYSNA_V3_TENANT_ID" },
        { status: 500 }
      );
    }

    // 🌐 クエリパラメータから folderName を取得
    const url = new URL(req.url);
    const folderName = url.searchParams.get("folderName");

    if (!folderName) {
      return NextResponse.json(
        { error: "Missing ?folderName= query parameter" },
        { status: 400 }
      );
    }

    console.log(`📊 Fetching Physna asset state for folder: ${folderName}`);

    // ✅ Physna公式API呼び出し（フォルダ名を指定）
    const result = await physnaFetch(
      `/tenants/${tenantId}/assets/state?folders=${encodeURIComponent(folderName)}`
    );

    // ✅ 返却データを検証
    if (!result || typeof result !== "object") {
      throw new Error("Invalid response from Physna API");
    }

    // ✅ 成功レスポンス
    return NextResponse.json({
      folder: folderName,
      ...result,
    });
  } catch (err: any) {
    console.error("❌ Asset state API error:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch asset states",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}
