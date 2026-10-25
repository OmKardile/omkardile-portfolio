import styles from "@/styles/uiux.module.css";
import RevealOnScroll from "@/components/uiux/RevealOnScroll";

export default function ProjectCard({ project, delay = 0 }) {
  return (
    <RevealOnScroll delay={delay}>
      <article
        className={styles.projectCard}
        style={{ "--project-accent": project.accent }}
      >
        <div className={styles.projectLeft}>
          <div className={styles.projectHeading}>
            <span className={styles.projectId}>{project.id}</span>
            <div>
              <div className={styles.projectTitleRow}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <span className={styles.projectStatus}>{project.status}</span>
              </div>
              <p className={styles.projectTagline}>{project.tagline}</p>
            </div>
          </div>
        </div>

        <div className={styles.projectRight}>
          <p className={styles.projectProblem}>
            <span>Problem:</span> {project.problem}
          </p>
          <p className={styles.projectMetaLine}>
            <span>My role:</span> {project.role.join(" · ")}
          </p>
          <div className={styles.toolRow}>
            <span className={styles.projectMetaLabel}>Tools:</span>
            <div className={styles.toolList}>
              {project.tools.map((tool) => (
                <span key={tool} className={styles.toolPill}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.linkRow}>
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href === "#" ? undefined : "_blank"}
                rel={link.href === "#" ? undefined : "noreferrer"}
                className={styles.projectLink}
              >
                {link.label} →
              </a>
            ))}
          </div>
        </div>
      </article>
    </RevealOnScroll>
  );
}
