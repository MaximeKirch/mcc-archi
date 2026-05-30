import { queryOptions } from "@tanstack/react-query";
import { siteConfig } from "#/config/site.ts";
import type WordPressProject from "#/types/wordpress.ts";

async function fetchProjects(): Promise<WordPressProject[]> {
  const response = await fetch(
    `${siteConfig.apiUrl}/posts?${siteConfig.acfFormatParam}`,
  );
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des projets");
  }
  return response.json();
}

export const projectsQueryOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: fetchProjects,
});

async function fetchProjectBySlug(slug: string): Promise<WordPressProject> {
  const response = await fetch(
    `${siteConfig.apiUrl}/posts?slug=${slug}&${siteConfig.acfFormatParam}`,
  );
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du projet");
  }
  const data = await response.json();
  if (data.length === 0) {
    throw new Error("Projet introuvable");
  }
  return data[0];
}

export const projectBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: () => fetchProjectBySlug(slug),
  });
