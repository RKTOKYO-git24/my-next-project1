// /app/_components/NewsList/index.tsx
import Image from "next/image";
import Link from "next/link";
import type { News } from "@/app/_libs/payload";
import styles from "./index.module.css";
import Category from "../Category";
import Date from "../Date";

type Props = { news: News[] };

export default function NewsList({ news }: Props) {
  if (news.length === 0) return <p>No Articles yet</p>;

  return (
    <ul>
      {news.map((article) => {
        const hasThumb =
          !!article.thumbnail?.url &&
          typeof article.thumbnail?.width === "number" &&
          typeof article.thumbnail?.height === "number";

        return (
          <li key={article.id} className={styles.list}>
            <Link href={`/news/${article.slug}`} className={styles.link}>
              {hasThumb ? (
                <Image
                  src={article.thumbnail!.url!}
                  alt={article.thumbnail!.alt || article.title}
                  className={styles.image}
                  width={article.thumbnail!.width!}
                  height={article.thumbnail!.height!}
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
