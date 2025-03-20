import { notFound } from "next/navigation";
import { getNewsDetail } from "@/app/_libs/microcms";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";

// Correctly type the params without wrapping in Promise
type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  // No need to resolve params, it's already available
  const { slug } = params;

  // Fetch data based on the resolved slug
  const data = await getNewsDetail(slug).catch(notFound);

  return (
    <>
      <Article data={data} />
      <div className={styles.footer}>
        <ButtonLink href="/news">ニュース一覧へ</ButtonLink>
      </div>
    </>
  );
}
