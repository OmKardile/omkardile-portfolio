import Link from "next/link";
import Script from "next/script";
import SiteShell from "@/components/site-shell";

export default function ContactPage() {
  return (
    <SiteShell active="/contact" pageLabel="Portfolio \\  Contact">
      <section className="section-frame single-frame">
        <div className="contact-copy">
          <p className="long-copy">
            I&apos;m a Omkar Kardile, A Computer Engineering student who loves
            bringing great digital experiences to life. With practical
            experience in Figma and Framer, I enjoy crafting clean user
            interfaces and turning them into working apps and websites. Having
            built several web and mobile projects, I&apos;m comfortable working
            across Android and iOS platforms. I&apos;m looking to join a team
            where I can blend my UI/UX design skills with app development to
            create products that users will love.
          </p>
          <p></p>
          <p className="thanks-link">
            <span>
              My Mail :{" "}
              <a href="mailto:omkardile84@gmail.com">omkardile84@gmail.com</a>
            </span>
          </p>
        </div>
        {/* <div className="form-frame">
          <div data-tf-live="01K019HVH755Q4XZNQ12RGF9TB" className="typeform-live" />
          <Script src="//embed.typeform.com/next/embed.js" strategy="lazyOnload" />
        </div> */}
        <div className="thanks-link">
          <h3>Thank You for Visiting ! Have a great day ahead.</h3>
        </div>
      </section>
    </SiteShell>
  );
}
