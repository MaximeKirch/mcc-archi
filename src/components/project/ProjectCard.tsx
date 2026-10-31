import { Link } from "@tanstack/react-router";
import type WordPressProject from "#/types/wordpress.ts";

interface ProjectCardProps {
  project: WordPressProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const city = project.acf.architecture_localisation.split(',')[0];

  return (
    <Link
      to="/projets/$slug"
      params={{ slug: project.slug }}
      className="js-project-card group no-underline text-inherit flex flex-col"
    >
      <article className="flex flex-col h-full">
        <div className="aspect-[8.5/10] w-full bg-neutral-100 overflow-hidden relative rounded-sm shadow-sm border border-neutral-200/40">
          {project.acf.architecture_cover_image ? (
            <img
              src={project.acf.architecture_cover_image}
              alt={project.acf.title}
              className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-700 ease-out grayscale-[30%] group-hover:grayscale-0"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 font-mono text-xs">
              [ NO MEDIA ]
            </div>
          )}
          <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/5 transition-colors duration-500 pointer-events-none" />
        </div>

        <div className="pt-3 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-neutral-400 uppercase mb-3">
              <span>{city}</span>
              <span>{project.acf.annee}</span>
            </div>
            <h2 className="text-xl font-light tracking-tight text-neutral-800 uppercase group-hover:text-neutral-500 transition-colors duration-300">
              {project.acf.title || project.title.rendered}
            </h2>
            <div
              className="text-neutral-500 text-sm font-light mt-3 line-clamp-2 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: project.acf.description }}
            />
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
            {project.acf.architecture_surface ? (
              <span>{project.acf.architecture_surface} m²</span>
            ) : null}
            <span className="ml-auto opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              VOIR LE PROJET →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
