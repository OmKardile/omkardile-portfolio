import UIUXNav from "@/components/uiux/UIUXNav";
import UIUXHero from "@/components/uiux/UIUXHero";
import ProjectCard from "@/components/uiux/ProjectCard";
import LiquidGlassProjects from "@/components/uiux/LiquidGlassProjects";
import UIUXFooter from "@/components/uiux/UIUXFooter";
import RevealOnScroll from "@/components/uiux/RevealOnScroll";
import { shippedProjects, uiuxProjects } from "@/data/uiuxProjects";
import styles from "@/styles/uiux.module.css";

const principles = [
  {
    id: "01",
    title: "Research first",
    description: "Every decision starts with a real user problem.",
  },
  {
    id: "02",
    title: "Design in systems",
    description: "Components, not screens. Consistency at scale.",
  },
  {
    id: "03",
    title: "Ship it",
    description: "Figma files don't ship. Code does.",
  },
];

export default function UIUXPortfolioPage() {
  return (
    <div className={styles.page}>
      <UIUXNav />
      <main className={styles.main}>
        <UIUXHero />

        <RevealOnScroll>
          <section className={styles.principlesStrip}>
            {principles.map((item) => (
              <article key={item.id} className={styles.principleItem}>
                <p className={styles.principleId}>{item.id} —</p>
                <h2 className={styles.principleTitle}>{item.title}</h2>
                <p className={styles.principleDescription}>{item.description}</p>
              </article>
            ))}
          </section>
        </RevealOnScroll>

        <section className={styles.section}>
          <RevealOnScroll>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionNumber}>01</span>
                <h2 className={styles.sectionTitle}>Selected Work</h2>
              </div>
              <p className={styles.sectionCount}>[ 3 projects ]</p>
            </div>
            <div className={styles.sectionDivider} />
          </RevealOnScroll>
          <div className={styles.projectsList}>
            {uiuxProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                delay={index * 90}
              />
            ))}
          </div>
        </section>

        <LiquidGlassProjects />

        <section className={styles.section}>
          <RevealOnScroll>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionNumber}>02</span>
                <h2 className={styles.sectionTitle}>Also shipped</h2>
              </div>
            </div>
            <div className={styles.sectionDivider} />
          </RevealOnScroll>
          <div className={styles.shippedGrid}>
            {shippedProjects.map((project, index) => (
              <RevealOnScroll key={project.name} delay={index * 80}>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.shippedItem}
                >
                  <span className={styles.shippedName}>{project.name}</span>
                  <span className={styles.shippedStack}>{project.stack}</span>
                  <span className={styles.shippedLink}>
                    {project.href.replace(/^https?:\/\//, "")}
                  </span>
                </a>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <RevealOnScroll>
            <div className={styles.aboutStrip}>
              <div className={styles.aboutLeft}>
                <span className={styles.sectionNumber}>03</span>
                <h2 className={styles.sectionTitle}>About</h2>
                <div className={styles.aboutDetails}>
                  <p>Omkar Kardile</p>
                  <p>Pune, Maharashtra</p>
                  <p>PG-DMC, SunBeam Infotech (C-DAC)</p>
                  <p>B.Tech, D.Y. Patil Engineering</p>
                  <p>1 year UI/UX at SWAAS TECHNO</p>
                  <p>Hybrid developer + designer</p>
                </div>
              </div>
              <div className={styles.aboutRight}>
                <p>
                  I&apos;m a designer who codes — which means I design things
                  that can actually be built, and I build things that were
                  actually designed.
                </p>
                {/* <p>
                  Currently seeking UI/UX Designer or Frontend + UX hybrid roles
                  in Pune.
                </p> */}
              </div>
            </div>
          </RevealOnScroll>
        </section>

        <UIUXFooter />
      </main>
    </div>
  );
}
