import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { siteConfig } from "#/config/site.ts";
import { gsap, prefersReducedMotion, useGSAP } from "#/lib/gsap.ts";
import { seoMeta } from "#/lib/seo.ts";
import { PageNav } from "#/components/page/PageNav.tsx";
import { SiteFooter } from "#/components/page/SiteFooter.tsx";
import { ContactHero } from "#/components/contact/ContactHero.tsx";
import { ContactDetails } from "#/components/contact/ContactDetails.tsx";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: seoMeta(undefined, { title: `Contact | ${siteConfig.name}` }) }),
  component: ContactComponent,
});

function ContactComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
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
      <PageNav backLabel="Accueil" rightLabel="Contact" />

      <main className="max-w-7xl w-full mx-auto px-6 py-12 md:py-24 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-stretch">
          <ContactHero />
          <div className="hidden lg:block w-[1px] bg-neutral-200 js-contact-line self-stretch" />
          <ContactDetails />
        </div>
      </main>

      <SiteFooter className="px-6" />
    </div>
  );
}
