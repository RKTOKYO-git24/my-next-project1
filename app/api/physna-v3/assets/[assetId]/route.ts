// /home/ryotaro/dev/mnp-dw-20250821/app/api/physna-v3/assets/[assetId]/route.ts
import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/physna-v3/auth";

const API_BASE = process.env.PHYSNA_V3_API_BASE!;
const TENANT_ID = process.env.PHYSNA_V3_TENANT_ID!;

export async function GET(
  req: Request,
  context: { params: Promise<{ assetId: string }> }
) {
  const { assetId } = await context.params;

  try {
    const token = await getAccessToken();
    const res = await fetch(
      `${API_BASE}/tenants/${TENANT_ID}/assets/${assetId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Failed to fetch asset: ${res.status} ${text}` },
        { status: res.status }
      );
    }

    // 🎯 JSON のみ返す（PNG はここで処理しない）
    const json = await res.json();
    return NextResponse.json(json);

  } catch (err: any) {
    return NextResponse.json(
      { error: `Exception: ${err.message}` },
      { status: 500 }
    );
  }
}
