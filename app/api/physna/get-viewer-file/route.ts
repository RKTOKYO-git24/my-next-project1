// ✅ /app/api/physna/get-viewer-file/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/physna';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  try {
    const token = await getAccessToken();

    const viewerRes = await fetch(`https://api.physna.com/v2/models/${id}/viewer-file`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!viewerRes.ok) {
      const errorText = await viewerRes.text();
      return NextResponse.json({ error: errorText }, { status: viewerRes.status });
    }

    const viewerData = await viewerRes.json();
    return NextResponse.json(viewerData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
