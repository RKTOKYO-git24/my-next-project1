import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/physna";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Missing or invalid query" }, { status: 400 });
    }

    const token = await getAccessToken();

    const url = new URL(`${process.env.PHYSNA_API_BASE}/models`);
    url.searchParams.set("search", query);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `Physna ${res.status}: ${errText}` }, { status: res.status });
    }

    const data = await res.json();
      console.log("Physna API response:", data); 
    // 👇 thumbnail_url → thumbnailUrl に変換
    const items = (data.models || []).map((model: any) => ({
      id: model.id,
      name: model.name,
      thumbnailUrl: model.thumbnail ?? null,
      folder: model.folder ?? null,
    }));

    return NextResponse.json({ items });

  } catch (err: unknown) {
    // 型ガードでError型かどうかをチェック
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Unexpected error: ${message}` },
      { status: 500 }
    );
  }
}
