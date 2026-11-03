import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { siteConfig } from "#/config/site.ts";
import { seoHead } from "#/lib/seo.ts";
import { normalizeImage } from "#/lib/wp.ts";
import { portfolioPageQueryOptions } from "#/queries/portfolio.ts";
import { projectsQueryOptions } from "#/queries/projects.ts";
import { asList } from "#/queries/pages.ts";
import { sectionIds } from "#/lib/utils.ts";
import type WordPressProject from "#/types/wordpress.ts";
import type { PortfolioSection } from "#/types/wordpress.ts";
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
      context.queryClient.ensureQueryData(projectsQueryOptions),
    ]);
    return { seo: page?.acf };
  },
  head: ({ loaderData }) =>
    seoHead(loaderData?.seo, {
      title: `Portfolio | ${siteConfig.name}`,
      description:
        "Projets d'architecture, recherches, mémoires et savoir-faire de l'atelier Cuccà[sa], en Corse et à Marseille.",
      path: "/portfolio",
      image: normalizeImage(loaderData?.seo?.photo_hero)?.url,
    }),
  component: PortfolioComponent,
});

// Grids sit 28px (mobile) / 40px below the section title.
const gridSpacing = "mt-3 md:mt-4";

// Used while the page has no sections in WordPress.
const DEFAULT_SECTIONS: PortfolioSection[] = [
  { acf_fc_layout: "projets", titre: "Projets & Réalisations", ancre: "projets" },
];

// Null when the section has nothing to show.
function sectionContent(section: PortfolioSection, projets: WordPressProject[]): React.ReactNode {
  switch (section.acf_fc_layout) {
    case "projets":
      if (!projets.length) return null;
      return (
        <div className={gridSpacing}>
          <ProjectGrid projects={projets} />
        </div>
      );
    case "recherches": {
      const fiches = asList(section.fiches);
      if (!fiches.length) return null;
      return (
        <div className={`${gridSpacing} grid grid-cols-1 md:grid-cols-2 gap-8`}>
          {fiches.map((fiche, i) => (
            <RechercheCard key={i} fiche={fiche} linkLabel={section.texte_lien} />
          ))}
        </div>
      );
    }
    case "savoir_faire": {
      const fiches = asList(section.fiches);
      if (!fiches.length) return null;
      return (
        <div className={`${gridSpacing} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`}>
          {fiches.map((fiche, i) => (
            <SavoirFaireCard key={i} fiche={fiche} />
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}

function PortfolioComponent() {
  const { data: page } = useSuspenseQuery(portfolioPageQueryOptions);
  const { data: projets } = useSuspenseQuery(projectsQueryOptions);
  const containerRef = useRef<HTMLDivElement>(null);
  usePageHeroAnimation(containerRef);

  const configured = asList(page?.acf.sections);
  const visible = (configured.length ? configured : DEFAULT_SECTIONS)
    .map((section) => ({ ...section, content: sectionContent(section, projets) }))
    .filter((section) => section.content);
  const ids = sectionIds(visible);
  const sections = visible.map((section, i) => ({ ...section, id: ids[i], title: section.titre }));

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
