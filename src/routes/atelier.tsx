import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Fragment, useRef } from "react";
import { siteConfig } from "#/config/site.ts";
import { seoHead } from "#/lib/seo.ts";
import { normalizeImage } from "#/lib/wp.ts";
import { atelierPageQueryOptions } from "#/queries/atelier.ts";
import { asList } from "#/queries/pages.ts";
import { cn, sectionIds, splitLeadingYear } from "#/lib/utils.ts";
import type { AtelierBloc } from "#/types/wordpress.ts";
import { PageShell } from "#/components/page/PageShell.tsx";
import { PageHero, usePageHeroAnimation } from "#/components/page/PageHero.tsx";
import {
  RichText,
  Section,
  SectionRow,
  capTop,
  rowLabel,
  titleGap,
  accrocheClass,
} from "#/components/page/Section.tsx";
import { TextLink } from "#/components/page/TextLink.tsx";
import { filledButtonClass } from "#/components/page/buttonStyles.ts";
import { Carousel } from "#/components/page/Carousel.tsx";
import { MissionsRow } from "#/components/page/MissionAccordion.tsx";
import type { MissionColumn } from "#/components/page/MissionAccordion.tsx";

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

// The one body style, after "Une approche analytique".
const bodyText = "text-[15px] leading-6 md:text-base md:leading-[26px] text-neutral-700";

type DiplomesBloc = Extract<AtelierBloc, { acf_fc_layout: "diplomes" }>;
type Diploma = { lieu: string; intitule: string };

const diplomesGroupe = "Diplômes et formations";

const isDiplomes = (bloc: AtelierBloc): bloc is DiplomesBloc => bloc.acf_fc_layout === "diplomes";

function colonnesOf(bloc: AtelierBloc): MissionColumn[] {
  if (bloc.acf_fc_layout !== "missions") return [];
  return asList(bloc.colonnes)
    .map((c) => ({
      titre: c.titre?.trim() ?? "",
      missions: asList(c.missions)
        .map((m) => ({ libelle: m.libelle?.trim() ?? "", definition: m.definition?.trim() ?? "" }))
        .filter((m) => m.libelle),
    }))
    .filter((c) => c.missions.length);
}

function formulesOf(bloc: AtelierBloc) {
  if (bloc.acf_fc_layout !== "missions") return [];
  return asList(bloc.formules)
    .map((f) => ({
      titre: f.titre?.trim() ?? "",
      texte: f.texte?.trim() ?? "",
      puces: (f.puces ?? "")
        .split("\n")
        .map((p) => p.replace(/^\s*[-•*]\s*/, "").trim())
        .filter(Boolean),
    }))
    .filter((f) => f.titre || f.texte || f.puces.length);
}

