import styles from "./page.module.css";
import Image from "next/image";
import { getNewsList } from "@/app/_libs/microcms";
import { TOP_NEWS_LIST } from "@/app/_constants";
import NewsList from "@/app/_components/NewsList";
import ButtonLink from "@/app/_components/ButtonLink";

export const revalidate = 60;

export default async function Home() {
  const data = await getNewsList({
    limit: TOP_NEWS_LIST,
  });

  return (
    <>
      <section className={styles.top}>
        <div>
          <h1 className={styles.title}>
            Engineering Reality to Bring Your Visions to Life.
          </h1>
          <p className={styles.description}>
            Our mission is to combine expertise and technology to create
            advanced solutions. Our vision is to turn possibilities into
            reality, inspired by human imagination
          </p>
        </div>
        <Image
          className={styles.bgimg}
          src="/img-mv.jpg"
          alt=""
          width={4000}
          height={1200}
        />
      </section>

      <section className={styles.news}>
        <h2 className={styles.newsTitle}>News</h2>
        <NewsList news={data.contents} />
        <div className={styles.newsLink}>
          <ButtonLink href="/news">LEARN MORE</ButtonLink>
        </div>
      </section>

      <section className={styles.Capa}>
        <h2 className={styles.caseTitle}>Our Capabilities</h2>
      </section>
    </>
  );
}
