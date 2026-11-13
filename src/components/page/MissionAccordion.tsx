import { useId, useState } from "react";
import { cn, texteMinimalHtml } from "#/lib/utils.ts";
import { accrocheClass, capTop, rowBase, rowLabel, titleGap } from "./Section.tsx";
import { Link } from "@tanstack/react-router";
import { filledButtonClass } from "./buttonStyles.ts";

export interface Mission {
  libelle: string;
  definition: string;
}

export interface MissionColumn {
  titre: string;
  missions: Mission[];
}

export interface Formule {
  titre: string;
  texte: string;
  puces: string[];
}

// Html cleaned by WordPress (plain text is escaped).
function TexteMinimal({ valeur, className }: { valeur: string; className?: string }) {
  return <div className={cn("texte-minimal", className)} dangerouslySetInnerHTML={{ __html: texteMinimalHtml(valeur) }} />;
}

// Last word and chevron never wrap apart.
function Label({ text, chevron }: { text: string; chevron: boolean }) {
  const cut = text.lastIndexOf(" ") + 1;
  return (
    <span className="mission-mot">
      {cut > 0 && <span className="mission-u">{text.slice(0, cut)}</span>}
      <span className="whitespace-nowrap">
        <span className="mission-u">{text.slice(cut)}</span>
        {chevron && (
          <svg
            className="mission-ch"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 3l5 5-5 5" />
          </svg>
        )}
      </span>
    </span>
  );
}

const columnHeader = "mb-1 md:mb-0 font-mono text-[15px] leading-5 tracking-[1.4px] uppercase text-kaki";

const word = "py-[9px] md:py-0 md:pb-3 font-bold text-[15px] leading-6 md:text-base md:leading-[26px]";

// By position, repeating. Sand takes kaki-dark: plain kaki is under 5:1 on it.
const fondsFormules = ["bg-cream text-kaki", "bg-linen text-kaki", "bg-sand text-kaki-dark"];

function FormuleCards({ formules, className }: { formules: Formule[]; className?: string }) {
  return (
    <ul className={cn("grid gap-4 lg:grid-cols-3", className)}>
      {formules.map((f, i) => (
        <li
          key={i}
          className={cn(
            "flex flex-col gap-3 rounded-[4px] border border-line-kaki px-5 pt-5 pb-6 lg:px-6 lg:pt-6 lg:pb-7 [&_h4]:text-current",
            fondsFormules[i % fondsFormules.length],
          )}
        >
          {f.titre && <h4 className="text-lg leading-[26px] font-bold">{f.titre}</h4>}
          {f.texte && <TexteMinimal valeur={f.texte} className="texte-justifie text-sm leading-[22px]" />}
          {f.puces.length > 0 && (
            // Tighter wrapped lines, same 28px from one bullet to the next.
            <ul className="texte-justifie italique-inverse list-disc pl-[18px] text-sm leading-5 italic">
              {f.puces.map((puce, j) => (
                <li key={j} className="texte-minimal mb-2" dangerouslySetInnerHTML={{ __html: puce }} />
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

interface MissionsRowProps {
  label: string;
  accroche?: string;
  colonnes: MissionColumn[];
  formules?: Formule[];
  lienFormules?: string;
}

// Desktop (lg): grid stays still, the open definition shows in the label column.
// Below lg: classic accordion, definition under its mission.
export function MissionsRow({
  label,
  accroche,
  colonnes,
  formules = [],
  lienFormules = "Discuter de votre projet",
}: MissionsRowProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const all = colonnes.flatMap((colonne) => colonne.missions);
  let next = 0;
  const indexed = colonnes.map((colonne) => ({
    titre: colonne.titre,
    missions: colonne.missions.map((mission) => ({
      ...mission,
      index: next++,
    })),
  }));
  const opened = openIndex === null ? null : all[openIndex];
  const hasFormules = formules.length > 0;
  const hasHeaders = colonnes.some((colonne) => colonne.titre);
  const buttonId = (i: number) => `${baseId}-mission-${i}`;
  const asideId = `${baseId}-definition`;

  const aside = (
    <div
      id={asideId}
      aria-live="polite"
      className={cn("hidden lg:block", hasFormules ? "lg:col-start-1 lg:row-start-2" : "mt-4")}
    >
      {opened && openIndex !== null && (
        <div role="region" aria-labelledby={buttonId(openIndex)}>
          <p className="text-base leading-[26px] font-bold">
            <span className="mission-mot mission-pastille">{opened.libelle}</span>
          </p>
          <TexteMinimal
            valeur={opened.definition}
            className="texte-justifie italique-inverse mt-2.5 text-[13px] leading-[22px] italic text-neutral-500"
          />
        </div>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        rowBase,
        "md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-x-12 md:gap-y-4 lg:gap-y-6 md:items-start",
      )}
    >
      <div>
        {label && <h3 className={cn(rowLabel, "mb-3.5 md:mb-0", capTop)}>{label}</h3>}
        {!hasFormules && aside}
      </div>

      <div className="md:col-start-2 md:row-start-1">
        {accroche && <h4 className={cn(accrocheClass, titleGap, capTop)}>{accroche}</h4>}
        <div className={cn("md:grid md:grid-cols-3 md:gap-x-4 md:items-start", hasHeaders && "md:gap-y-4")}>
          {indexed.map(({ titre, missions }, c) => (
            // Subgrid: headers share a row, so missions start level even if a title wraps.
            <div
              key={c}
              className={cn(hasHeaders && "mt-6 first:mt-0 md:mt-0 md:grid md:grid-rows-subgrid md:row-span-2")}
            >
              {titre ? (
                <h4 className={cn(columnHeader, capTop)}>{titre}</h4>
              ) : (
                hasHeaders && <div aria-hidden="true" className="hidden md:block" />
              )}
              <ul>
                {missions.map(({ libelle, definition, index }, i) => {
                  const first = !accroche && !hasHeaders && i === 0 && capTop;
                  if (!definition) {
                    return (
                      <li key={index} className={cn(word, first, "text-neutral-700")}>
                        <Label text={libelle} chevron={false} />
                      </li>
                    );
                  }
                  const open = openIndex === index;
                  const panelId = `${baseId}-panel-${index}`;
                  return (
                    <li key={index}>
                      <button
                        type="button"
                        id={buttonId(index)}
                        aria-expanded={open}
                        aria-controls={`${panelId} ${asideId}`}
                        onClick={() => setOpenIndex(open ? null : index)}
                        className={cn("mission block w-full text-left cursor-pointer", word, first)}
                      >
                        <Label text={libelle} chevron />
                      </button>
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId(index)}
                        hidden={!open}
                        className="lg:hidden pb-3 md:pr-6"
                      >
                        <TexteMinimal
                          valeur={definition}
                          className="texte-justifie italique-inverse text-[12px] leading-6 md:text-sm md:leading-[26px] italic text-neutral-500"
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {hasFormules && (
        <>
          {aside}
          <div className="mt-4 md:mt-0 md:col-start-2 md:row-start-2">
            <FormuleCards formules={formules} />
            <Link to="/contact" className={cn(filledButtonClass, "mt-4 md:mt-6")}>
              {lienFormules} →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
