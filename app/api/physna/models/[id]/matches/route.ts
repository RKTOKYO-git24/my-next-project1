// app/api/physna/models/[id]/matches/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/physna"; // ✅ 共通関数のインポート

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  console.log("🔍 Fetching matches for ID:", id);

  try {
    const accessToken = await getAccessToken(); // ✅ アクセストークンを取得

    const res = await fetch(
      `https://api.physna.com/v2/models/${id}/matches?threshold=0.8&page=1&perPage=20`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-PHYSNA-TENANTID": process.env.PHYSNA_TENANT_ID ?? "",
        },
      }
    );

    const text = await res.text();
    const contentType = res.headers.get("content-type");

    if (!res.ok || !contentType?.includes("application/json")) {
      console.error("❌ Physna API error:", text);
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = JSON.parse(text);
    console.log("✅ Physna API raw response:", JSON.stringify(data, null, 2));

    return NextResponse.json(data, { status: 200 });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Unexpected error: ${message}` }, { status: 500 });
  }
}
