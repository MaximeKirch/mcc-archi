import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { siteConfig } from "#/config/site.ts";
import { gsap, prefersReducedMotion, useGSAP } from "#/lib/gsap.ts";
import { seoMeta } from "#/lib/seo.ts";
import { PageNav } from "#/components/page/PageNav.tsx";
import { SiteFooter } from "#/components/page/SiteFooter.tsx";
import { aboutPageQueryOptions } from "#/queries/about.ts";

export const Route = createFileRoute("/atelier")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(aboutPageQueryOptions),
  head: () => ({ meta: seoMeta(undefined, { title: `L'atelier | ${siteConfig.name}` }) }),
  component: AboutComponent,
});

function AboutComponent() {
  const { data: page } = useSuspenseQuery(aboutPageQueryOptions);
  const containerRef = useRef<HTMLDivElement>(null);
  const words = page.title.rendered.split(" ");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".js-about-word", {
        y: "110%",
        duration: 1.1,
        stagger: 0.08,
      })
        .from(
          ".js-about-line",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.4,
            ease: "power3.inOut",
          },
          "-=0.7",
        )
        .from(
          ".js-about-content",
          {
            opacity: 0,
            y: 30,
            duration: 1,
          },
          "-=0.8",
        );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased flex flex-col"
    >
      <PageNav backLabel="Accueil" rightLabel="L'Atelier" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter [font-kerning:none] uppercase leading-[1.2] text-kaki">
          {words.map((word, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden mr-[0.3em] last:mr-0"
            >
              <span className="js-about-word inline-block">{word}</span>
            </span>
          ))}
        </h1>

        <div className="js-about-line h-[1px] w-full bg-kaki mt-8 mb-12" />

        <div
          className="js-about-content prose prose-neutral max-w-3xl prose-headings:font-semibold prose-headings:tracking-tight prose-headings:[font-kerning:none] prose-headings:text-kaki prose-headings:uppercase prose-a:text-kaki prose-strong:text-kaki prose-p:text-neutral-700 prose-p:leading-relaxed [&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none"
          dangerouslySetInnerHTML={{ __html: page.acf.about_description }}
        />
      </main>

      <SiteFooter className="px-6" />
    </div>
  );
}
