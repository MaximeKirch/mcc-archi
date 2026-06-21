import { queryOptions } from "@tanstack/react-query";
import { siteConfig } from "#/config/site.ts";

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
  return data[0];
}

export const aboutPageQueryOptions = queryOptions({
  queryKey: ["about"],
  queryFn: fetchAboutPage,
});
