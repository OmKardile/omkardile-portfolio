import Link from "next/link";
import SiteShell from "@/components/site-shell";

const resumeUrl = "https://drive.google.com/file/d/19PxUGcMTALOfNKFbVObd4E0xLKVGGWkZ/view?usp=sharing";

export const metadata = {
  title: "Resume",
  description: "Resume and professional background for Omkar Kardile, developer and UI/UX designer.",
};

export default function ResumePage() {
  return (
    <SiteShell active="/resume" pageLabel="Resume">
      <section className="portfolio-subpage-hero portfolio-resume-hero" aria-labelledby="resume-title">
        <p className="portfolio-eyebrow">Experience &amp; background</p>
        <h1 id="resume-title">Design-minded<br />developer.</h1>
        <p className="portfolio-subpage-intro">
          Computer Engineering graduate with hands-on experience in full-stack web development and UI/UX design. My work spans React, Next.js, Node.js, Express, Firebase, OpenAI APIs, and web and mobile product experiences.
        </p>
        <p className="portfolio-subpage-intro">
          I completed the PG-DMC (Post Graduate Diploma in Mobile Computing) course at SunBeam Infotech, Pune (an authorized training centre of C-DAC ACTS). My major project was an Online Car Service Station solution featuring a hybrid mobile app and a React admin web panel.
        </p>
        <div className="portfolio-hero-actions">
          <a href={resumeUrl} target="_blank" rel="noreferrer" className="portfolio-primary-button">Open resume <span aria-hidden="true">↗</span></a>
          <Link href="/" className="portfolio-text-link">Back to home <span aria-hidden="true">⟶</span></Link>
        </div>
      </section>
    </SiteShell>
  );
}
