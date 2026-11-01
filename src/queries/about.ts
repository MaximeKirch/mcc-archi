import { queryOptions } from "@tanstack/react-query";
import { siteConfig } from "#/config/site.ts";
import { decodeEntities } from "#/lib/utils.ts";

export interface WordPressAboutPage {
  id: number;
  title: { rendered: string };
  acf: { about_description: string };
}

async function fetchAboutPage(): Promise<WordPressAboutPage> {
  const response = await fetch(
    `${siteConfig.apiUrl}/pages?slug=about&${siteConfig.acfFormatParam}`,
  );
  if (!response.ok) throw new Error("Erreur lors de la récupération de la page");
  const data: WordPressAboutPage[] = await response.json();
  if (!data.length) throw new Error("Page introuvable");
  const page = data[0];
  return { ...page, title: { rendered: decodeEntities(page.title.rendered) } };
}

export const aboutPageQueryOptions = queryOptions({
  queryKey: ["about"],
  queryFn: fetchAboutPage,
});
