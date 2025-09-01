// /app/_components/Article/index.tsx
import Image from "next/image";
import type { News } from "@/app/_libs/payload";
import styles from "./index.module.css";
import DateComp from "../Date";
import Category from "../Category";

type Props = { data: News };

// URL が二重エンコードされている場合(%2520など)を安全に戻す
function safeDecode(url?: string | null) {
  if (!url) return undefined;
  try {
    // 2回まで decode 試行（%2520 → %20 → ' '）
    const once = decodeURI(url);
    return once.includes("%") ? decodeURI(once) : once;
  } catch {
    return url; // 失敗しても元を返す（最悪でも表示を試みる）
  }
}

export default function Article({ data }: Props) {
  const rawUrl = data.thumbnail?.url;
  const src = safeDecode(rawUrl);

  // width/height が無い場合のフォールバック
  const w = typeof data.thumbnail?.width === "number" ? data.thumbnail!.width! : 1200;
  const h = typeof data.thumbnail?.height === "number" ? data.thumbnail!.height! : 630;

  const hasThumb = !!src;

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
            {/* 幅高が無くても描画できるよう、フォールバック値を渡す */}
            <Image
              src={src!}
              alt={data.thumbnail?.alt || data.title}
              width={w}
              height={h}
              className={styles.image}
              priority
              // 開発中だけ素早く切り分けしたいときは下行を一時的に有効化:
              // unoptimized
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        )}
      </header>

      <section className={styles.body}>
        {typeof data.content === "string" ? (
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
        ) : data.content ? (
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(data.content, null, 2)}
          </pre>
        ) : null}
      </section>
    </article>
  );
}
