export const runtime = 'nodejs';

export async function GET() {
  const base = process.env.NEXT_SERVER_PAYLOAD_API;

  if (!base) {
    console.error('ping-cms: NEXT_SERVER_PAYLOAD_API is not set');
    return new Response(JSON.stringify({ ok: false, error: 'ENV NEXT_SERVER_PAYLOAD_API is not set' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const headers: Record<string, string> = {};
    // （必要なら）CMS 側のトークンや Basic を試せるように
    if (process.env.PAYLOAD_API_TOKEN) {
      headers.Authorization = `Bearer ${process.env.PAYLOAD_API_TOKEN}`;
    } else if (process.env.CMS_BASIC_USER && process.env.CMS_BASIC_PASS) {
      const b64 = Buffer.from(`${process.env.CMS_BASIC_USER}:${process.env.CMS_BASIC_PASS}`).toString('base64');
      headers.Authorization = `Basic ${b64}`;
    }

    const r = await fetch(base, { cache: 'no-store', headers });
    const text = await r.text();
    return new Response(JSON.stringify({
      ok: r.ok,
      status: r.status,
      url: base,
      snippet: text.slice(0, 300),
    }), { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    console.error('ping-cms failed:', e?.name, e?.message);
    return new Response(JSON.stringify({ ok: false, error: e?.message }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }
}
