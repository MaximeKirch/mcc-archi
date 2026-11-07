import { cn } from "#/lib/utils.ts";

interface SectionProps {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}

export function Section({ id, num, title, children }: SectionProps) {
  return (
    <section id={id} className="mt-14 md:mt-24 -scroll-mt-px">
      <div className="border-t border-line-kaki pt-4 md:pt-6 flex items-baseline gap-3 md:gap-5">
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
  // Full width, under the label and content.
  after?: React.ReactNode;
}

export function SectionRow({ label, children, after }: SectionRowProps) {
  return (
    <div
      className={cn(
        "py-7 md:py-10 border-t border-line md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-x-12",
        // Ends the section: 40px to the next separator, like its top (96 - 56).
        after && "md:last:-mb-14",
      )}
    >
      {label && (
        <h3 className="mb-3.5 md:mb-0 md:mt-1.5 font-mono text-[11px] leading-4 tracking-[1.4px] uppercase text-neutral-500">
          {label}
        </h3>
      )}
      {children && <div className="md:col-start-2 max-w-[760px]">{children}</div>}
      {after && <div className="mt-8 md:mt-10 md:col-span-full">{after}</div>}
    </div>
  );
}

export function MissionList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-[18px] md:pl-5 text-[15px] leading-[26px] md:text-base md:leading-7 font-light text-neutral-700 md:grid md:grid-flow-col md:grid-rows-[repeat(4,auto)] md:auto-cols-fr md:gap-x-12">
      {items.map((item, i) => (
        <li key={i} className="mb-1.5">
          {item}
        </li>
      ))}
    </ul>
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
