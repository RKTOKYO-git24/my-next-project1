// /api/physna/search/route.ts

import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/physna";
import { PhysnaModel, PhysnaItem } from "@/types/physna";


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

// ここで型アサーション（as）を使って明示的に型を指定
const models: PhysnaModel[] = data.models ?? [];

const items: PhysnaItem[] = models.map((model) => ({
  id: model.id,
  name: model.name,
  thumbnailUrl: model.thumbnail ?? undefined,
  fileName: model.fileName ?? undefined,
  fileType: model.fileType ?? undefined,
  createdAt: model.createdAt ?? undefined,
  isAssembly: model.isAssembly ?? undefined,
  units: model.units ?? undefined,
  folderId: model.folderId,
  state: model.state ?? undefined,
  geometry: model.geometry ?? undefined,
  folder: model.folder ?? undefined,
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
