import { notFound } from "next/navigation";
import { getNewsDetail } from "@/app/_libs/microcms";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";

type Props = {
  data: any; // Adjust the type to match your data structure
};

export async function getServerSideProps(context: {
  params: { slug: string };
}) {
  try {
    const data = await getNewsDetail(context.params.slug);
    return { props: { data } };
  } catch (error) {
    return { notFound: true }; // Redirects to the 404 page if the data is not found
  }
}

export default function Page({ data }: Props) {
  return (
    <>
      <Article data={data} />
      <div className={styles.footer}>
        <ButtonLink href="/news">ニュース一覧へ</ButtonLink>
      </div>
    </>
  );
}
