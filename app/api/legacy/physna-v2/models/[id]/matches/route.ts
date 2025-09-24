// /home/ryotaro/dev/mnp-dw-20250821/app/api/legacy/physna-v2/models/[id]/matches/route.ts

import { NextResponse } from "next/server";
import { getAccessToken } from "legacy/physna-v2/physna";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const token = await getAccessToken();
    console.log("🟢 Using token:", token.slice(0, 20) + "...");

    // ✅ まずは従来の /models/{id}/matches を試す
    let url = `https://api.physna.com/v2/models/${id}/matches`;
    let res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    // ❌ 401 Unauthorized の場合は /matches?modelId=xxx を試す
    if (res.status === 401) {
      console.warn("⚠️ Falling back to /matches?modelId endpoint");
      url = `https://api.physna.com/v2/matches?modelId=${id}`;
      res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    }

    const text = await res.text();
    console.log("🔑 Physna API response:", res.status, text);

    if (!res.ok) {
      return NextResponse.json({ error: text }, { status: res.status });
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON from Physna API", raw: text },
        { status: 500 }
      );
    }

    // ✅ matches のみ返す（フロント側がシンプルに扱えるように）
    return NextResponse.json({
      matches: data.matches ?? [],
    });
  } catch (err: any) {
    console.error("❌ Internal error:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
