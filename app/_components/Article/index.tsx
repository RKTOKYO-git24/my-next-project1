// /app/_components/Article/index.tsx
import Image from "next/image";
import type { News } from "@/app/_libs/payload";
import type { RichTextContent } from "@/app/_libs/payload";
import styles from "./index.module.css";
import DateComp from "../Date";
import Category from "../Category";

type Props = { data: News };

// 型ガード関数
function isRichText(content: unknown): content is RichTextContent {
  return typeof content === "object" && content !== null && "root" in content;
}

// Category が要求する型に合わせて正規化（name を必ず用意）
function toCategoryProp(
  cat: News["category"]
): string | { name: string; slug?: string } | undefined {
  if (!cat) return undefined;
  if (typeof cat === "string") return cat;
  const name = cat.name ?? cat.title ?? cat.slug;
  if (!name) return undefined;
  return { name, slug: cat.slug };
}

// URL が二重エンコードされている場合(%2520など)を安全に戻す
function safeDecode(url?: string | null) {
  if (!url) return undefined;
  try {
    const once = decodeURI(url);
    return once.includes("%") ? decodeURI(once) : once;
  } catch {
    return url;
  }
}

export default function Article({ data }: Props) {
  
  const rawUrl = data.thumbnail?.url;
  const src = safeDecode(rawUrl);

  // width/height が無い場合のフォールバック
  const w = typeof data.thumbnail?.width === "number" ? data.thumbnail!.width! : 1200;
  const h = typeof data.thumbnail?.height === "number" ? data.thumbnail!.height! : 630;

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

        {hasThumb && (
          <div className={styles.cover}>
            <Image
              src={src!}
              alt={data.thumbnail?.alt || data.title}
              width={w}
              height={h}
              className={styles.image}
              priority
              // 開発中だけ素早く切り分けしたいときは一時的に有効化:
              // unoptimized
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        )}
      </header>

     <section className={styles.body}>
  {typeof data.content === "string" ? (
    <div dangerouslySetInnerHTML={{ __html: data.content }} />
  ) : isRichText(data.content) ? (
    <div>
      {data.content.root.children
        .map((child) =>
          child.children?.map((c) => c.text).join(" ")
        )
        .join("\n")}
    </div>
  ) : null}
</section>
    </article>
  );
}
