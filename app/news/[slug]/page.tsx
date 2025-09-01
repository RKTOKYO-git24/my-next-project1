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
};

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  let data: any = null;
  try {
    data = await getNewsDetail(params.slug);
  } catch {
    // 無視して notFound()へ

  }

  if (!data) {
    notFound();
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

export default async function Page({ params }: Props) {

  let data: any = null;
  try {
    data = await getNewsDetail(params.slug);
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
