import styles from "@/styles/uiux.module.css";
import RevealOnScroll from "@/components/uiux/RevealOnScroll";

export default function UIUXFooter() {
  return (
    <RevealOnScroll>
      <section className={styles.ctaSection}>
        <p className={styles.ctaEyebrow}>Let&apos;s work together.</p>
        <div className={styles.sectionDivider} />
        <p className={styles.ctaText}>
          Have a project? I&apos;m available for UI/UX design and frontend roles.
        </p>
        <div className={styles.ctaActions}>
          <a
            href="mailto:omkarkardileatwork@gmail.com"
            className={styles.ctaButton}
          >
            <span>Send an email</span>
          </a>
          <a
            href="https://www.linkedin.com/in/omkar-kardile-49501b213/"
            target="_blank"
            rel="noreferrer"
            className={styles.ctaButton}
          >
            <span>Connect on LinkedIn</span>
          </a>
        </div>
      </section>
      <footer className={styles.footer}>
        Omkar Kardile © 2026 — Designed with intention, built with React
      </footer>
    </RevealOnScroll>
  );
}
