import { useId, useState } from "react";
import { cn } from "#/lib/utils.ts";
import { capTop } from "./Section.tsx";

export interface Mission {
  libelle: string;
  definition: string;
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

const word = "py-[9px] font-bold md:py-1.5 text-[15px] leading-6 md:text-base md:leading-[26px]";
// First row of each column: no top padding, cap top on the grid top.
const firstWord = cn("md:pt-0", capTop);

export function MissionAccordion({ items }: { items: Mission[] }) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const indexed = items.map((item, index) => ({ ...item, index }));

  return (
    <div className="md:grid md:grid-cols-3 md:gap-x-6 md:items-start">
      {toColumns(indexed).map((column, c) => (
        <ul key={c}>
          {column.map(({ libelle, definition, index }, i) => {
            const first = i === 0 && firstWord;
            if (!definition) {
              return (
                <li key={index} className={cn(word, first, "text-neutral-700")}>
                  <Label text={libelle} chevron={false} />
                </li>
              );
            }
            const open = openIndex === index;
            const buttonId = `${baseId}-mission-${index}`;
            const panelId = `${baseId}-definition-${index}`;
            return (
              <li key={index}>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className={cn("mission block w-full text-left cursor-pointer", word, first)}
                >
                  <Label text={libelle} chevron />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!open}
                  className="texte-justifie pb-3 md:pr-6 text-[12px] leading-6 md:text-sm md:leading-[26px] italic text-neutral-500 whitespace-pre-line"
                >
                  {definition}
                </div>
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}
