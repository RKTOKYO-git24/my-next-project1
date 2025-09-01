// /home/ryotaro/dev/mnp-dw-20250821/app/page.tsx
import Image from "next/image";
import styles from "./page.module.css";
import { getNewsList } from "@/app/_libs/payload"; // ✅ ← ここを修正
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
      {/* ✅ 背景画像：固定配置で header の背後にも表示 */}
      <div className={styles.bgimgWrapper}>
        <Image
          src="/img-mv.jpg"
          alt="Background"
          fill
          priority
          className={styles.bgimg}
        />
      </div>

      {/* ✅ Hero セクション */}
      <section className={styles.top}>
        <div className={styles.topContent}>
          <h1 className={styles.title}>
            Engineering Reality to Bring Your Visions to Life.
          </h1>
          <p className={styles.description}>
            Our mission is to combine expertise and technology to create
            advanced solutions. Our vision is to turn possibilities into
            reality, inspired by human imagination.
          </p>
        </div>
      </section>

      {/* News セクション */}
      <section className={styles.news}>
        <h2 className={styles.newsTitle}>News</h2>
        <NewsList news={data.contents} />
        <div className={styles.newsLink}>
          <ButtonLink href="/news">LEARN MORE</ButtonLink>
        </div>
      </section>

      {/* Capabilities セクション */}
      <section className={styles.Capa}>
        <h2 className={styles.caseTitle}>Our Capabilities</h2>
      </section>
    </>
  );
}
