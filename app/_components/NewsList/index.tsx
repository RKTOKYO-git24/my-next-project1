// /app/_components/NewsList/index.tsx
import Image from "next/image";
import Link from "next/link";
import type { News } from "@/app/_libs/payload";
import styles from "./index.module.css";
import Category from "../Category";
import Date from "../Date";

type Props = { news: News[] };

// Category コンポーネントが要求する形に整形
function toCategoryProp(cat: News["category"]):
  | string
  | { name: string; slug?: string }
  | undefined {
  if (!cat) return undefined;
  if (typeof cat === "string") return cat;

  const name = cat.name ?? cat.title ?? cat.slug;
  if (!name) return undefined;
  return { name, slug: cat.slug };
}

export default function NewsList({ news }: Props) {
  if (!news || news.length === 0) return <p>No Articles yet</p>;

  return (
    <ul>
      {news.map((article) => {
        const t = article.thumbnail;
        const src = t?.url ?? undefined;

        const w = typeof t?.width === "number" ? t!.width! : 1200;
        const h = typeof t?.height === "number" ? t!.height! : 630;

        const categoryProp = toCategoryProp(article.category);

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
                  {categoryProp && <Category category={categoryProp} />}
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
