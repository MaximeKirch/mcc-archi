import { siteConfig } from "#/config/site.ts";
import { asList } from "#/queries/pages.ts";
import type { ContactAcf, SeoFields } from "#/types/wordpress.ts";

interface SeoDefaults {
  title: string;
  description?: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
}

const DESCRIPTION_MAX = 160;

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).href;
}

// HTML to a single line, cut on a word boundary.
export function toDescription(html: string): string {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= DESCRIPTION_MAX) return text;
  return `${text.slice(0, DESCRIPTION_MAX - 1).replace(/\s+\S*$/, "")}…`;
}

export function seoHead(seo: Partial<SeoFields> | undefined, defaults: SeoDefaults) {
  const title = seo?.seo_titre || defaults.title;
  const description =
    seo?.seo_description || defaults.description || siteConfig.description;
  const url = absoluteUrl(defaults.path);
  const image = absoluteUrl(defaults.image || siteConfig.defaultImage);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: defaults.type ?? "website" },
      { property: "og:url", content: url },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

// `<` escaped so the JSON can't close the script tag.
export function jsonLdScript(data: object) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}

// Free-text ACF address; the "20126 EVISA" line gives code and town.
function postalAddress(text: string) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const cityIndex = lines.findIndex((l) => /^\d{5}\s/.test(l));
  if (cityIndex < 0) return { "@type": "PostalAddress", streetAddress: lines.join(", "), addressCountry: "FR" };
  const [, postalCode, locality] = lines[cityIndex].match(/^(\d{5})\s+(.+)$/)!;
  return {
    "@type": "PostalAddress",
    streetAddress: lines.slice(0, cityIndex).join(", "),
    postalCode,
    addressLocality: locality,
    addressRegion: "Corse",
    addressCountry: "FR",
  };
}

export function organizationJsonLd(contact: ContactAcf | undefined) {
  const sameAs = [...new Set(asList(contact?.reseaux).map((r) => r.url).filter(Boolean))];
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#atelier`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo),
    image: absoluteUrl(siteConfig.defaultImage),
    email: contact?.email || undefined,
    telephone: contact?.telephone || undefined,
    address: contact?.adresse ? postalAddress(contact.adresse) : undefined,
    areaServed: siteConfig.areaServed,
    founder: { "@type": "Person", name: siteConfig.architect, jobTitle: "Architecte" },
    sameAs: sameAs.length ? sameAs : undefined,
  };
}
