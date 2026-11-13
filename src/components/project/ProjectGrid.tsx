import type WordPressProject from "#/types/wordpress.ts";
import { cn } from "#/lib/utils.ts";
import { ProjectCard } from "./ProjectCard.tsx";

interface ProjectGridProps {
  projects: WordPressProject[];
  // Needs `carteVar` on an ancestor.
  fitScreen?: boolean;
}

// Home, desktop: card width that lets hero + first row fill the screen.
// 515px: hero, title, card text and 24px margin (next row starts 8px under the fold). 0.85: the 8.5/10 image. 260px floor.
export const carteVar = "lg:[--carte:max(260px,calc((100svh_-_515px)_*_0.85))]";
// Page wide enough for three such cards.
export const largeurPage =
  "lg:max-w-[max(80rem,calc(3_*_var(--carte)_+_4rem))] min-[120rem]:max-w-[max(1800px,calc(3_*_var(--carte)_+_4rem))]";
const fitScreenClass =
  "lg:grid-cols-[repeat(3,min(calc((100%_-_4rem)_/_3),var(--carte)))] lg:justify-between";

export function ProjectGrid({ projects, fitScreen = false }: ProjectGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8",
        fitScreen ? fitScreenClass : "lg:grid-cols-3 min-[120rem]:grid-cols-4",
      )}
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
