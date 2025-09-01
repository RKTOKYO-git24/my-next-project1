// /app/_components/NewsList/index.tsx
import Image from "next/image";
import Link from "next/link";
import type { News } from "@/app/_libs/payload";
import styles from "./index.module.css";
import Category from "../Category";
import Date from "../Date";

type Props = { news: News[] };

export default function NewsList({ news }: Props) {
  if (!news || news.length === 0) return <p>No Articles yet</p>;

  return (
    <ul>
      {news.map((article) => {
        const t = article.thumbnail;
        // API が返す絶対URL（例: http://localhost:3100/api/media/file/...）
        const src = t?.url ?? undefined;

        const w = typeof t?.width === "number" ? t!.width! : 1200;
        const h = typeof t?.height === "number" ? t!.height! : 630;

        return (
          <li key={article.id} className={styles.list}>
            <Link href={`/news/${article.slug}`} className={styles.link}>
              {src ? (
                <Image
                  src={src}
                  alt={t?.alt || article.title}
                  className={styles.image}
                  width={w}
                  height={h}
                  // まずは確実に表示させるために最適化をオフ
                  // 表示が確認できたらこの行を削除してOK
                  unoptimized
                />
              ) : (
                <Image
                  className={styles.image}
                  src="/no-image.png"
                  alt="No Image"
                  width={1200}
                  height={630}
                />
              )}

              <dl className={styles.content}>
                <dt className={styles.title}>{article.title}</dt>
                <dd className={styles.meta}>
                  <Category category={article.category} />
                  <Date date={article.publishedAt ?? article.createdAt} />
                </dd>
              </dl>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
