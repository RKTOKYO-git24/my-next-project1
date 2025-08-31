// /home/ryotaro/dev/mnp-dw-20250821/app/news/[slug]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsDetail } from "@/app/_libs/payload";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";

// ビルド時フェッチを避けて実行時にAPIを叩く
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type Props = {
  params: { slug: string };
  searchParams?: { dk?: string };
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const draftKey = searchParams?.dk;
  let data: any = null;
  try {
    data = await getNewsDetail(params.slug, draftKey ? { draftKey } : undefined);
  } catch {
    // 取得失敗時は Not Found 相当のメタデータ
  }

  if (!data) {
    return {
      title: "News not found",
      description: "The requested article could not be found.",
      robots: { index: false },
    };
  }

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data?.thumbnail?.url ?? ""],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const draftKey = searchParams?.dk;

  let data: any = null;
  try {
    data = await getNewsDetail(params.slug, draftKey ? { draftKey } : undefined);
  } catch {
    // 無視して notFound() へ
  }

  if (!data) {
    notFound();
  }

  return (
    <>
      <Article data={data} />
      <div className={styles.footer}>
        <ButtonLink href="/news">To News List</ButtonLink>
      </div>
    </>
  );
}
