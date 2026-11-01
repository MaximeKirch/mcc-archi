import { queryOptions } from "@tanstack/react-query";
import { siteConfig } from "#/config/site.ts";
import type WordPressProject from "#/types/wordpress.ts";
import { decodeEntities } from "#/lib/utils.ts";
import { normalizeUrl } from "#/lib/wp.ts";

function normalizeProjectUrls(project: WordPressProject): WordPressProject {
  return {
    ...project,
    title: { rendered: decodeEntities(project.title.rendered) },
    acf: {
      ...project.acf,
      architecture_cover_image: normalizeUrl(project.acf.architecture_cover_image) as string,
      image_1: normalizeUrl(project.acf.image_1),
      image_2: normalizeUrl(project.acf.image_2),
      image_3: normalizeUrl(project.acf.image_3),
      image_4: normalizeUrl(project.acf.image_4),
      image_5: normalizeUrl(project.acf.image_5),
      image_6: normalizeUrl(project.acf.image_6),
      image_7: normalizeUrl(project.acf.image_7),
      image_8: normalizeUrl(project.acf.image_8),
      image_9: normalizeUrl(project.acf.image_9),
      image_10: normalizeUrl(project.acf.image_10),
    },
  };
}

async function fetchProjects(): Promise<WordPressProject[]> {
  const response = await fetch(
    `${siteConfig.apiUrl}/posts?per_page=100&orderby=menu_order&order=asc&${siteConfig.acfFormatParam}`,
  );
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des projets");
  }
  const data: WordPressProject[] = await response.json();
  return data.map(normalizeProjectUrls);
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
  const data: WordPressProject[] = await response.json();
  if (data.length === 0) {
    throw new Error("Projet introuvable");
  }
  return normalizeProjectUrls(data[0]);
}

export const projectBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: () => fetchProjectBySlug(slug),
  });
