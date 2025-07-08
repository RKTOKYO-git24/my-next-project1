import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/physna';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  try {
    const token = await getAccessToken();

    const modelRes = await fetch(`https://api.physna.com/v2/models/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const model = await modelRes.json();
    return NextResponse.json(model);
  } catch (err: unknown) {
    let message = 'Unknown error';
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
