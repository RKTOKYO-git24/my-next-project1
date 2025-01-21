import Image from "next/image";
import styles from "./page.module.css";
import { getMemberList } from "../_libs/microcms";

export default async function Page() {
  const data = await getMemberList();
  return (
    <div className={styles.container}>
      {data.contents.length === 0 ? (
        <p className={styles.empty}>メンバーが登録されていません。</p>
      ) : (
        <ul>
          {data.contents.map((member) => (
            <li key={member.id} className={styles.list}>
              <Image
                src={member.image.url}
                alt=""
                width={member.image.width}
                height={member.image.height}
                className={styles.image}
              />
              <dl>
                <dt className={styles.name}>{member.name}</dt>
                <dt className={styles.position}>{member.position}</dt>
                <dt className={styles.position}>{member.profile}</dt>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
