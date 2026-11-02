import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { siteConfig } from "#/config/site.ts";
import { seoMeta } from "#/lib/seo.ts";
import { normalizeImage } from "#/lib/wp.ts";
import { atelierPageQueryOptions } from "#/queries/atelier.ts";
import { asList } from "#/queries/pages.ts";
import type { AtelierAcf } from "#/types/wordpress.ts";
import { PageShell } from "#/components/page/PageShell.tsx";
import { PageHero, usePageHeroAnimation } from "#/components/page/PageHero.tsx";
import {
  MissionList,
  Paragraphs,
  Section,
  SectionRow,
} from "#/components/page/Section.tsx";
import { TextLink } from "#/components/page/TextLink.tsx";

export const Route = createFileRoute("/atelier")({
  loader: async ({ context }) => {
    const page = await context.queryClient.ensureQueryData(atelierPageQueryOptions);
    return { seo: page?.acf };
  },
  head: ({ loaderData }) => ({
    meta: seoMeta(loaderData?.seo, { title: `L'atelier | ${siteConfig.name}` }),
  }),
  component: AtelierComponent,
});

const bodyText = "text-[15px] leading-6 md:text-base md:leading-[26px] text-neutral-700";

function philosophieRows(p: AtelierAcf["philosophie"]) {
  if (!p) return [];
  const piliers = asList(p.piliers);
  const diplomes = asList(p.diplomes);
  const rows: { label: string; content: React.ReactNode }[] = [];

  if (p.accroche || p.texte_principal || p.texte_secondaire || p.citation || p.origine_nom) {
    rows.push({
      label: "Présentation de l’agence et du nom Cuccasa",
      content: (
        <>
          {p.accroche && (
            <h4 className="mb-3.5 md:mb-5 text-xl leading-7 tracking-[-0.5px] md:text-2xl md:leading-8 md:tracking-[-0.6px] font-semibold uppercase text-kaki">
              {p.accroche}
            </h4>
          )}
          {p.texte_principal && (
            <Paragraphs
              text={p.texte_principal}
              className="text-lg leading-7 md:text-xl md:leading-8 text-neutral-700 [&+p]:mt-4"
            />
          )}
          {p.texte_secondaire && (
            <Paragraphs text={p.texte_secondaire} className={`mt-4 md:mt-5 ${bodyText}`} />
          )}
          {p.citation && (
            <blockquote className="mt-5 md:mt-6 pl-3.5 md:pl-4 border-l border-neutral-300 text-[15px] leading-[26px] md:text-base md:leading-7 font-medium italic text-neutral-900">
              « {p.citation} »
            </blockquote>
          )}
          {p.origine_nom && (
            <Paragraphs text={p.origine_nom} className={`mt-5 md:mt-6 ${bodyText}`} />
          )}
        </>
      ),
    });
  }

  if (p.piliers_intro || piliers.length) {
    rows.push({
      label: "Pratique architecturale",
      content: (
        <>
          {p.piliers_intro && <p className={bodyText}>{p.piliers_intro}</p>}
          {piliers.length > 0 && (
            <ul className="mt-3.5 md:mt-4 list-disc pl-[18px] md:pl-5 text-[15px] leading-[26px] md:text-base md:leading-7 text-neutral-700">
              {piliers.map((pilier) => (
                <li key={pilier.titre} className="mb-2.5 last:mb-0">
                  {pilier.titre && (
                    <strong className="font-semibold text-kaki">{pilier.titre} :</strong>
                  )}{" "}
                  {pilier.texte}
                </li>
              ))}
            </ul>
          )}
        </>
      ),
    });
  }

  if (p.corse) {
    rows.push({
      label: "Corse",
      content: (
        <div
          className={`${bodyText} [&_p+p]:mt-4 [&_a]:underline [&_a]:text-kaki [&_strong]:font-semibold`}
          dangerouslySetInnerHTML={{ __html: p.corse }}
        />
      ),
    });
  }

  const formation = [
    ...diplomes.map((d) => ({ lieu: d.lieu, intitule: d.intitule })),
    ...(p.formations_pratiques
      ? [{ lieu: "Formations pratiques", intitule: p.formations_pratiques }]
      : []),
  ];
  if (formation.length) {
    rows.push({
      label: "Diplômes et formation",
      content: (
        <dl>
          {formation.map((d) => (
            <div
              key={d.lieu}
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
      ),
    });
  }

  if (p.ouverture_missions) {
    rows.push({
      label: "Ouverture sur les missions",
      content: (
        <>
          <p className={bodyText}>{p.ouverture_missions}</p>
          <TextLink href="/portfolio#projets" className="mt-2 md:mt-4">
            Voir les missions
          </TextLink>
        </>
      ),
    });
  }

  return rows;
}

function particuliersRows(p: AtelierAcf["particuliers"]) {
  if (!p) return [];
  const missions = asList(p.missions).map((m) => m.libelle).filter(Boolean);
  return [
    p.approche_collaborative && {
      label: "Une approche collaborative",
      content: <Paragraphs text={p.approche_collaborative} className={`${bodyText} [&+p]:mt-4`} />,
    },
    missions.length > 0 && {
      label: "Les missions réalisées",
      content: <MissionList items={missions} />,
    },
  ].filter((row) => !!row);
}

function agencesRows(a: AtelierAcf["agences"]) {
  if (!a) return [];
  const missions = asList(a.missions).map((m) => m.libelle).filter(Boolean);
  return [
    a.presentation && {
      label: "Présentation",
      content: <Paragraphs text={a.presentation} className={`${bodyText} [&+p]:mt-4`} />,
    },
    missions.length > 0 && {
      label: "Les missions réalisées",
      content: <MissionList items={missions} />,
    },
    a.texte_portfolio && {
      label: "Portfolio",
      content: (
        // One of the two framed blocks the client asked to keep.
        <div className="border border-line-kaki p-5 md:px-8 md:py-7 md:flex md:items-center md:justify-between md:gap-6">
          <p className="text-[17px] leading-[26px] md:text-lg md:leading-7 font-light text-neutral-800">
            {a.texte_portfolio}
          </p>
          {a.email_portfolio && (
            <TextLink
              href={`mailto:${a.email_portfolio}`}
              className="mt-2 md:mt-0 whitespace-nowrap"
            >
              Demander le portfolio
            </TextLink>
          )}
        </div>
      ),
    },
  ].filter((row) => !!row);
}

function AtelierComponent() {
  const { data: page } = useSuspenseQuery(atelierPageQueryOptions);
  const containerRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: "philosophie", title: "Philosophie et parcours", rows: philosophieRows(page?.acf.philosophie ?? null) },
    { id: "particuliers", title: "Accompagnement des particuliers", rows: particuliersRows(page?.acf.particuliers ?? null) },
    { id: "agences", title: "Collaboration d’agences", rows: agencesRows(page?.acf.agences ?? null) },
  ].filter((section) => section.rows.length > 0);

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
          {section.rows.map((row) => (
            <SectionRow key={row.label} label={row.label}>
              {row.content}
            </SectionRow>
          ))}
        </Section>
      ))}
    </PageShell>
  );
}
