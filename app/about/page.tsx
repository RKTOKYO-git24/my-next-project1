import Image from "next/image";
import { getMembersList } from "lib/payload";
import styles from "./page.module.css";

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
        <h1 className={styles.title}>About</h1>
        <p className={styles.notice}>現在このページは準備中です。</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About</h1>
      <p className={styles.notice}>Coming Soon... (Dummy Data)</p>

      <ul className={styles.list}>
        {data.contents.map((member: any) => {
          const src = safeDecode(member.image?.url);

          return (
            <li key={member.id} className={styles.item}>
              {src && (
                <Image
                  src={src}
                  alt={member.image?.alt || member.name}
                  width={320}
                  height={320}
                  className={styles.image}
                  unoptimized
                />
              )}
              <div className={styles.meta}>
                <div className={styles.name}>{member.name}</div>
                {member.position && (
                  <div className={styles.position}>{member.position}</div>
                )}
                {member.profile && (
                  <div className={styles.profile}>{member.profile}</div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
