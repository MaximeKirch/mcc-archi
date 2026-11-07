import { useId, useState } from "react";

export interface Mission {
  libelle: string;
  definition: string;
}

const COLUMNS = 3;

// Desktop: filled column by column, each column grows on its own.
function toColumns<T>(items: T[]): T[][] {
  const size = Math.ceil(items.length / COLUMNS);
  return Array.from({ length: COLUMNS }, (_, c) => items.slice(c * size, (c + 1) * size)).filter(
    (column) => column.length,
  );
}

// Last word and chevron never wrap apart.
function Label({ text, chevron }: { text: string; chevron: boolean }) {
  const cut = text.lastIndexOf(" ") + 1;
  return (
    <>
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
    </>
  );
}

const word = "py-[9px] md:py-1.5 text-[15px] leading-[26px] md:leading-7 font-light";

export function MissionAccordion({ items }: { items: Mission[] }) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const indexed = items.map((item, index) => ({ ...item, index }));

  return (
    <div className="md:grid md:grid-cols-3 md:gap-x-4 md:items-start">
      {toColumns(indexed).map((column, c) => (
        <ul key={c}>
          {column.map(({ libelle, definition, index }) => {
            if (!definition) {
              return (
                <li key={index} className={`${word} text-neutral-700`}>
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
                  className={`mission block w-full text-left cursor-pointer ${word}`}
                >
                  <Label text={libelle} chevron />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!open}
                  className="pb-3 text-sm leading-6 font-light italic text-neutral-700 whitespace-pre-line"
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
