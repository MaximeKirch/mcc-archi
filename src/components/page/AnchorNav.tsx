export interface Anchor {
  id: string;
  label: string;
}

export function AnchorNav({ anchors }: { anchors: Anchor[] }) {
  if (!anchors.length) return null;

  return (
    <nav
      aria-label="Sous-parties de la page"
      className="js-hero-fade flex flex-col gap-2 mt-4 lg:mt-0 lg:gap-8 lg:self-center lg:w-full"
    >
      {anchors.map((anchor, i) => (
        <a
          key={anchor.id}
          href={`#${anchor.id}`}
          aria-label={anchor.label}
          className="flex items-center gap-3 min-h-12 py-2 lg:justify-center lg:items-baseline lg:gap-4 lg:py-3 text-kaki hover:text-kaki-dark transition-colors"
        >
          <span className="font-mono text-[11px] text-neutral-500">
            {String(i + 1).padStart(2, "0")}
          </span>
          {/* Equal-width lines: one span per letter, spread by space-between. */}
          <span
            aria-hidden="true"
            className="font-mono flex-1 lg:flex-none lg:w-[380px] flex justify-between text-[13px] lg:text-base uppercase"
          >
            {[...anchor.label].map((char, j) => (
              <span key={j}>{char === " " ? " " : char}</span>
            ))}
          </span>
          <span aria-hidden="true" className="font-mono text-[13px] lg:text-base">
            ↓
          </span>
        </a>
      ))}
    </nav>
  );
}
