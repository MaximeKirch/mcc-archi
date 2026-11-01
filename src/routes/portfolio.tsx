import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { siteConfig } from "#/config/site.ts";
import { seoMeta } from "#/lib/seo.ts";
import { normalizeImage } from "#/lib/wp.ts";
import { portfolioPageQueryOptions } from "#/queries/portfolio.ts";
import { postsQueryOptions } from "#/queries/projects.ts";
import { PageShell } from "#/components/page/PageShell.tsx";
import { PageHero, usePageHeroAnimation } from "#/components/page/PageHero.tsx";
import { Section } from "#/components/page/Section.tsx";
import { ProjectGrid } from "#/components/project/ProjectGrid.tsx";
import {
  RechercheCard,
  SavoirFaireCard,
} from "#/components/portfolio/PortfolioCards.tsx";

export const Route = createFileRoute("/portfolio")({
  loader: async ({ context }) => {
    const [page] = await Promise.all([
      context.queryClient.ensureQueryData(portfolioPageQueryOptions),
      context.queryClient.ensureQueryData(postsQueryOptions),
    ]);
    return { seo: page?.acf };
  },
  head: ({ loaderData }) => ({
    meta: seoMeta(loaderData?.seo, {
      title: `Portfolio | ${siteConfig.name}`,
      description:
        "Projets d'architecture, recherches, mémoires et savoir-faire de l'atelier Cuccà[sa], en Corse et à Marseille.",
    }),
  }),
  component: PortfolioComponent,
});

// Grids sit 28px (mobile) / 40px below the section title.
const gridSpacing = "mt-3 md:mt-4";

function PortfolioComponent() {
  const { data: page } = useSuspenseQuery(portfolioPageQueryOptions);
  const { data: posts } = useSuspenseQuery(postsQueryOptions);
  const containerRef = useRef<HTMLDivElement>(null);
  usePageHeroAnimation(containerRef);

  const sections = [
    {
      id: "projets",
      title: "Projets & Réalisations",
      count: posts.projets.length,
      content: (
        <div className={gridSpacing}>
          <ProjectGrid projects={posts.projets} />
        </div>
      ),
    },
    {
      id: "recherches",
      title: "Recherches & Mémoires",
      count: posts.recherches.length,
      content: (
        <div className={`${gridSpacing} grid grid-cols-1 md:grid-cols-2 gap-8`}>
          {posts.recherches.map((post) => (
            <RechercheCard key={post.id} post={post} />
          ))}
        </div>
      ),
    },
    {
      id: "savoir-faire",
      title: "Savoir-faire & Matériaux",
      count: posts.savoirFaire.length,
      content: (
        <div className={`${gridSpacing} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`}>
          {posts.savoirFaire.map((post) => (
            <SavoirFaireCard key={post.id} post={post} />
          ))}
        </div>
      ),
    },
  ].filter((section) => section.count > 0);

  return (
    <PageShell ref={containerRef} navLabel="Portfolio">
      <PageHero
        title={page?.title.rendered ?? "Portfolio"}
        image={normalizeImage(page?.acf.photo_hero)}
        anchors={sections.map(({ id, title }) => ({ id, label: title }))}
      />
      {sections.map((section, i) => (
        <Section
          key={section.id}
          id={section.id}
          num={String(i + 1).padStart(2, "0")}
          title={section.title}
        >
          {section.content}
        </Section>
      ))}
    </PageShell>
  );
}
