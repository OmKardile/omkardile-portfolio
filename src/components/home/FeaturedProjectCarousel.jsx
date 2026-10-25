"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import liquidGlassProjects from "@/data/liquidGlassProjects";

export default function FeaturedProjectCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const project = liquidGlassProjects[activeIndex];
  const showPrevious = () => {
    setActiveIndex((index) => (index - 1 + liquidGlassProjects.length) % liquidGlassProjects.length);
  };
  const showNext = () => {
    setActiveIndex((index) => (index + 1) % liquidGlassProjects.length);
  };

  return (
    <section className="portfolio-feature" aria-label="Featured interactive redesign">
      <Link
        href={`/uiux/apps/${project.slug}`}
        className="portfolio-feature-preview"
        aria-label={`Open the ${project.name} Liquid Glass redesign`}
      >
        <Image
          key={project.slug}
          src={`/images/uiux/liquid-glass/${project.slug}-preview.png`}
          alt={`${project.name} interactive app preview`}
          fill
          priority
          sizes="(max-width: 800px) 100vw, (max-width: 1200px) 60vw, 58vw"
          className="portfolio-feature-image"
        />
        <span className="portfolio-feature-image-label">Interactive redesign · {project.name}</span>
      </Link>

      <aside className="portfolio-feature-meta" aria-live="polite">
        <p className="portfolio-feature-categories">Interfaces<br />Ideas<br />Products<br />People</p>
        <div className="portfolio-feature-current">
          <span className="portfolio-feature-rule" style={{ backgroundColor: project.accent }} />
          <p className="portfolio-feature-count">
            {String(activeIndex + 1).padStart(2, "0")} <span>/ {String(liquidGlassProjects.length).padStart(2, "0")}</span>
          </p>
          <h2>{project.name}</h2>
          <p className="portfolio-feature-subtitle">Liquid Glass redesign</p>
          <Link className="portfolio-feature-open" href={`/uiux/apps/${project.slug}`}>
            Explore app <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="portfolio-feature-controls" aria-label="Choose featured project">
          <button type="button" onClick={showPrevious} aria-label="Previous featured project">←</button>
          <div className="portfolio-feature-dots">
            {liquidGlassProjects.map((item, index) => (
              <button
                type="button"
                key={item.slug}
                aria-label={`Show ${item.name}`}
                aria-pressed={index === activeIndex}
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <button type="button" onClick={showNext} aria-label="Next featured project">→</button>
        </div>
      </aside>
    </section>
  );
}
