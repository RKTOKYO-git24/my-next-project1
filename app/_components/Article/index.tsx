import Image from "next/image";
import type { News } from "lib/payload";
import styles from "./index.module.css";
import DateComp from "../Date";
import Category from "../Category";
import ReactMarkdown from "react-markdown";
import { RichText } from "@payloadcms/richtext-lexical/react";

type Props = { data: News };

function toCategoryProp(
  cat: News["category"]
): string | { name: string; slug?: string } | undefined {
  if (!cat) return undefined;
  if (typeof cat === "string") return cat;
  const name = cat.name ?? cat.title ?? cat.slug;
  if (!name) return undefined;
  return { name, slug: cat.slug };
}

export default function Article({ data }: Props) {
  const t = data.thumbnail;
  const src = t?.url ?? undefined;

  const w = typeof t?.width === "number" ? t.width : 1200;
  const h = typeof t?.height === "number" ? t.height : 630;

  const hasThumb = !!src;
  const categoryProp = toCategoryProp(data.category);

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>{data.title}</h1>
        <div className={styles.meta}>
          {categoryProp && <Category category={categoryProp} />}
          <DateComp date={data.publishedAt ?? data.createdAt} />
        </div>

        {hasThumb ? (
          <div className={styles.cover}>
            <Image
              src={src}
              alt={t?.alt || data.title}
              width={w}
              height={h}
              className={styles.image}
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              unoptimized
            />
          </div>
        ) : (
          <div className={styles.cover}>
            <Image
              className={styles.image}
              src="/no-image.png"
              alt="No Image"
              width={1200}
              height={630}
              unoptimized
            />
          </div>
        )}
      </header>

      {/* ✅ 本文を RichText or Markdown として描画 */}
      <section className={styles.body}>
        {typeof data.content === "string" ? (
          <ReactMarkdown>{data.content}</ReactMarkdown>
        ) : (
          <RichText data={data.content as any} />
        )}
      </section>
    </article>
  );
}
