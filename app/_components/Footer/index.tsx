import Link from "next/link";
import styles from "./index.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <ul className={styles.items}>
          <li className={styles.item}>
            <Link href="/news">News</Link>
          </li>
          <li className={styles.item}>
            <Link href="/aboutus">About Us</Link>
          </li>
          <li className={styles.item}>
            <Link href="/contact">Contact Us</Link>
          </li>
        </ul>
      </nav>
      <p className={styles.cr}>© SNA-KIMURA. All Rights Reserved 2025</p>
    </footer>
  );
}
