import { notFound } from "next/navigation";
import { getNewsDetail } from "@/app/_libs/microcms";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";
import { NextPage } from "next";

// Type for the page props
type Props = {
  params: {
    slug: string;
  };
};

const Page: NextPage<Props> = async ({ params }) => {
  // Fetch data based on the slug in params
  const data = await getNewsDetail(params.slug).catch(notFound);

  return (
    <>
      <Article data={data} />
      <div className={styles.footer}>
        <ButtonLink href="/news">ニュース一覧へ</ButtonLink>
      </div>
    </>
  );
};

export default Page;
