import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "@/components/uiux/RevealOnScroll";
import liquidGlassProjects from "@/data/liquidGlassProjects";
import styles from "@/styles/uiux.module.css";

export default function LiquidGlassProjects() {
  return (
    <section className={styles.section} aria-labelledby="liquid-glass-studies-title">
      <RevealOnScroll>
        <div className={styles.sectionHeader}>
          <h2 id="liquid-glass-studies-title" className={styles.sectionTitle}>
            Liquid Glass studies
          </h2>
          <p className={styles.sectionCount}>[ 6 apps ]</p>
        </div>
        <div className={styles.sectionDivider} />
      </RevealOnScroll>

      <div className={styles.glassStudiesGrid}>
        {liquidGlassProjects.map((project, index) => (
          <RevealOnScroll key={project.slug} delay={index * 70}>
            <article
              className={styles.glassStudyCard}
              style={{
                "--project-accent": project.accent,
                "--project-action-text": project.actionText,
              }}
              aria-labelledby={`liquid-glass-${project.slug}-title`}
            >
              <div className={styles.glassStudyMedia}>
                <Image
                  src={`/images/uiux/liquid-glass/${project.slug}-preview.png`}
                  alt={`${project.name} app preview`}
                  fill
                  sizes="(max-width: 760px) 100vw, (max-width: 960px) 90vw, 620px"
                  className={styles.glassStudyImage}
                />
                <span className={styles.glassStudyPreviewLabel}>Interactive redesign</span>
              </div>

              <div className={styles.glassStudyBody}>
                <p className={styles.glassStudyBrand}>{project.name}</p>
                <h3
                  id={`liquid-glass-${project.slug}-title`}
                  className={styles.glassStudyTitle}
                >
                  {project.name} — Liquid Glass redesign
                </h3>
                <p className={styles.glassStudyDescription}>{project.description}</p>
                <p className={styles.glassStudyStat}>
                  {`${project.pages}-page case study`}
                </p>
                <div className={styles.glassStudyActions}>
                  <Link
                    href={`/uiux/apps/${project.slug}`}
                    className={styles.glassStudyOpen}
                    aria-label={`Open the ${project.name} interactive redesign`}
                  >
                    Open app <span aria-hidden="true">→</span>
                  </Link>
                  <a
                    href={`/case-studies/${project.slug}-case-study.pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.glassStudyPdf}
                    aria-label={`Read the ${project.name} case study PDF in a new tab`}
                  >
                    Case study PDF <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
