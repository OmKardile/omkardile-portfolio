import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/site-shell";

export default function Home() {
  const projectCards = [
    {
      title: "Online Car Service Station (CDAC PG-DMC Major Project)",
      description:
        "Major project completed during PG-DMC at SunBeam Infotech. Built as a hybrid mobile app for service booking and tracking, along with a React-based admin panel for operations.",
      action: "View Implementation",
      actionHref:"https://cdacadminpanel.vercel.app/login",
      stack:
        "React.js, Hybrid Mobile App Stack, Admin Workflows, Service Management",
    },
    {
      title: "Weather App with Next.js and OpenWeatherMap API",
      description:
        "A simple weather app that fetches real-time data by city name and shows temperature, humidity, and conditions.",
      action: "View Implementation",
      actionHref: "https://weather-nextjs-omkarkardile.vercel.app/",
      stack: "Next.js, TailwindCSS, Axios, OpenWeatherMap API",
    },
    {
      title: "Recipe Generator with React and OpenAI",
      description:
        "Generates recipes from available ingredients and preferences using OpenAI models in an interactive UI.",
      action: "View Implementation",
      actionHref: "https://recipe-generator-omkardile.vercel.app/",
      stack: "React.js, Node.js, Express.js, OpenAI (GPT-4)",
    },
    {
      title: "Full Stack Food Ordering App",
      description:
        "A food ordering platform with menu browsing, order placement, and delivery tracking.",
      action: "App Under Development",
      stack: "Next.js, MongoDB, etc",
    },
    {
      title: "Real-time Chat App with Firebase and React Native",
      description:
        "A mobile chat app with authentication and real-time messaging across devices.",
      action: "App Under Development",
      stack: "React Native, TailwindCSS, Firebase",
    },
  ];

  const skillChips = [
    "UX Design",
    "UI Design",
    "Product Design",
    "React.js",
    "Next.js",
    "Node.js",
    "Express.js",
    "React Native",
    "Native Android",
    "Native iOS",
    "SQL",
    // "Firebase",
    "OpenAI APIs",
    "Consulting",
    "Design Systems",
    "Railway",
    "Design Sprint",
    "Interaction Design",
    "User Testing",
    "Usability Testing",
    "UX Research",
    "Leadership",
    "Mentoring",
    "No-Code/Low-code Quick Landing Site",
    "+ & More to learn",
  ];

  const experience = [
    {
      role: "PG-DMC (Mobile Computing) - Completed",
      company: "SunBeam Infotech, Pune (Authorized Training Centre of C-DAC ACTS)",
      period: "Latest",
    },
    {
      role: "Web Design Intern",
      company: "Arrow Technologies, Nashik",
      period: "Jan 2023 - Jan 2024",
    },
    {
      role: "UI/UX Designer",
      company: "SWAAS TECHNO, Khardi",
      period: "Jan 2024 - Jan 2025",
    },
    {
      role: "Virtual Intern",
      company: "Bharat Technologies",
      period: "Aug 2023 - Dec 2023",
    },
  ];

  return (
    <SiteShell active="/" pageLabel="Portfolio \\  Home">
      <section className="hero section-frame">
        <p className="mobile-message">
          You are viewing responsive phone version of site. Best Viewed on
          Desktop.
        </p>
        <div className="hero-grid">
          <div>
            <h1 className="hero-title">Omkar Kardile</h1>
            <p className="hero-copy">
              Aspiring full-stack developer and UI/UX designer focused on
              building production-ready web and mobile apps. Recently completed
              PG-DMC (Mobile Computing) from SunBeam Infotech, Pune.
            </p>
            <div className="quick-links">
              <Link href="/resume" className="button-link">
                Resume
              </Link>
              <Link href="/contact" className="button-link ghost">
                Contact
              </Link>
            </div>
          </div>
          <div className="quote-card">
            <p>
              &quot;Design is not just what it looks like and feels like.
              Design is how it works.&quot;
            </p>
            <span>- Steve Jobs</span>
          </div>
        </div>
      </section>

      <section className="section-frame">
        <h2>Tech Stack</h2>
        <p className="section-note">Basically what I work on</p>
        <div className="stack-grid">
          <article className="stack-card">Websites</article>
          <article className="stack-card">Mobile Apps</article>
          <article className="stack-card">User Experiences</article>
          <article className="stack-card">Graphics</article>
        </div>
      </section>

      <section className="section-frame">
        <h2>Skills</h2>
        <p className="section-note">tech I work with</p>
        <div className="chip-grid">
          {skillChips.map((skill) => (
            <span key={skill} className="skill-chip">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="section-frame">
        <h2>Projects</h2>
        <div className="projects-grid">
          {projectCards.map((project) => (
            <article key={project.title} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p className="stack">{project.stack}</p>
              {project.actionHref ? (
                <a
                  className="card-action"
                  href={project.actionHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.action}
                </a>
              ) : (
                <button type="button" className="card-action">
                  {project.action}
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="section-frame">
        <h2>Experience</h2>
        <div className="timeline">
          {experience.map((item) => (
            <article key={item.role} className="timeline-item">
              <h3>{item.role}</h3>
              <p>{item.company}</p>
              <span>{item.period}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-frame socials-frame">
        <h2>Socials</h2>
        <div className="social-links timeline-item">
          <a
            className="social-action"
            href="https://github.com/OmKardile"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
          <a
            className="social-action"
            href="https://www.linkedin.com/in/omkar-kardile-49501b213/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </section>
      <section className="site-footer">
        <p className="thanks-text">Omkar Kardile &copy; 2026</p>
        <Image
          className="footer-logo"
          src="https://framerusercontent.com/images/FE3jfepwoFTWfjGchDLen1bo.svg"
          alt="Omkar Kardile logo"
          width={240}
          height={81}
        />
      </section>
    </SiteShell>
  );
}