// Null when the block has nothing to show.
function blocContent(bloc: AtelierBloc): React.ReactNode {
  switch (bloc.acf_fc_layout) {
    case "presentation":
    case "presentation_carrousel": {
      const { accroche, texte_principal, texte_secondaire, citation, texte_final } = bloc;
      const slides = asList(bloc.carrousel)
        .map((s) => ({ ...s, image: normalizeImage(s.image) }))
        .filter((s) => s.image || s.titre || s.texte);
      if (!(accroche || texte_principal || texte_secondaire || citation || texte_final || slides.length))
        return null;
      return (
        <>
          {accroche && (
            <h4 className={`${titleGap} ${accrocheClass}`}>
              {accroche}
            </h4>
          )}
          {texte_principal && (
            <RichText html={texte_principal} className={bodyText} />
          )}
          {texte_secondaire && (
            <RichText html={texte_secondaire} className={`mt-4 md:mt-5 ${bodyText}`} />
          )}
          {citation && (
            <blockquote className="texte-justifie mt-5 md:mt-6 pl-3.5 md:pl-4 border-l border-neutral-300 text-[15px] leading-6 md:text-base md:leading-[26px] italic text-neutral-700">
              « {citation} »
            </blockquote>
          )}
          {texte_final && <RichText html={texte_final} className={`mt-5 md:mt-6 ${bodyText}`} />}
          {slides.length > 0 && (
            <div className="mt-6 md:mt-6 first:mt-0">
              <Carousel slides={slides} label={bloc.titre || "Carrousel"} />
            </div>
          )}
        </>
      );
    }

    case "texte": {
      const hasLink = bloc.texte_lien && bloc.cible_lien;
      const accroche = bloc.accroche?.trim();
      if (!accroche && !bloc.texte && !hasLink) return null;
      return (
        <>
          {accroche && <h4 className={`${titleGap} ${accrocheClass}`}>{accroche}</h4>}
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
            <ul className={`texte-justifie mt-3.5 md:mt-4 list-disc pl-[18px] md:pl-5 ${bodyText}`}>
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
      return <DiplomaList items={elements} trimFirst={capTop} />;
    }

    case "missions": {
      const colonnes = colonnesOf(bloc);
      if (!colonnes.length) return null;
      return (
        <MissionsRow
          label={bloc.titre}
          accroche={bloc.accroche?.trim()}
          colonnes={colonnes}
          formules={formulesOf(bloc)}
          lienFormules={bloc.lien_formules?.trim() || undefined}
        />
      );
    }

    case "encadre":
      if (!bloc.texte) return null;
      return (
        // One of the two framed blocks the client asked to keep.
        <div className="border border-line-kaki p-5 md:px-8 md:py-7 md:flex md:items-center md:justify-between md:gap-6">
          <p className="texte-justifie text-[15px] leading-6 md:text-base md:leading-[26px] text-neutral-700">
            {bloc.texte}
          </p>
          {bloc.email && (
            <a href={`mailto:${bloc.email}`} className={cn(filledButtonClass, "mt-4 md:mt-0 whitespace-nowrap shrink-0")}>
              {bloc.texte_bouton || "Demander le portfolio"} →
            </a>
          )}
        </div>
      );

    default:
      return null;
  }
}

// trimFirst: cap-top trim of the first title, when it starts the row.
function DiplomaList({ items, trimFirst }: { items: Diploma[]; trimFirst: string }) {
  return (
    <dl className="flex flex-col gap-5 lg:gap-6">
      {items.map((d, i) => (
        <div key={i}>
          <dt
            className={cn(
              "font-mono text-[13px] leading-5 tracking-[0.65px] uppercase text-kaki",
              i === 0 && trimFirst,
            )}
          >
            <LeadingYear text={d.lieu} />
          </dt>
          <dd className="mt-1 text-[12px] leading-6 md:text-sm md:leading-[26px] italic text-neutral-700">
            {d.intitule}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// Two diploma blocks side by side from lg; stacked under their own titles below.
function DiplomaColumns({ blocs }: { blocs: DiplomesBloc[] }) {
  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
      {blocs.map((bloc, i) => (
        <div key={i} className="mt-[38px] first:mt-0 lg:mt-0">
          {bloc.titre && <h4 className={cn(rowLabel, "mb-6 lg:sr-only", capTop)}>{bloc.titre}</h4>}
          <DiplomaList
            items={asList(bloc.elements)}
            trimFirst={bloc.titre ? "lg:[text-box:trim-start_cap_alphabetic]" : capTop}
          />
        </div>
      ))}
    </div>
  );
}

interface Row {
  label: string;
  content: React.ReactNode;
  labelClassName?: string;
  // Content draws its own row (missions).
  custom?: boolean;
}

// Two diploma blocks in a row share one row.
function rowsOf(blocs: AtelierBloc[]): Row[] {
  const kept = blocs.filter((b) => !isDiplomes(b) || asList(b.elements).length);
  const rows: Row[] = [];
  for (let i = 0; i < kept.length; i++) {
    const bloc = kept[i];
    const next = kept[i + 1];
    if (isDiplomes(bloc) && next && isDiplomes(next)) {
      rows.push({
        label: bloc.titre_groupe?.trim() || diplomesGroupe,
        // Mobile shows the two block titles instead.
        labelClassName: "max-md:sr-only",
        content: <DiplomaColumns blocs={[bloc, next]} />,
      });
      i++;
      continue;
    }
    rows.push({
      label: bloc.titre,
      content: blocContent(bloc),
      custom: bloc.acf_fc_layout === "missions",
    });
  }
  return rows.filter((row) => row.content);
}

// "2025 - Diplôme…": only the year in bold.
function LeadingYear({ text }: { text: string }) {
  const [year, rest] = splitLeadingYear(text);
  if (!year) return text;
  return (
    <>
      <strong className="font-bold">{year}</strong>
      {rest}
    </>
  );
}

function AtelierComponent() {
  const { data: page } = useSuspenseQuery(atelierPageQueryOptions);
  const containerRef = useRef<HTMLDivElement>(null);

  const visible = asList(page?.acf.sections)
    .map((section) => ({
      ...section,
      rows: rowsOf(asList(section.blocs)),
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
          {section.rows.map((row, j) =>
            row.custom ? (
              <Fragment key={j}>{row.content}</Fragment>
            ) : (
              <SectionRow key={j} label={row.label} labelClassName={row.labelClassName}>
                {row.content}
              </SectionRow>
            ),
          )}
        </Section>
      ))}
    </PageShell>
  );
}
