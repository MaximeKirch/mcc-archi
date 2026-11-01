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
    <>
      <h1 className="mt-12 md:mt-24 text-[44px] leading-[52px] tracking-[-2px] md:text-7xl md:leading-[86px] md:tracking-[-3.6px] font-semibold uppercase text-kaki [font-kerning:none]">
        {title.split(" ").map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
            <span className="js-hero-word inline-block">{word}</span>
          </span>
        ))}
      </h1>
      <div className="js-hero-line mt-6 md:mt-8 border-t border-line-kaki" />

      <div className="mt-6 lg:mt-12 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {image && (
          <ResponsiveImage
            image={image}
            sizes="(min-width: 1024px) 624px, 100vw"
            loading="eager"
            className="js-hero-fade w-full max-w-[624px] aspect-square object-cover rounded-lg"
          />
        )}
        <AnchorNav anchors={anchors} />
      </div>
    </>
  );
}
