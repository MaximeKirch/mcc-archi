import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { siteConfig } from "#/config/site.ts";
import { postsQueryOptions } from "#/queries/projects.ts";
import { homePageQueryOptions } from "#/queries/home.ts";
import { asList } from "#/queries/pages.ts";
import { gsap, prefersReducedMotion, useGSAP } from "#/lib/gsap.ts";
import { seoMeta } from "#/lib/seo.ts";
import { HeroHeader } from "#/components/page/HeroHeader.tsx";
import { SiteFooter } from "#/components/page/SiteFooter.tsx";
import { ProjectGrid } from "#/components/project/ProjectGrid.tsx";
import { AccompanimentSection } from "#/components/home/AccompanimentSection.tsx";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  loader: async ({ context }) => {
    const [, page] = await Promise.all([
      context.queryClient.ensureQueryData(postsQueryOptions),
      context.queryClient.ensureQueryData(homePageQueryOptions),
    ]);
    return { seo: page?.acf };
  },
  head: ({ loaderData }) => ({
    meta: seoMeta(loaderData?.seo, {
      title: `${siteConfig.name} | Atelier d'architecture en Corse`,
    }),
  }),
});

function HomeComponent() {
  const {
    data: { projets },
  } = useSuspenseQuery(postsQueryOptions);
  const { data: page } = useSuspenseQuery(homePageQueryOptions);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".js-header-title", {
        y: -30,
        opacity: 0,
        duration: 1.2,
      }).from(
        ".js-header-fade",
        {
          y: -30,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
        },
        "-=0.8",
      )
        .from(
          ".js-header-line",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.5,
            ease: "power3.inOut",
          },
          "-=0.8",
        )
        // Explicit end: `from` can read a stale y: 60 as the target.
        .fromTo(
          ".js-project-card",
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.2,
          },
          "-=1",
        );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-neutral-50 text-neutral-900 p-4 md:p-8 font-sans antialiased selection:bg-neutral-200"
    >
      <HeroHeader
        name={siteConfig.name}
        architect={siteConfig.architect}
        intro={page?.acf.accroche || undefined}
      />
      <main className="max-w-7xl min-[120rem]:max-w-[1800px] mx-auto">
        <h2 className="js-header-fade text-kaki leading-none [text-box:trim-both_cap_alphabetic] text-sm md:text-2xl mb-8 mt-4 tracking-widest uppercase font-mono font-medium">
          Projets d'architecture
        </h2>
        <ProjectGrid projects={projets} />
        <AccompanimentSection items={asList(page?.acf.accompagnement)} />
      </main>
      <SiteFooter className="pb-6 md:pb-4" />
    </div>
  );
}
