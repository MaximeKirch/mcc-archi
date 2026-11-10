import { cn } from "#/lib/utils.ts";

// Desktop: cuts the line box down to cap height, so tops line up on the letters.
export const capTop = "md:[text-box:trim-start_cap_alphabetic]";

export const rowLabel = "font-mono text-[13px] leading-5 tracking-[1.4px] uppercase text-neutral-500";

export const rowBase = "py-7 md:py-10 border-t border-line-kaki first:border-t-0";

// Space under a block title, same as above it (row padding).
export const titleGap = "mb-7 md:mb-10";

export const accrocheClass =
  "text-base leading-6 tracking-[-0.3px] md:text-xl md:leading-7 md:tracking-[-0.5px] font-semibold uppercase text-kaki";

interface SectionProps {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}

export function Section({ id, num, title, children }: SectionProps) {
  return (
    <section id={id} className="mt-14 md:mt-24 -scroll-mt-px">
      <div className="border-t border-kaki pt-4 md:pt-6 flex items-baseline gap-3 md:gap-5">
        <span className="font-mono text-[13px] md:text-sm text-neutral-500">{num}</span>
        <h2 className="font-mono text-lg leading-[26px] tracking-[1.8px] md:text-2xl md:leading-8 md:tracking-[2.4px] font-medium uppercase text-kaki">
          {title}
        </h2>
      </div>
      <div className="mt-4 md:mt-6 [&>*:last-child]:pb-0">{children}</div>
    </section>
  );
}

interface SectionRowProps {
  label: string;
  children: React.ReactNode;
  labelClassName?: string;
}

export function SectionRow({ label, children, labelClassName }: SectionRowProps) {
  return (
    <div
      // Label and content first line share the same cap top.
      className={cn(rowBase, "md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-x-12 md:items-start")}
    >
      {label && (
        <h3 className={cn(rowLabel, "mb-3.5 md:mb-0", capTop, labelClassName)}>
          {label}
        </h3>
      )}
      {children && (
        <div className={cn("md:col-start-2 max-w-[760px]", capTop)}>{children}</div>
      )}
    </div>
  );
}

// ACF WYSIWYG html, already cleaned by WordPress. Plain text (old textarea): a blank line starts a paragraph.
export function RichText({ html, className = "" }: { html: string; className?: string }) {
  const classes = `texte-riche ${className}`;
  if (/<[a-z][^>]*>/i.test(html)) {
    return <div className={classes} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return (
    <div className={classes}>
      {html
        .split(/\n\s*\n/)
        .filter((p) => p.trim())
        .map((p, i) => (
          <p key={i}>{p.trim()}</p>
        ))}
    </div>
  );
}
