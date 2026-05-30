import { useRef } from "react";
import type WordPressProject from "#/types/wordpress.ts";
import { gsap, useGSAP } from "#/lib/gsap.ts";
import { siteConfig } from "#/config/site.ts";
import { PageNav } from "../page/PageNav.tsx";
import { ProjectSpecs } from "./ProjectSpecs.tsx";
import { ProjectGallery } from "./ProjectGallery.tsx";
import { AnimatedTitle } from "./AnimatedTitle.tsx";

interface ProjectDetailProps {
  project: WordPressProject;
}

function getGallery(project: WordPressProject): string[] {
  return [
    project.acf.image_1,
    project.acf.image_2,
    project.acf.image_3,
    project.acf.image_4,
    project.acf.image_5,
    project.acf.image_6,
  ].filter((img): img is string => typeof img === "string" && img !== "");
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const gallery = getGallery(project);
  const title = project.acf.title || project.title.rendered;

  const coverRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      coverRef.current,
      { clipPath: "inset(0 0 100% 0)" },
      { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "power4.inOut" },
    );

    if (imgRef.current) {
      tl.fromTo(
        imgRef.current,
        { scale: 1.15 },
        { scale: 1, duration: 1.4, ease: "power4.inOut" },
        "<",
      );
    }
  });

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased">
      <PageNav
        backLabel="Retour aux projets"
        rightLabel={`Projet / ${project.acf.title}`}
        sticky
      />

      <header
        ref={coverRef}
        className="w-full h-[65vh] bg-neutral-200 overflow-hidden relative"
      >
        {project.acf.architecture_cover_image ? (
          <img
            ref={imgRef}
            src={project.acf.architecture_cover_image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-500">
            Aucun visuel de couverture disponible
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 to-transparent pointer-events-none" />
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 items-start border-b border-neutral-200 pb-16">
          <div className="lg:col-span-2 space-y-6">
            <AnimatedTitle
              title={title}
              className="text-3xl md:text-5xl font-light tracking-tight text-neutral-900 uppercase"
              delay={0.7}
            />
            <div
              className="text-neutral-600 leading-relaxed text-base md:text-lg space-y-4 font-light max-w-2xl"
              dangerouslySetInnerHTML={{ __html: project.acf.description }}
            />
          </div>
          <ProjectSpecs
            localisation={project.acf.architecture_localisation}
            annee={project.acf.annee}
            surface={project.acf.architecture_surface}
          />
        </div>

        <ProjectGallery images={gallery} projectTitle={title} />
      </main>

      <footer className="border-t border-neutral-200/60 bg-neutral-100 py-12 mt-24 text-center text-xs text-neutral-400 font-mono">
        © {new Date().getFullYear()} — {siteConfig.name}. Tous droits réservés.
      </footer>
    </div>
  );
}
