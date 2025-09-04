// /app/_libs/payload.ts

// ==============================
// 環境変数
// ------------------------------
// 例:
//   NEXT_PUBLIC_PAYLOAD_API=http://localhost:3100/api
//   NEXT_SERVER_PAYLOAD_API=http://payload:3000/api
// ==============================

/** APIベース（.../api の形を想定）を返す。未設定なら null */
function getApiBase(): string | null {
  const pub = process.env.NEXT_PUBLIC_PAYLOAD_API?.replace(/\/$/, '') || null;
  const svr = process.env.NEXT_SERVER_PAYLOAD_API?.replace(/\/$/, '') || null;
  if (typeof window === 'undefined') return svr || pub;
  return pub;
}

/** APIベースから origin（http://host:port 部分）を取り出す */
function getOriginFromApiBase(apiBase: string): string {
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
    if (!apiBase) return input;
    const origin = getOriginFromApiBase(apiBase);
    const p = input.startsWith('/') ? input : `/${input}`;
    return origin + p;
  }
}

/** Payload の file オブジェクトから表示用URLを安全に取り出す */
function imageUrl(file: unknown): string | undefined {
  const f = file as
    | {
        url?: string;
        thumbnailURL?: string;
        filename?: string;
        alt?: string;
        width?: number;
        height?: number;
      }
    | undefined;

  if (!f) return undefined;
  let url: string | undefined = f.url || f.thumbnailURL || undefined;
  if (!url && f.filename) url = `/media/${f.filename}`;
  if (!url) return undefined;
  return encodeURI(toAbsoluteURL(url));
}

// ==============================
// 型
// ==============================
export type Category = {
  id: string;
  title?: string;
  name?: string;
  slug?: string;
};

export type RichTextContent = {
  root: {
    children: {
      children?: { text: string }[];
    }[];
  };
};

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
  content?: string | RichTextContent; // 👈 string または RichText JSON
  category?: Category | null;
  status?: string;
};

// ==============================
// map ユーティリティ
// ==============================
function mapNewsDoc(d: any): News {
  const tn = d?.thumbnail;
  return {
    id: d.id,
    title: d.title,
    // slug が無い記事は id を代用して必ず用意
    slug: d.slug || d?.fields?.slug || d.id,
    description: d.excerpt ?? d.description ?? '',
    thumbnail: tn
      ? {
          url: imageUrl(tn),
          alt: tn.alt ?? '',
          width: tn.width ?? 1200,
          height: tn.height ?? 630,
        }
      : undefined,
    publishedAt: d.publishedDate ?? d.publishedAt ?? d.createdAt ?? d.updatedAt ?? null,
    revisedAt: d.updatedAt ?? null,
    createdAt: d.createdAt ?? null,
    updatedAt: d.updatedAt ?? null,
    content: d.content,
    category: d.category ?? d?.category?.value ?? null,
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
  sp.set('depth', '1'); // Media を展開

  // 検索（title/description/content の OR）
  if (q && q.trim()) {
    sp.set('where[or][0][title][contains]', q);
    sp.set('where[or][1][description][contains]', q);
    sp.set('where[or][2][content][contains]', q);
  }

  if (category) {
    // collection のフィールド名に合わせて調整
    sp.set('where[category][equals]', category);
  }

  const url = `${base}/news?${sp.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });
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
// Members（必要なら使用）
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
