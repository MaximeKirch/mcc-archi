import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { siteConfig } from "#/config/site.ts";
import { gsap, useGSAP } from "#/lib/gsap.ts";
import { PageNav } from "#/components/page/PageNav.tsx";
import { ContactHero } from "#/components/contact/ContactHero.tsx";
import { ContactDetails } from "#/components/contact/ContactDetails.tsx";

export const Route = createFileRoute("/contact")({
  component: ContactComponent,
});

function ContactComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".js-contact-title span", {
        y: "100%",
        duration: 1.2,
        stagger: 0.1,
      })
        .from(
          ".js-contact-line",
          {
            scaleY: 0,
            transformOrigin: "top center",
            duration: 1.4,
            ease: "power3.inOut",
          },
          "-=0.8",
        )
        .from(
          ".js-contact-details",
          {
            opacity: 0,
            x: 30,
            duration: 1,
            stagger: 0.15,
          },
          "-=0.6",
        );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased flex flex-col justify-between"
    >
      <PageNav backLabel="Portfolio" rightLabel="Studio" />

      <main className="max-w-7xl w-full mx-auto px-6 py-12 md:py-24 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-stretch">
          <ContactHero />
          <div className="hidden lg:block w-[1px] bg-neutral-200 js-contact-line self-stretch" />
          <ContactDetails />
        </div>
      </main>

      <footer className="max-w-7xl w-full mx-auto border-t border-neutral-200/60 px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-neutral-400">
        <div>© {new Date().getFullYear()} — {siteConfig.name}.</div>
        <div className="flex gap-6">
          <a
            href="https://www.instagram.com/mcc_architecture/"
            target="_blank"
            className="hover:text-neutral-900 transition-colors"
          >
            INSTAGRAM
          </a>
          <a
            href="https://www.linkedin.com/in/marie-coulombon-casanova/"
            target="_blank"
            className="hover:text-neutral-900 transition-colors"
          >
            LINKEDIN
          </a>
        </div>
      </footer>
    </div>
  );
}
