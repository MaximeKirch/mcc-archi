import type { RefObject } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "#/lib/gsap.ts";
import type { WordPressImage } from "#/types/wordpress.ts";
import { AnchorNav } from "./AnchorNav.tsx";
import type { Anchor } from "./AnchorNav.tsx";
import { ResponsiveImage } from "./ResponsiveImage.tsx";

interface PageHeroProps {
  title: string;
  image: WordPressImage | null;
  anchors: Anchor[];
}

export function PageHero({ title, image, anchors }: PageHeroProps) {
  return (
    // Hero = viewport minus nav (65px); -mb cancels Section's mt so its line hits the bottom.
    <div className="lg:flex lg:flex-col lg:h-[calc(100svh-65px)] lg:min-h-[600px] lg:-mb-24">
      {/* Trim box to cap height; clip-path lets accents overflow the top. */}
      <h1 className="mt-6 md:mt-12 text-[44px] leading-[52px] tracking-[-2px] md:text-7xl md:leading-[86px] md:tracking-[-3.6px] font-semibold uppercase text-kaki [font-kerning:none] [text-box:trim-both_cap_alphabetic]">
        {title.split(" ").map((word, i) => (
          <span key={i} className="inline-block [clip-path:inset(-0.4em_0_-0.05em_0)] [text-box:trim-both_cap_alphabetic] mr-[0.3em] last:mr-0">
            <span className="js-hero-word inline-block [text-box:trim-both_cap_alphabetic]">{word}</span>
          </span>
        ))}
      </h1>
      <div className="js-hero-line mt-6 md:mt-8 border-t border-line-kaki" />

      <div className="mt-12 lg:mt-0 lg:flex-1 lg:min-h-0 lg:py-16 lg:grid lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)] lg:gap-x-8">
        {image && (
          <ResponsiveImage
            image={image}
            sizes="(min-width: 1024px) 624px, 100vw"
            loading="eager"
            className="js-hero-fade w-full max-w-[624px] aspect-square object-cover rounded-lg lg:self-center lg:h-full lg:max-h-[624px] lg:w-auto"
          />
        )}
        <AnchorNav anchors={anchors} />
      </div>
    </div>
  );
}

export function usePageHeroAnimation(scope: RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".js-hero-word", {
        y: "110%",
        duration: 1.1,
        stagger: 0.08,
      })
        .from(
          ".js-hero-line",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.4,
            ease: "power3.inOut",
          },
          "-=0.7",
        )
        .from(
          ".js-hero-fade",
          {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.15,
          },
          "-=0.8",
        );
    },
    { scope },
  );
}
