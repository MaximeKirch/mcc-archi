import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { siteConfig } from "#/config/site.ts";
import { projectsQueryOptions } from "#/queries/projects.ts";
import { gsap, useGSAP } from "#/lib/gsap.ts";
import { HeroHeader } from "#/components/page/HeroHeader.tsx";
import { ProjectGrid } from "#/components/project/ProjectGrid.tsx";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(projectsQueryOptions),
});

function HomeComponent() {
  const { data: projects } = useSuspenseQuery(projectsQueryOptions);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".js-header-title", {
        y: -30,
        opacity: 0,
        duration: 1.2,
      }).from(
        ".js-header-fade",
        {
          y: -30,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
        },
        "-=0.8",
      )
        .from(
          ".js-header-line",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.5,
            ease: "power3.inOut",
          },
          "-=0.8",
        )
        .from(
          ".js-project-card",
          {
            y: 60,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
          },
          "-=1",
        );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-neutral-50 text-neutral-900 p-4 md:p-8 font-sans antialiased selection:bg-neutral-200"
    >
      <HeroHeader name={siteConfig.name} architect={siteConfig.architect} />
      <main className="max-w-7xl mx-auto">
        <h2 className="js-header-fade mb-8 text-[#515f3c] text-sm md:text-base tracking-widest uppercase font-mono">
          Projets d'architecture
        </h2>
        <ProjectGrid projects={projects} />
      </main>
      <footer className="max-w-7xl mx-auto border-t border-neutral-200/60 mt-32 py-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-neutral-400">
        <div>
          © {new Date().getFullYear()} — {siteConfig.name}.
        </div>
      </footer>
    </div>
  );
}
