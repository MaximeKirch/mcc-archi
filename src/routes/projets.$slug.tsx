import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { projectBySlugQueryOptions } from "#/queries/projects.ts";
import { portfolioPageQueryOptions } from "#/queries/portfolio.ts";
import { PROJECT_LABELS, withDefaults } from "#/config/labels.ts";
import { ProjectDetail } from "#/components/project/ProjectDetail.tsx";

export const Route = createFileRoute("/projets/$slug")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(projectBySlugQueryOptions(params.slug)),
      context.queryClient.ensureQueryData(portfolioPageQueryOptions),
    ]),
  component: ProjectDetailComponent,
});

function ProjectDetailComponent() {
  const { slug } = Route.useParams();
  const { data: project } = useSuspenseQuery(projectBySlugQueryOptions(slug));
  const { data: portfolio } = useSuspenseQuery(portfolioPageQueryOptions);
  const labels = withDefaults(portfolio?.acf.libelles_projet, PROJECT_LABELS);

  return <ProjectDetail project={project} labels={labels} />;
}
