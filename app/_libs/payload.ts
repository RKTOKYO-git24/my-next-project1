// /app/_libs/payload.ts

// ==============================
// 環境変数
// ------------------------------
// クライアント/SSR 双方で使うAPIベースURLを用意してください。
// 例（ローカルDocker）:
//   NEXT_PUBLIC_PAYLOAD_API=http://localhost:3100/api
//   NEXT_SERVER_PAYLOAD_API=http://payload:3000/api   // ← compose のサービス名に合わせる
// ==============================

/** APIベース（.../api の形を想定）を返す。未設定なら null */
function getApiBase(): string | null {
  const pub = process.env.NEXT_PUBLIC_PAYLOAD_API?.replace(/\/$/, '') || null;
  const svr = process.env.NEXT_SERVER_PAYLOAD_API?.replace(/\/$/, '') || null;
  // SSR ではサーバー用を優先
  if (typeof window === 'undefined') return svr || pub;
  return pub;
}

/** APIベースから origin（http://host:port 部分）を取り出す */
function getOriginFromApiBase(apiBase: string): string {
  // apiBase が http://host:port/api の想定
  try {
    const u = new URL(apiBase);
    return `${u.protocol}//${u.host}`;
  } catch {
    return apiBase.replace(/\/api$/, '');
  }
}

/** 任意のURL/パスを絶対URLにする。すでに絶対ならそのまま返す */
function toAbsoluteURL(input: string): string {
  try {
    // 既に absolute
    // eslint-disable-next-line no-new
    new URL(input);
    return input;
  } catch {
    const apiBase = getApiBase();
    if (!apiBase) return input; // 最低限のフォールバック
    const origin = getOriginFromApiBase(apiBase);
    const p = input.startsWith('/') ? input : `/${input}`;
    return origin + p;
  }
}

/** Payload の file オブジェクトから表示用URLを安全に取り出す */
function imageUrl(file: any | undefined): string | undefined {
  if (!file) return undefined;
  // Payloadが返す既定のURL（絶対 or /api/media/file/...）
  let url: string | undefined = file.url || file.thumbnailURL || null || undefined;

  // url が無い場合は filename から静的配信を推測（/media/<filename>）
  if (!url && file.filename) url = `/media/${file.filename}`;
  if (!url) return undefined;

  // 絶対化して、スペースや日本語を安全に
  const abs = toAbsoluteURL(url);
  return encodeURI(abs);
}

// ==============================
// News 型と map
// ==============================
export type News = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail?: {
    url?: string;
    alt: string;
    width?: number;
    height?: number;
  };
  publishedAt: string | null;
  revisedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  content: any;
  category: any;
  status: string;
};

function mapNewsDoc(d: any): News {
  const tn = d?.thumbnail;
  return {
    id: d.id,
    title: d.title,
    slug: d.slug,
    description: d.excerpt ?? '',
    thumbnail: tn
      ? {
          url: imageUrl(tn), // ← 絶対URLとして返る
          alt: tn.alt ?? '',
          width: tn.width ?? 1200,
          height: tn.height ?? 630,
        }
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

// ==============================
// API 呼び出し（News）
// ==============================
export async function getNewsList(params: {
  limit: number;
  page?: number;
  q?: string;
  category?: string;
}): Promise<{ contents: News[]; totalCount: number }> {
  const { limit, page = 1, q, category } = params;
  const base = getApiBase();
  if (!base) throw new Error('Payload API base URL is not set');

  const sp = new URLSearchParams();
  sp.set('limit', String(limit));
  sp.set('page', String(page));
  sp.set('depth', '1'); // ← Media を展開
  if (q) sp.set('where[title][contains]', q);
  if (category) sp.set('where[category][equals]', category);

  const url = `${base}/news?${sp.toString()}`;
  const res = await fetch(url, { cache: 'no-store' }); // 切り分けのため no-store
  if (!res.ok) throw new Error(`Failed to fetch news list: ${res.status} (${url})`);

  const data = await res.json();
  return {
    contents: (data?.docs ?? []).map(mapNewsDoc),
    totalCount: data?.totalDocs ?? data?.total ?? 0,
  };
}

export async function getNewsDetail(slug: string): Promise<News | null> {
  const base = getApiBase();
  if (!base) throw new Error('Payload API base URL is not set');

  const sp = new URLSearchParams();
  sp.set('where[slug][equals]', slug);
  sp.set('depth', '1');

  const url = `${base}/news?${sp.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch news detail: ${res.status} (${url})`);

  const data = await res.json();
  const doc = (data?.docs ?? [])[0];
  return doc ? mapNewsDoc(doc) : null;
}

// ==============================
// Members 型と map（必要なら使用）
// ==============================
export type Member = {
  id: string;
  name: string;
  position?: string;
  profile?: string;
  image?: {
    url?: string;
    width?: number;
    height?: number;
    alt?: string;
  };
};

function mapMemberDoc(d: any): Member {
  const img = d?.image;
  return {
    id: d.id,
    name: d.name,
    position: d.position ?? '',
    profile: d.profile ?? '',
    image: img
      ? {
          url: imageUrl(img),
          alt: img.alt ?? '',
          width: img.width ?? 400,
          height: img.height ?? 400,
        }
      : undefined,
  };
}

export async function getMembersList(params?: {
  limit?: number;
  page?: number;
}): Promise<{ contents: Member[]; totalCount: number }> {
  const { limit = 100, page = 1 } = params ?? {};
  const base = getApiBase();
  if (!base) throw new Error('Payload API base URL is not set');

  const sp = new URLSearchParams();
  sp.set('limit', String(limit));
  sp.set('page', String(page));
  sp.set('depth', '1');

  const url = `${base}/members?${sp.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch members list: ${res.status} (${url})`);

  const data = await res.json();
  return {
    contents: (data?.docs ?? []).map(mapMemberDoc),
    totalCount: data?.totalDocs ?? data?.total ?? 0,
  };
}
