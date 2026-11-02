import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { siteConfig } from "#/config/site.ts";
import { gsap, prefersReducedMotion, useGSAP } from "#/lib/gsap.ts";
import { seoMeta } from "#/lib/seo.ts";
import { contactPageQueryOptions } from "#/queries/contact.ts";
import { PageShell } from "#/components/page/PageShell.tsx";
import { ContactHero } from "#/components/contact/ContactHero.tsx";
import { ContactForm } from "#/components/contact/ContactForm.tsx";
import { ContactDetails } from "#/components/contact/ContactDetails.tsx";

export const Route = createFileRoute("/contact")({
  loader: async ({ context }) => {
    const page = await context.queryClient.ensureQueryData(contactPageQueryOptions);
    return { seo: page?.acf };
  },
  head: ({ loaderData }) => ({
    meta: seoMeta(loaderData?.seo, {
      title: `Contact | ${siteConfig.name}`,
      description:
        "Contactez l'atelier Cuccà[sa] à Évisa, en Corse : projets de particuliers et collaborations avec les agences d'architecture.",
    }),
  }),
  component: ContactComponent,
});

function ContactComponent() {
  const { data: page } = useSuspenseQuery(contactPageQueryOptions);
  const contact = page?.acf ?? null;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".js-contact-title > span", {
        y: "100%",
        duration: 1.2,
        stagger: 0.1,
      }).from(
        ".js-contact-details",
        {
          opacity: 0,
          y: 30,
          duration: 1,
          stagger: 0.1,
        },
        "-=0.6",
      );
    },
    { scope: containerRef },
  );

  return (
    <PageShell ref={containerRef} navLabel="Contact">
      <div className="mt-14 md:mt-30 lg:grid lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="lg:pr-16">
          <ContactHero contact={contact} />
          <ContactForm fallbackEmail={contact?.email ?? ""} />
        </div>
        <ContactDetails contact={contact} />
      </div>
    </PageShell>
  );
}
