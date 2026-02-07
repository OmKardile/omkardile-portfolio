import Link from "next/link";
import SiteShell from "@/components/site-shell";

export default function ResumePage() {
  return (
    <SiteShell active="/resume" pageLabel="Portfolio \\  Resume">
      <section className="section-frame single-column">
        <p className="long-copy">
          Computer Engineering graduate with strong hands-on experience in
          full-stack web development and UI/UX design. Proficient in React,
          Next.js, Node.js, Express.js, Firebase, and OpenAI APIs, with
          practical project experience across web and mobile platforms.
          Recently completed the PG-DMC (Post Graduate Diploma in Mobile
          Computing) course at SunBeam Infotech, Pune (Authorized Training
          Centre of C-DAC ACTS), where my major project was an Online Car
          Service Station solution featuring a hybrid mobile app and a React
          admin web panel.
        </p>
        <p></p>
        <a
          href="https://framerusercontent.com/assets/zrr2Nb36VBJtJEBqr4FE77VG4.pdf"
          target="_blank"
          rel="noreferrer"
          className="button-link"
        >
          Download My Resume
        </a>
        <p className="thanks-link">
          <span>Thank You</span>
        </p>
      </section>
    </SiteShell>
  );
}
