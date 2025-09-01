// /app/_components/Article/index.tsx
import Image from "next/image";
import type { News } from "@/app/_libs/payload";
import styles from "./index.module.css";
import DateComp from "../Date";
import Category from "../Category";

type Props = { data: News };

export default function Article({ data }: Props) {
  const hasThumb =
    !!data.thumbnail?.url &&
    typeof data.thumbnail?.width === "number" &&
    typeof data.thumbnail?.height === "number";

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>{data.title}</h1>
        <div className={styles.meta}>
          <Category category={data.category} />
          <DateComp date={data.publishedAt ?? data.createdAt} />
        </div>
        {hasThumb && (
          <div className={styles.cover}>
            <Image
              src={data.thumbnail!.url!}
              alt={data.thumbnail!.alt || data.title}
              width={data.thumbnail!.width!}
              height={data.thumbnail!.height!}
              className={styles.image}
              priority
            />
          </div>
        )}
      </header>

      <section className={styles.body}>
        {/* Payload の content は richText(Lexical) である可能性が高い */}
        {typeof data.content === "string" ? (
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
        ) : data.content ? (
          // まずは暫定表示（Lexicalレンダラ未導入の場合）
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(data.content, null, 2)}
          </pre>
          // 本格表示したい場合は @payloadcms/richtext-lexical/react を導入し、
          // import { RichText } from "@payloadcms/richtext-lexical/react";
          // <RichText data={data.content} />
        ) : null}
      </section>
    </article>
  );
}
