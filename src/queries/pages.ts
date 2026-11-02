import { siteConfig } from "#/config/site.ts";
import { decodeEntities } from "#/lib/utils.ts";
import type { WordPressPage } from "#/types/wordpress.ts";

// Missing page resolves to null so the front renders without it.
export async function fetchPageBySlug<Acf>(
  slug: string,
): Promise<WordPressPage<Acf> | null> {
  const response = await fetch(
    `${siteConfig.apiUrl}/pages?slug=${slug}&${siteConfig.acfFormatParam}`,
  );
  if (!response.ok) throw new Error("Erreur lors de la récupération de la page");
  const data: WordPressPage<Acf>[] = await response.json();
  if (!data.length) return null;
  const page = data[0];
  return { ...page, title: { rendered: decodeEntities(page.title.rendered) } };
}

// ACF returns false or "" for an empty repeater.
export function asList<T>(value: T[] | false | "" | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}
