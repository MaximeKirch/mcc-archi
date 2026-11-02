import { queryOptions } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { siteConfig } from "#/config/site.ts";
import type WordPressProject from "#/types/wordpress.ts";
import type {
  MemoireAcf,
  SavoirFaireAcf,
  WordPressPost,
} from "#/types/wordpress.ts";
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

interface WordPressCategory {
  id: number;
  slug: string;
  name: string;
}

const RECHERCHE_SLUGS = ["memoire", "etudes"];
const SAVOIR_FAIRE_SLUGS = ["formation"];

export interface PortfolioPosts {
  projets: WordPressProject[];
  recherches: WordPressPost<MemoireAcf>[];
  savoirFaire: WordPressPost<SavoirFaireAcf>[];
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${siteConfig.apiUrl}${path}`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des articles");
  }
  return response.json();
}

// Posts without a portfolio category count as projects.
async function fetchPosts(): Promise<PortfolioPosts> {
  const [posts, categories] = await Promise.all([
    fetchJson<WordPressPost<unknown>[]>(
      `/posts?per_page=100&orderby=menu_order&order=asc&${siteConfig.acfFormatParam}`,
    ),
    fetchJson<WordPressCategory[]>(
      `/categories?slug=${[...RECHERCHE_SLUGS, ...SAVOIR_FAIRE_SLUGS].join(",")}&_fields=id,slug,name`,
    ),
  ]);
  const categoryOf = (post: WordPressPost<unknown>) =>
    categories.find((c) => post.categories.includes(c.id));
  const withLabel = <Acf extends { etiquette: string }>(post: WordPressPost<Acf>) => ({
    ...post,
    title: { rendered: decodeEntities(post.title.rendered) },
    acf: { ...post.acf, etiquette: post.acf.etiquette || (categoryOf(post)?.name ?? "") },
  });

  const grouped: PortfolioPosts = { projets: [], recherches: [], savoirFaire: [] };
  for (const post of posts) {
    const slug = categoryOf(post)?.slug ?? "";
    if (RECHERCHE_SLUGS.includes(slug)) {
      grouped.recherches.push(withLabel(post as WordPressPost<MemoireAcf>));
    } else if (SAVOIR_FAIRE_SLUGS.includes(slug)) {
      grouped.savoirFaire.push(withLabel(post as WordPressPost<SavoirFaireAcf>));
    } else {
      grouped.projets.push(normalizeProjectUrls(post as WordPressProject));
    }
  }
  return grouped;
}

export const postsQueryOptions = queryOptions({
  queryKey: ["posts"],
  queryFn: fetchPosts,
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
    throw notFound();
  }
  return normalizeProjectUrls(data[0]);
}

export const projectBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: () => fetchProjectBySlug(slug),
  });
