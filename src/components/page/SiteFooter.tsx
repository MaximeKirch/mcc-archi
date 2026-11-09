import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { siteConfig } from "#/config/site.ts";
import { cn } from "#/lib/utils.ts";
import { contactPageQueryOptions } from "#/queries/contact.ts";
import { asList } from "#/queries/pages.ts";
import { SOCIAL_LABELS, SocialIcon } from "#/components/contact/SocialIcon.tsx";

const iconLink =
  "inline-flex items-center justify-center size-11 md:size-6 text-kaki hover:text-kaki-dark transition-colors";

// Not suspense: the footer also renders on error pages, when the API may be down.
export function SiteFooter({ className }: { className?: string }) {
  const { data: contact } = useQuery(contactPageQueryOptions);
  const reseaux = asList(contact?.acf.reseaux).filter((r) => r.url);

  return (
    <footer
      className={cn(
        "max-w-7xl min-[120rem]:max-w-[1800px] w-full mx-auto mt-14 md:mt-24 border-t border-line-kaki pt-6 pb-10 md:pt-8 md:pb-12 flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3 font-mono text-[10px] tracking-[1px] uppercase text-neutral-500",
        className,
      )}
    >
      <span>
        © {new Date().getFullYear()} — {siteConfig.name}.
      </span>
      <span className="flex items-center gap-2 md:gap-4">
        {reseaux.map(({ reseau, url }) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={SOCIAL_LABELS[reseau]}
            className={iconLink}
          >
            <SocialIcon network={reseau} />
          </a>
        ))}
        <Link to="/contact" aria-label="Contact" className={iconLink}>
          <Mail size={24} strokeWidth={1.6} aria-hidden="true" />
        </Link>
      </span>
    </footer>
  );
}
