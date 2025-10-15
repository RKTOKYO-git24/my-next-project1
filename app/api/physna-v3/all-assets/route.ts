// /home/ryotaro/dev/mnp-dw-20250821/app/api/physna-v3/all-assets/route.ts

import { NextResponse } from "next/server";
import { physnaFetch } from "@/lib/physna-v3/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "100", 10);

  const tenantId = process.env.PHYSNA_V3_TENANT_ID!;
  const results: any[] = [];

  async function fetchFolderContents(folderId: string, path: string[] = []) {
    const data = await physnaFetch(
      `/tenants/${tenantId}/folders/${folderId}/contents?perPage=100&contentType=all`
    );

    for (const item of data.contents) {
      if (item.contentType === "folder") {
        await fetchFolderContents(item.id, [
          ...path,
          item.name || item.displayName || "unnamed-folder",
        ]);
      } else if (item.contentType === "asset") {
        const displayName =
          item.name ||
          item.displayName ||
          (item.path ? item.path.split("/").pop() : "(no name)");

        results.push({
          folderPath: path.join("/") || "root",
          assetName: displayName,
          id: item.id,
          state: item.state || "unknown",
        });
      }
    }
  }

  try {
    // ✅ すべてのアセットを一度だけ取得
    await fetchFolderContents("root", []);

    // ✅ ページネーション処理（フロントと連動）
    const total = results.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginated = results.slice(start, end);

    return NextResponse.json({
      assets: paginated,
      pageData: {
        total,
        page,
        perPage,
        startIndex: start + 1,
        endIndex: Math.min(end, total),
      },
    });
  } catch (err: any) {
    console.error("❌ all-assets API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch all assets", detail: err.message },
      { status: 500 }
    );
  }
}
