import { NextResponse } from "next/server";
import { physnaFetch } from "@/lib/physna-v3/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("perPage") || "20";

  try {
    const tenantId = process.env.PHYSNA_V3_TENANT_ID!;

    // Home直下のフォルダとアセットを取得
    const data = await physnaFetch(
      `/tenants/${tenantId}/folders/root/contents?page=${page}&perPage=${perPage}&contentType=all`
    );

    // そのまま返す（folders と assets 混在）
    return NextResponse.json({
      contents: data.contents,
      pageData: data.pageData,
    });
  } catch (err: any) {
    console.error("Assets API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch home contents", detail: err.message },
      { status: 500 }
    );
  }
}
