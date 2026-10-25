import Link from "next/link";
import SiteShell from "@/components/site-shell";

export const metadata = {
  title: "Contact",
  description: "Contact Omkar Kardile about product design, UI/UX, and frontend development opportunities.",
};

export default function ContactPage() {
  return (
    <SiteShell active="/contact" pageLabel="Contact">
      <section className="portfolio-subpage-hero" aria-labelledby="contact-title">
        <p className="portfolio-eyebrow">Start a conversation</p>
        <h1 id="contact-title">Let&apos;s make<br />something useful.</h1>
        <p className="portfolio-subpage-intro">
          I&apos;m a designer who codes, with experience across UI/UX, web and mobile products. I enjoy turning messy workflows into clear, thoughtful digital experiences and collaborating with teams who care about the details.
        </p>
        <div className="portfolio-contact-options">
          <a href="mailto:omkarkardileatwork@gmail.com" className="portfolio-contact-option">
            <span className="portfolio-eyebrow">Email</span>
            <strong>omkarkardileatwork@gmail.com</strong>
            <span aria-hidden="true">↗</span>
          </a>
          <a href="https://www.linkedin.com/in/omkar-kardile-49501b213/" target="_blank" rel="noreferrer" className="portfolio-contact-option">
            <span className="portfolio-eyebrow">LinkedIn</span>
            <strong>Connect professionally</strong>
            <span aria-hidden="true">↗</span>
          </a>
          <Link href="/uiux" className="portfolio-contact-option">
            <span className="portfolio-eyebrow">Selected work</span>
            <strong>Explore the UI/UX portfolio</strong>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
