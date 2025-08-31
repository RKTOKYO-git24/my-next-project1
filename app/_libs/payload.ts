// app/_libs/payload.ts

function getApiBase() {
  const publicApi = process.env.NEXT_PUBLIC_PAYLOAD_API?.replace(/\/$/, '');
  const serverApi = process.env.NEXT_SERVER_PAYLOAD_API?.replace(/\/$/, '');

  if (typeof window === 'undefined') {
    // SSR / Server Side は内部ネットワーク優先
    return serverApi || publicApi || '';
  }
  // クライアントは public 用
  return publicApi || '';
}

function imageUrl(file: any | undefined): string | undefined {
  if (!file) return;
  if (file.url) return file.url;
  if (file.filename) return `${getApiBase().replace(/\/api$/, '')}/media/${file.filename}`;
}

function mapNewsDoc(d: any) {
  return {
    id: d.id,
    title: d.title,
    slug: d.slug,
    description: d.excerpt ?? '',
    thumbnail: d.thumbnail
      ? { url: imageUrl(d.thumbnail), alt: d.thumbnail.alt ?? '' }
      : undefined,
    publishedAt: d.publishedDate ?? d.createdAt ?? d.updatedAt ?? null,
    revisedAt: d.updatedAt ?? null,
    createdAt: d.createdAt ?? null,
    updatedAt: d.updatedAt ?? null,
    content: d.content,
    category: d.category,
    status: d.status,
  };
}

export async function getNewsList({ limit, page = 1, q, category }:
  { limit: number; page?: number; q?: string; category?: string }) {
  const base = getApiBase();
  const sp = new URLSearchParams();
  sp.set('limit', String(limit));
  sp.set('page', String(page));
  sp.set('depth', '1');
  if (q) sp.set('where[title][contains]', q);
  if (category) sp.set('where[category][equals]', category);

  const res = await fetch(`${base}/news?${sp}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const data = await res.json();
  return {
    contents: (data.docs || []).map(mapNewsDoc),
    totalCount: data.totalDocs ?? data.total ?? 0,
  };
}

export async function getNewsDetail(slug: string) {
  const base = getApiBase();
  const sp = new URLSearchParams();
  sp.set('where[slug][equals]', slug);
  sp.set('depth', '1');

  const res = await fetch(`${base}/news?${sp}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const data = await res.json();
  return mapNewsDoc((data.docs || [])[0]);
}
