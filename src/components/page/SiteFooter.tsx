import { siteConfig } from "#/config/site.ts";
import { cn } from "#/lib/utils.ts";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "max-w-7xl min-[120rem]:max-w-[1800px] w-full mx-auto mt-14 md:mt-24 border-t border-line pt-6 pb-10 md:pt-8 md:pb-12 flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3 font-mono text-[10px] tracking-[1px] uppercase text-neutral-500",
        className,
      )}
    >
      <span>
        © {new Date().getFullYear()} — {siteConfig.name}.
      </span>
      <span className="flex gap-6">
        {siteConfig.socials.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-11 md:min-h-0 underline hover:text-neutral-900 transition-colors"
          >
            {label}
          </a>
        ))}
      </span>
    </footer>
  );
}
