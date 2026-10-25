import Link from "next/link";
import styles from "@/styles/uiux.module.css";

export default function UIUXNav() {
  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.logo} aria-label="Omkar Kardile homepage">
        OK
      </Link>
      <nav className={styles.primaryNav} aria-label="Main navigation">
        <Link href="/#work" className={styles.primaryNavLink}>Work</Link>
        <Link href="/#skills" className={styles.primaryNavLink}>Skills</Link>
        <Link href="/#experience" className={styles.primaryNavLink}>Experience</Link>
        <Link href="/contact" className={styles.primaryNavLink}>Contact</Link>
      </nav>
      <div className={styles.navActions}>
        <a
          href="https://drive.google.com/file/d/19PxUGcMTALOfNKFbVObd4E0xLKVGGWkZ/view?usp=sharing"
          target="_blank"
          rel="noreferrer"
          className={styles.utilityLink}
        >
          Resume ↗
        </a>
        <a href="mailto:omkarkardileatwork@gmail.com" className={styles.utilityLink}>
          Email ↗
        </a>
      </div>
    </header>
  );
}
