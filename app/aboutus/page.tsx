import Image from "next/image";
import { getMembersList } from "../_libs/payload";
import styles from "./page.module.css";

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

export default async function Page() {
  const data = await getMembersList({ limit: 100 });

  if (data.contents.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>About Us</h1>
        <p className={styles.empty}>現在このページは準備中です。</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}> About Us </h1>
        <p className={styles.notice}> Coming Soon... (Dummy Data) </p>
      <ul className={styles.list}>
        {data.contents.map((member: any) => {
          // ✅ 絶対URLをそのまま利用
          const src = safeDecode(member.image?.url);
          const w = typeof member.image?.width === "number" ? member.image.width : 300;
          const h = typeof member.image?.height === "number" ? member.image.height : 300;

          console.log("member.image.url =", member.image?.url);
          console.log("src =", src);

          return (
            <li key={member.id} className={styles.list}>
  <Image
    src={src}
    alt={member.image?.alt || member.name}
    width={320}
    height={320}
    className={styles.image}
    unoptimized
  />
  <div className={styles.meta}>
    <div className={styles.name}>{member.name}</div>
    {member.position && <div className={styles.position}>{member.position}</div>}
    {member.profile && <div className={styles.profile}>{member.profile}</div>}
  </div>
</li>
          );
        })}
      </ul>
    </div>
  );
}
