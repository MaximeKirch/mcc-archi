import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { WordPressImage } from "#/types/wordpress.ts";
import { cn } from "#/lib/utils.ts";
import { ResponsiveImage } from "./ResponsiveImage.tsx";
import { RichText, titleGap } from "./Section.tsx";

export interface Slide {
  image: WordPressImage | null;
  titre: string;
  texte: string;
}

interface CarouselProps {
  slides: Slide[];
  label: string;
}

const SWIPE_MIN = 50;
const pad = (n: number) => String(n).padStart(2, "0");
const button =
  "inline-flex items-center justify-center size-11 rounded text-kaki hover:text-kaki-dark transition-colors focus-visible:outline-2 focus-visible:outline-kaki";

export function Carousel({ slides, label }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const pendingFocus = useRef<string | null>(null);
  const count = slides.length;

  // Each slide has its own buttons: carry focus over to the new slide's.
  useEffect(() => {
    if (!pendingFocus.current) return;
    rootRef.current
      ?.querySelector<HTMLElement>(`[data-active] [data-control="${pendingFocus.current}"]`)
      ?.focus();
    pendingFocus.current = null;
  }, [index]);

  if (!count) return null;

  const go = (step: number) => {
    const focused = document.activeElement;
    if (rootRef.current?.querySelector("[data-active]")?.contains(focused)) {
      pendingFocus.current = focused?.getAttribute("data-control") ?? null;
      if (!pendingFocus.current) rootRef.current.focus();
    }
    setIndex((i) => (i + step + count) % count);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (count < 2) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      go(e.key === "ArrowLeft" ? -1 : 1);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || count < 2) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs(e.clientY - start.y)) {
      go(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div
      ref={rootRef}
      role="group"
      aria-roledescription="carrousel"
      aria-label={label}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="outline-none"
    >
      {/* Slides share one grid cell: the tallest sets the height, so nothing jumps. */}
      <div
        className="grid touch-pan-y"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") swipeStart.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipeStart.current = null)}
      >
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={i}
              role="group"
              aria-roledescription="diapositive"
              aria-label={`${i + 1} sur ${count}`}
              inert={!active}
              data-active={active || undefined}
              className={cn(
                "[grid-area:1/1] flex flex-col md:grid md:grid-cols-[240px_minmax(0,1fr)] md:grid-rows-[1fr_auto] md:gap-x-12",
                "transition-[opacity,visibility] duration-[180ms] motion-reduce:transition-none",
                active ? "opacity-100" : "invisible opacity-0",
              )}
            >
              {slide.image && (
                <ResponsiveImage
                  image={slide.image}
                  sizes="(min-width: 768px) 240px, 100vw"
                  loading={i === 0 ? "eager" : "lazy"}
                  className="block w-full aspect-[4/5] object-cover rounded-lg md:row-start-1 md:col-start-1"
                />
              )}
              {/* Mobile: right under the image. Desktop: bottom of the slide. */}
              {count > 1 && (
                <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-5 md:row-start-2 md:col-span-full">
                  <button
                    type="button"
                    data-control="prev"
                    aria-label="Diapositive précédente"
                    className={button}
                    onClick={() => go(-1)}
                  >
                    <ChevronLeft size={24} strokeWidth={1.6} aria-hidden="true" />
                  </button>
                  <span
                    aria-hidden="true"
                    className="font-mono text-[11px] tracking-[1.4px] text-neutral-500 tabular-nums"
                  >
                    {pad(i + 1)} / {pad(count)}
                  </span>
                  <button
                    type="button"
                    data-control="next"
                    aria-label="Diapositive suivante"
                    className={button}
                    onClick={() => go(1)}
                  >
                    <ChevronRight size={24} strokeWidth={1.6} aria-hidden="true" />
                  </button>
                </div>
              )}
              <div className="mt-4 md:mt-0 md:row-start-1 md:col-start-2 max-w-[760px]">
                {slide.titre && (
                  <h4
                    className={`${titleGap} text-xl leading-7 tracking-[-0.5px] md:text-2xl md:leading-8 md:tracking-[-0.6px] font-semibold uppercase text-kaki`}
                  >
                    {slide.titre}
                  </h4>
                )}
                {slide.texte && (
                  <RichText
                    html={slide.texte}
                    className="text-[15px] leading-6 md:text-base md:leading-[26px] text-neutral-700"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <p aria-live="polite" className="sr-only">
          Diapositive {index + 1} sur {count}
        </p>
      )}
    </div>
  );
}
