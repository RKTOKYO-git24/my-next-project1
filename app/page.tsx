import styles from "./page.module.css";
import Image from "next/image"; // Importing the Image component

export default function Home() {
  return (
    <section className={styles.top}>
      <div>
        <h1 className={styles.title}>テクノロジーの力でを変える</h1>
        <p className={styles.description}>
          私たちは市場をリードしているグローバルテックカンパニーです。
        </p>
      </div>
      <Image
        className={styles.bgimg}
        src="/img-mv.jpg"
        alt="Background image"
        layout="fill" /* Makes the image cover the container */
        objectFit="cover" /* Ensures the image covers the section properly */
        priority /* Optional: loads the image earlier for better LCP */
      />
    </section>
  );
}
