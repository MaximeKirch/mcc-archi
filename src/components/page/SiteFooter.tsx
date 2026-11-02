import { useQuery } from "@tanstack/react-query";
import { siteConfig } from "#/config/site.ts";
import { cn } from "#/lib/utils.ts";
import { contactPageQueryOptions } from "#/queries/contact.ts";
import { asList } from "#/queries/pages.ts";
import { SOCIAL_LABELS } from "#/components/contact/SocialIcon.tsx";

// Not suspense: the footer also renders on error pages, when the API may be down.
export function SiteFooter({ className }: { className?: string }) {
  const { data: contact } = useQuery(contactPageQueryOptions);
  const reseaux = asList(contact?.acf.reseaux).filter((r) => r.url);

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
      {reseaux.length > 0 && (
        <span className="flex gap-6">
          {reseaux.map(({ reseau, url }) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-11 md:min-h-0 underline hover:text-neutral-900 transition-colors"
            >
              {SOCIAL_LABELS[reseau]}
            </a>
          ))}
        </span>
      )}
    </footer>
  );
}
