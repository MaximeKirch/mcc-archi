import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { projectBySlugQueryOptions } from "#/queries/projects.ts";
import { ProjectDetail } from "#/components/project/ProjectDetail.tsx";

export const Route = createFileRoute("/projets/$slug")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(projectBySlugQueryOptions(params.slug)),
  component: ProjectDetailComponent,
});

function ProjectDetailComponent() {
  const { slug } = Route.useParams();
  const { data: project } = useSuspenseQuery(projectBySlugQueryOptions(slug));

  return <ProjectDetail project={project} />;
}
