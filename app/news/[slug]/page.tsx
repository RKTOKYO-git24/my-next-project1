import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsDetail } from "@/app/_libs/payload";
// import { getNewsDetail } from "@/app/_libs/microcms";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    dk?: string;
  }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
//  const data = await getNewsDetail((await params).slug, {
//    draftKey: (await searchParams).dk,
//  });

  const data = await getNewsDetail((await params).slug);

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
//  const data = await getNewsDetail((await params).slug, {
//    draftKey: (await searchParams).dk,
//  }).catch(notFound);

  const data = await getNewsDetail((await params).slug);

  return (
    <>
      <Article data={data} />
      <div className={styles.footer}>
        <ButtonLink href="/news">To News List</ButtonLink>
      </div>
    </>
  );
}
