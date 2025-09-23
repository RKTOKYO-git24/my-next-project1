// /home/ryotaro/dev/mnp-dw-20250821/app/api/physna-v3/thumbnail/[assetId]/route.ts

import { getAccessToken } from "@/lib/physna-v3/auth";

const API_BASE = process.env.PHYSNA_V3_API_BASE!;
const TENANT_ID = process.env.PHYSNA_V3_TENANT_ID!;

export async function GET(
  req: Request,
  context: { params: Promise<{ assetId: string }> }
) {
  // 👇 Next.js 15 以降では Promise を await
  const { assetId } = await context.params;
  const token = await getAccessToken();

  const res = await fetch(
    `${API_BASE}/tenants/${TENANT_ID}/assets/${assetId}/thumbnail.png`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return new Response(`Failed to fetch thumbnail: ${res.status} ${text}`, {
      status: res.status,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const arrayBuffer = await res.arrayBuffer();
  return new Response(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
