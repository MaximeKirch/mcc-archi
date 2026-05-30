import type WordPressProject from "#/types/wordpress.ts";
import { ProjectCard } from "./ProjectCard.tsx";

interface ProjectGridProps {
  projects: WordPressProject[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
