import Link from "next/link";
import styles from "@/styles/uiux.module.css";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
      <path
        d="M3 6.75h18v10.5H3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m4 7.5 8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
      <path
        d="M7 9.5V18M7 6.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM11 18v-8.5h3v1.4c.6-1 1.6-1.7 3.1-1.7 2.6 0 3.9 1.7 3.9 4.8V18h-3v-3.7c0-1.6-.6-2.4-1.8-2.4-1.3 0-2.2.9-2.2 2.4V18Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function UIUXNav() {
  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.backLink}>
        <span aria-hidden="true">←</span>
        <span>Portfolio</span>
      </Link>
      <p className={styles.navTitle}>Omkar Kardile — Design</p>
      <div className={styles.navActions}>
        <a
          href="mailto:omkarkardileatwork@gmail.com"
          aria-label="Send email"
          className={styles.iconButton}
        >
          <MailIcon />
        </a>
        <a
          href="https://www.linkedin.com/in/omkar-kardile-49501b213/"
          target="_blank"
          rel="noreferrer"
          aria-label="Open LinkedIn"
          className={styles.iconButton}
        >
          <LinkedInIcon />
        </a>
      </div>
    </header>
  );
}
