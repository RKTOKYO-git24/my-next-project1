import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/physna-v3/auth";

const API_BASE = process.env.PHYSNA_V3_API_BASE!;
const TENANT_ID = process.env.PHYSNA_V3_TENANT_ID!;

/**
 * Visual Search proxy
 * Swagger: POST /tenants/{tenantId}/assets/visual-search (multipart/form-data)
 * 必須: files (最大10枚)
 * 任意: searchQuery, metadataFilters, folders, extensions, page, perPage
 */
export async function POST(req: Request) {
  try {
    const incoming = await req.formData();

    // フロントからは 'file' ひとつを想定。'files' 配列でも来たらそのまま拾う。
    const files: File[] = [];
    const single = incoming.get("file");
    if (single instanceof File) files.push(single);

    const maybeFiles = incoming.getAll("files");
    for (const f of maybeFiles) {
      if (f instanceof File) files.push(f);
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: "At least one file is required." },
        { status: 400 }
      );
    }

    const token = await getAccessToken();

    const body = new FormData();
    // Swagger は 'files'（複数）必須
    for (const f of files) body.append("files", f, f.name || "upload.png");

    // 任意パラメータは存在する時のみ転送（空文字は送らない）
    const optionalKeys = [
      "searchQuery",
      "metadataFilters",
      "folders",
      "extensions",
      "page",
      "perPage",
    ] as const;

    optionalKeys.forEach((k) => {
      const v = incoming.get(k);
      if (typeof v === "string" && v.trim() !== "") {
        body.append(k, v);
      }
    });

    const res = await fetch(
      `${API_BASE}/tenants/${TENANT_ID}/assets/visual-search`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Physna visual-search error:", res.status, text);
      return NextResponse.json(
        { error: "Physna visual-search failed", detail: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    // そのまま透過
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("VisualSearch API error:", err);
    return NextResponse.json(
      { error: "Failed to run visual search", detail: err?.message },
      { status: 500 }
    );
  }
}
