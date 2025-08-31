// app/_libs/payload.ts
const API = process.env.NEXT_PUBLIC_PAYLOAD_API?.replace(/\/$/, '') as string;
if (!API) throw new Error('NEXT_PUBLIC_PAYLOAD_API is not set');

const BASE = API.replace(/\/api$/, ''); // 例: http://localhost:3100

type GetNewsListArgs = {
  limit: number;
  page?: number;        // 1始まり
  q?: string;           // 検索キーワード（title 部分一致）
  category?: string;    // 例: 'private' は未ログインだと API 側で弾かれます
};

function imageUrl(file: any | undefined): string | undefined {
  // Payload の upload は doc.thumbnail に { url, filename, ... } のどちらかが入る
  if (!file) return undefined;
  if (file.url) return file.url;
  if (file.filename) return `${BASE}/media/${file.filename}`;
  return undefined;
}

// microCMS とほぼ同じ形にマップして返す（components側を変えないため）
function mapNewsDoc(d: any) {
  return {
    id: d.id,
    title: d.title,
    slug: d.slug,
    // microCMS の description 相当を excerpt から拾う
    description: d.excerpt ?? '',
    // microCMS の thumbnail.url と同じアクセスで使えるよう整形
    thumbnail: d.thumbnail
      ? { url: imageUrl(d.thumbnail), alt: d.thumbnail.alt ?? '' }
      : undefined,

      // ▼ ここを追加：microCMSと同名の日時プロパティ
    publishedAt: d.publishedDate ?? d.createdAt ?? d.updatedAt ?? null,
    revisedAt: d.updatedAt ?? null,
    createdAt: d.createdAt ?? null,
    updatedAt: d.updatedAt ?? null,

    content: d.content,
    category: d.category,
    status: d.status,
  };
}

export async function getNewsList({ limit, page = 1, q, category }: GetNewsListArgs) {
  const sp = new URLSearchParams();
  sp.set('limit', String(limit));
  sp.set('page', String(page));
  sp.set('depth', '1'); // thumbnail の中身まで解決
  // 未ログイン時は API 側 access で private が除外される想定

  // where 条件の組み立て
  // 例: title に部分一致
  if (q && q.trim()) sp.set('where[title][contains]', q.trim());
  if (category && category.trim()) sp.set('where[category][equals]', category.trim());

  const res = await fetch(`${API}/news?${sp.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch news list: ${res.status}`);
  const data = await res.json();

  // microCMS 互換の戻り値
  return {
    contents: (data.docs || []).map(mapNewsDoc),
    totalCount: data.totalDocs ?? data.total ?? 0,
  };
}

export async function getNewsDetail(slug: string) {
  const sp = new URLSearchParams();
  sp.set('where[slug][equals]', slug);
  sp.set('depth', '1');

  const res = await fetch(`${API}/news?${sp.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch news detail: ${res.status}`);
  const data = await res.json();
  const doc = (data.docs || [])[0];
  if (!doc) throw new Error('Not Found');

  return mapNewsDoc(doc);
}
