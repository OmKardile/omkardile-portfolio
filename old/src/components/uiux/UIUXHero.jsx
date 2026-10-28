import styles from "@/styles/uiux.module.css";
import RevealOnScroll from "@/components/uiux/RevealOnScroll";

export default function UIUXHero() {
  return (
    <RevealOnScroll>
      <section className={styles.hero}>
        <div className={styles.heroMeta}>
          <span className={styles.availabilityBadge}>↗ Available for work</span>
        </div>
        <div className={styles.heroGrid}>
          <div className={styles.heroNameBlock}>
            <h1 className={styles.heroName}>OMKAR</h1>
            <h1 className={styles.heroName}>KARDILE</h1>
          </div>
          <div className={styles.heroCopyBlock}>
            <div className={styles.heroLine} />
            <div>
              <p className={styles.heroRole}>UI/UX Designer & Frontend Developer</p>
              <p className={styles.heroLocation}>Pune, Maharashtra · Open to remote</p>
              <p className={styles.heroStatement}>
                I design interfaces that are honest, Then I build them.
              </p>
            </div>
          </div>
        </div>
      </section>
    </RevealOnScroll>
  );
}
