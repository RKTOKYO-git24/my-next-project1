import { notFound } from "next/navigation";
import { getNewsDetail } from "@/app/_libs/microcms";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";

// Correctly type the params to use Promise
type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: {
    dk?: string;
  };
};

export default async function Page({ params, searchParams }: Props) {
  // Ensure params is resolved properly as a Promise
  const data = await getNewsDetail((await params).slug, {
    draftKey: searchParams.dk,
  }).catch(notFound);

  return (
    <>
      <Article data={data} />
      <div className={styles.footer}>
        <ButtonLink href="/news">ニュース一覧へ</ButtonLink>
      </div>
    </>
  );
}
