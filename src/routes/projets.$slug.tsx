import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { projectBySlugQueryOptions } from "#/queries/projects.ts";
import { portfolioPageQueryOptions } from "#/queries/portfolio.ts";
import { PROJECT_LABELS, withDefaults } from "#/config/labels.ts";
import { ProjectDetail } from "#/components/project/ProjectDetail.tsx";
import { siteConfig } from "#/config/site.ts";
import { absoluteUrl, jsonLdScript, seoHead, toDescription } from "#/lib/seo.ts";

export const Route = createFileRoute("/projets/$slug")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(projectBySlugQueryOptions(params.slug)),
      context.queryClient.ensureQueryData(portfolioPageQueryOptions),
    ]),
  head: ({ loaderData, params }) => {
    const project = loaderData?.[0];
    const path = `/projets/${params.slug}`;
    const title = project?.title.rendered ?? "Projet";
    return {
      ...seoHead(undefined, {
        title: `${title} | ${siteConfig.name}`,
        description: project ? toDescription(project.acf.description) || undefined : undefined,
        path,
        image: project?.acf.architecture_cover_image,
        type: "article",
      }),
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Portfolio", item: absoluteUrl("/portfolio") },
            { "@type": "ListItem", position: 2, name: title, item: absoluteUrl(path) },
          ],
        }),
      ],
    };
  },
  component: ProjectDetailComponent,
});

function ProjectDetailComponent() {
  const { slug } = Route.useParams();
  const { data: project } = useSuspenseQuery(projectBySlugQueryOptions(slug));
  const { data: portfolio } = useSuspenseQuery(portfolioPageQueryOptions);
  const labels = withDefaults(portfolio?.acf.libelles_projet, PROJECT_LABELS);

  return <ProjectDetail project={project} labels={labels} />;
}
