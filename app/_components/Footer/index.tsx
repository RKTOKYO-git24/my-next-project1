import Link from "next/link";
import styles from "./index.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <ul className={styles.items}>
          <li className={styles.item}>
            <Link href="/news">NEWS</Link>
          </li>
          <li className={styles.item}>
            <Link href="/about">ABOUT</Link>
          </li>
          <li className={styles.item}>
            <Link href="/contact">CONTACT</Link>
          </li>
        </ul>
      </nav>
      <p className={styles.cr}>© RYOTKIM.COM All Rights Reserved 2025</p>
    </footer>
  );
}
