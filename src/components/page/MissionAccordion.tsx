import { useId, useState } from "react";
import { cn } from "#/lib/utils.ts";
import { capTop, rowBase, rowLabel } from "./Section.tsx";

export interface Mission {
  libelle: string;
  definition: string;
}

export interface Formule {
  titre: string;
  texte: string;
  puces: string[];
}

const COLUMNS = 3;
const MIN_ROWS = 3;

// Desktop: filled column by column, 3 columns max, at least 3 missions each (12 -> 4/4/4, 6 -> 3/3).
function toColumns<T>(items: T[]): T[][] {
  const size = Math.max(MIN_ROWS, Math.ceil(items.length / COLUMNS));
  return Array.from({ length: COLUMNS }, (_, c) => items.slice(c * size, (c + 1) * size)).filter(
    (column) => column.length,
  );
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

const word = "py-[9px] md:py-0 md:pb-3 font-bold text-[15px] leading-6 md:text-base md:leading-[26px]";

function FormuleCards({ formules, className }: { formules: Formule[]; className?: string }) {
  return (
    <ul className={cn("grid gap-4 lg:grid-cols-3", className)}>
      {formules.map((f, i) => (
        <li
          key={i}
          className="flex flex-col gap-3 rounded-[4px] border border-line-kaki px-5 pt-5 pb-6 lg:px-6 lg:pt-6 lg:pb-7 text-kaki"
        >
          {f.titre && <h4 className="text-lg leading-[26px] font-bold">{f.titre}</h4>}
          {f.texte && <p className="text-left text-sm leading-[22px] whitespace-pre-line">{f.texte}</p>}
          {f.puces.length > 0 && (
            <ul className="list-disc pl-[18px] text-sm leading-6">
              {f.puces.map((puce, j) => (
                <li key={j} className="mb-1">
                  {puce}
                </li>
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
  items: Mission[];
  formules?: Formule[];
}

// Desktop (lg): grid stays still, the open definition shows in the label column.
// Below lg: classic accordion, definition under its mission.
export function MissionsRow({ label, items, formules = [] }: MissionsRowProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const indexed = items.map((item, index) => ({ ...item, index }));
  const opened = openIndex === null ? null : items[openIndex];
  const hasFormules = formules.length > 0;
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
          <p className="texte-justifie mt-2.5 text-[13px] leading-[22px] italic text-neutral-500 whitespace-pre-line">
            {opened.definition}
          </p>
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

      <div className="md:col-start-2 md:row-start-1 md:grid md:grid-cols-3 md:gap-x-4 md:items-start">
        {toColumns(indexed).map((column, c) => (
          <ul key={c}>
            {column.map(({ libelle, definition, index }, i) => {
              const first = i === 0 && capTop;
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
                    className="lg:hidden texte-justifie pb-3 md:pr-6 text-[12px] leading-6 md:text-sm md:leading-[26px] italic text-neutral-500 whitespace-pre-line"
                  >
                    {definition}
                  </div>
                </li>
              );
            })}
          </ul>
        ))}
      </div>

      {hasFormules && (
        <>
          {aside}
          <FormuleCards formules={formules} className="mt-4 md:mt-0 md:col-start-2 md:row-start-2" />
        </>
      )}
    </div>
  );
}
