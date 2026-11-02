import { siteConfig } from "#/config/site.ts";
import type { SeoFields } from "#/types/wordpress.ts";

interface SeoDefaults {
  title: string;
  description?: string;
}

export function seoMeta(seo: Partial<SeoFields> | undefined, defaults: SeoDefaults) {
  const title = seo?.seo_titre || defaults.title;
  const description =
    seo?.seo_description || defaults.description || siteConfig.description;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
  ];
}
