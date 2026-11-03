import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { siteConfig } from "#/config/site.ts";
import { seoHead } from "#/lib/seo.ts";
import { normalizeImage } from "#/lib/wp.ts";
import { atelierPageQueryOptions } from "#/queries/atelier.ts";
import { asList } from "#/queries/pages.ts";
import { sectionIds } from "#/lib/utils.ts";
import type { AtelierBloc } from "#/types/wordpress.ts";
import { PageShell } from "#/components/page/PageShell.tsx";
import { PageHero, usePageHeroAnimation } from "#/components/page/PageHero.tsx";
import {
  MissionList,
  RichText,
  Section,
  SectionRow,
} from "#/components/page/Section.tsx";
import { TextLink } from "#/components/page/TextLink.tsx";

export const Route = createFileRoute("/atelier")({
  loader: async ({ context }) => {
    const page = await context.queryClient.ensureQueryData(atelierPageQueryOptions);
    return { seo: page?.acf };
  },
  head: ({ loaderData }) =>
    seoHead(loaderData?.seo, {
      title: `L'atelier | ${siteConfig.name}`,
      path: "/atelier",
      image: normalizeImage(loaderData?.seo?.photo_hero)?.url,
    }),
  component: AtelierComponent,
});

const bodyText = "text-[15px] leading-6 md:text-base md:leading-[26px] text-neutral-700";

// Null when the block has nothing to show.
function blocContent(bloc: AtelierBloc): React.ReactNode {
  switch (bloc.acf_fc_layout) {
    case "presentation": {
      const { accroche, texte_principal, texte_secondaire, citation, texte_final } = bloc;
      if (!(accroche || texte_principal || texte_secondaire || citation || texte_final)) return null;
      return (
        <>
          {accroche && (
            <h4 className="mb-3.5 md:mb-5 text-xl leading-7 tracking-[-0.5px] md:text-2xl md:leading-8 md:tracking-[-0.6px] font-semibold uppercase text-kaki">
              {accroche}
            </h4>
          )}
          {texte_principal && (
            <RichText
              html={texte_principal}
              className="text-lg leading-7 md:text-xl md:leading-8 text-neutral-700"
            />
          )}
          {texte_secondaire && (
            <RichText html={texte_secondaire} className={`mt-4 md:mt-5 ${bodyText}`} />
          )}
          {citation && (
            <blockquote className="mt-5 md:mt-6 pl-3.5 md:pl-4 border-l border-neutral-300 text-[15px] leading-[26px] md:text-base md:leading-7 font-medium italic text-neutral-900">
              « {citation} »
            </blockquote>
          )}
          {texte_final && <RichText html={texte_final} className={`mt-5 md:mt-6 ${bodyText}`} />}
        </>
      );
    }

    case "texte": {
      const hasLink = bloc.texte_lien && bloc.cible_lien;
      if (!bloc.texte && !hasLink) return null;
      return (
        <>
          {bloc.texte && <RichText html={bloc.texte} className={bodyText} />}
          {hasLink && (
            <TextLink href={bloc.cible_lien} className="mt-2 md:mt-4">
              {bloc.texte_lien}
            </TextLink>
          )}
        </>
      );
    }

    case "liste": {
      const elements = asList(bloc.elements);
      if (!bloc.intro && !elements.length) return null;
      return (
        <>
          {bloc.intro && <RichText html={bloc.intro} className={bodyText} />}
          {elements.length > 0 && (
            <ul className="mt-3.5 md:mt-4 list-disc pl-[18px] md:pl-5 text-[15px] leading-[26px] md:text-base md:leading-7 text-neutral-700">
              {elements.map((element, i) => (
                <li key={i} className="mb-2.5 last:mb-0">
                  {element.titre && (
                    <strong className="font-semibold text-kaki">{element.titre} :</strong>
                  )}{" "}
                  {element.texte}
                </li>
              ))}
            </ul>
          )}
        </>
      );
    }

    case "texte_riche":
      if (!bloc.contenu) return null;
      return <RichText html={bloc.contenu} className={bodyText} />;

    case "diplomes": {
      const elements = asList(bloc.elements);
      if (!elements.length) return null;
      return (
        <dl>
          {elements.map((d, i) => (
            <div
              key={i}
              className="py-3.5 border-b border-line md:grid md:grid-cols-[200px_minmax(0,1fr)] md:gap-x-6"
            >
              <dt className="font-mono text-[13px] tracking-[0.65px] uppercase text-kaki">
                {d.lieu}
              </dt>
              <dd className="mt-1 md:mt-0 text-[15px] leading-[22px] md:text-base md:leading-6 font-light text-neutral-800">
                {d.intitule}
              </dd>
            </div>
          ))}
        </dl>
      );
    }

    case "missions": {
      const missions = asList(bloc.elements).map((m) => m.libelle).filter(Boolean);
      return missions.length ? <MissionList items={missions} /> : null;
    }

    case "encadre":
      if (!bloc.texte) return null;
      return (
        // One of the two framed blocks the client asked to keep.
        <div className="border border-line-kaki p-5 md:px-8 md:py-7 md:flex md:items-center md:justify-between md:gap-6">
          <p className="text-[17px] leading-[26px] md:text-lg md:leading-7 font-light text-neutral-800">
            {bloc.texte}
          </p>
          {bloc.email && (
            <TextLink href={`mailto:${bloc.email}`} className="mt-2 md:mt-0 whitespace-nowrap">
              {bloc.texte_bouton || "Demander le portfolio"}
            </TextLink>
          )}
        </div>
      );

    default:
      return null;
  }
}

function AtelierComponent() {
  const { data: page } = useSuspenseQuery(atelierPageQueryOptions);
  const containerRef = useRef<HTMLDivElement>(null);

  const visible = asList(page?.acf.sections)
    .map((section) => ({
      ...section,
      rows: asList(section.blocs)
        .map((bloc) => ({ label: bloc.titre, content: blocContent(bloc) }))
        .filter((row) => row.content),
    }))
    .filter((section) => section.rows.length > 0);
  const ids = sectionIds(visible);
  const sections = visible.map((section, i) => ({ ...section, id: ids[i], title: section.titre }));

  usePageHeroAnimation(containerRef);

  return (
    <PageShell ref={containerRef} navLabel="L'Atelier">
      <PageHero
        title={page?.title.rendered ?? "L’atelier"}
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
          {section.rows.map((row, j) => (
            <SectionRow key={j} label={row.label}>
              {row.content}
            </SectionRow>
          ))}
        </Section>
      ))}
    </PageShell>
  );
}
