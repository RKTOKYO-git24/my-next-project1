// /home/ryotaro/dev/mnp-dw-20250821/app/api/physna-v3/folders/route.ts
import { NextResponse } from "next/server";
import { physnaFetch } from "@/lib/physna-v3/client";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = process.env.PHYSNA_V3_TENANT_ID;
    if (!tenantId) {
      return NextResponse.json(
        { error: "Missing PHYSNA_V3_TENANT_ID" },
        { status: 500 }
      );
    }

    const folderId = params.id;
    if (!folderId) {
      return NextResponse.json(
        { error: "Missing folder ID" },
        { status: 400 }
      );
    }

    // ✅ フォルダ基本情報
    const folderInfo = await physnaFetch(
      `/tenants/${tenantId}/folders/${folderId}`
    );

    // ✅ サブフォルダ一覧
    const subfolders = await physnaFetch(
      `/tenants/${tenantId}/folders/${folderId}/contents?contentType=folders`
    );

    // ✅ アセット一覧
    const assets = await physnaFetch(
      `/tenants/${tenantId}/folders/${folderId}/contents?contentType=assets`
    );

    return NextResponse.json({
      ...folderInfo,
      subfolders: subfolders.contents || [],
      assets: assets.contents || [],
    });
  } catch (err: any) {
    console.error("❌ Folder API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch folder details", detail: err.message },
      { status: 500 }
    );
  }
}
