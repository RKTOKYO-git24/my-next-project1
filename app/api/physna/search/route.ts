import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/physna";
import { PhysnaItem } from "@/types/physna"; // ✅ 型定義のインポート

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

    const items: PhysnaItem[] = (data.models || []).map((model: any) => ({
      id: model.id,
      name: model.name,
      thumbnailUrl: model.thumbnail ?? null,
      fileName: model.fileName ?? null,
      fileType: model.fileType ?? null,
      createdAt: model.createdAt ?? null,
      isAssembly: model.isAssembly ?? null,
      units: model.units ?? null,
      state: model.state ?? null,
      geometry: model.geometry ?? null,
      folder: model.folder ?? null,
    }));

    return NextResponse.json({ items });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Unexpected error: ${message}` },
      { status: 500 }
    );
  }
}
