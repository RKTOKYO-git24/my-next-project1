// /home/ryotaro/dev/mnp-dw-20250821/app/api/physna-v3/folders/[id]/route.ts
import { NextResponse } from "next/server";
import { physnaFetch } from "@/lib/physna-v3/client";

/**
 * GET /api/physna-v3/folders/[id]
 * 指定フォルダの詳細情報（名前・サブフォルダ・アセット一覧）を取得
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // Next.js 15 仕様
) {
  try {
    const { id: folderId } = await context.params; // ← await が必須
    console.log(`📂 Fetching folder details for ID: ${folderId}`);

    const tenantId = process.env.PHYSNA_V3_TENANT_ID;
    if (!tenantId) {
      return NextResponse.json(
        { error: "Missing PHYSNA_V3_TENANT_ID" },
        { status: 500 }
      );
    }

    // ✅ 1. フォルダ情報取得
    const folderInfo = await physnaFetch(
      `/tenants/${tenantId}/folders/${folderId}`
    );
    console.log("📁 folderInfo:", folderInfo);

    // ✅ folderInfo.folder に対応
    const folderData = folderInfo.folder || folderInfo;

    // ✅ フォルダ名を抽出（すべての可能性を網羅）
    const folderName =
      folderData?.name ||
      folderData?.folderName ||
      folderData?.displayName ||
      folderData?.label ||
      folderData?.path?.split("/").pop() ||
      "(unknown)";

    // ✅ 2. サブフォルダ一覧
    const subfoldersResponse = await physnaFetch(
      `/tenants/${tenantId}/folders/${folderId}/contents?contentType=folders`
    );

    // ✅ 3. アセット一覧
    const assetsResponse = await physnaFetch(
      `/tenants/${tenantId}/folders/${folderId}/contents?contentType=assets`
    );

    // ✅ 4. 結果を統合
    return NextResponse.json({
      id: folderId,
      name: folderName,
      parentFolderId: folderData?.parentFolderId || null,
      subfolders: subfoldersResponse?.contents || [],
      assets: assetsResponse?.contents || [],
    });
  } catch (err: any) {
    console.error("❌ Folder API error:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch folder details",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}
