import { useEffect, useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { WordPressImage } from "#/types/wordpress.ts";
import { cn } from "#/lib/utils.ts";
import { ResponsiveImage } from "./ResponsiveImage.tsx";
import { RichText } from "./Section.tsx";

export interface Slide {
  image: WordPressImage | null;
  titre: string;
  texte_court?: string;
  texte: string;
}

interface CarouselProps {
  slides: Slide[];
  label: string;
}

const SWIPE_MIN = 50;
const DESKTOP = "(min-width: 1024px)";
const pad = (n: number) => String(n).padStart(2, "0");
// Ring drawn inside: the stage clips vertically.
const button =
  "inline-flex items-center justify-center size-11 rounded text-kaki hover:text-kaki-dark transition-colors focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-kaki";
const bodyText = "text-[15px] leading-6 md:text-base md:leading-[26px] text-neutral-700";

// Clamps `text` with "…" and stretches its lines so the last one lands on the bottom of `box`.
function fitText(box: HTMLElement, text: HTMLElement) {
  text.style.cssText = "";
  if (!window.matchMedia(DESKTOP).matches) return;
  const target = box.clientHeight;
  const height = () => text.getBoundingClientRect().height;
  if (!target || height() <= target) return;

  Object.assign(text.style, { display: "-webkit-box", WebkitBoxOrient: "vertical" });
  const clampTo = (n: number) => {
    text.style.webkitLineClamp = String(n);
    return height();
  };
  const lineHeight = parseFloat(getComputedStyle(text).lineHeight);
  let lines = Math.floor(target / lineHeight) + 1;
  let h = clampTo(lines);
  while (lines > 1 && h > target) h = clampTo(--lines);
  if (h > target) {
    // Clamp ignored by the browser: the box still cuts at the image bottom.
    text.style.cssText = "";
    return;
  }
  // One more line squeezed, or these lines stretched: whichever moves less.
  const over = clampTo(lines + 1);
  if (over - target < target - h) {
    lines += 1;
    h = over;
  } else {
    clampTo(lines);
  }
  for (let i = 0; i < 3 && Math.abs(target - h) > 0.5; i++) {
    const current = parseFloat(getComputedStyle(text).lineHeight);
    text.style.lineHeight = `${current + (target - h) / lines}px`;
    h = height();
  }
}

interface SlideViewProps {
  slide: Slide;
  index: number;
  count: number;
  open: boolean;
  suiteId: string;
  onToggle: () => void;
  go: (step: number) => void;
}

function SlideView({ slide, index, count, open, suiteId, onToggle, go }: SlideViewProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  // No short text: the full one takes its place, always shown.
  const resume = slide.texte_court || slide.texte;
  const suite = slide.texte_court ? slide.texte : "";
  const split = Boolean(slide.image && resume);
  const fit = split && Boolean(slide.texte_court);

  useEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!fit || !box || !text || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => fitText(box, text));
    observer.observe(box);
    document.fonts?.ready.then(() => fitText(box, text));
    return () => observer.disconnect();
  }, [fit, resume]);

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr_auto] items-center",
        split && "lg:grid-cols-[auto_1fr_auto_2rem_calc(50%-1rem)]",
      )}
    >
      {slide.image && (
        <ResponsiveImage
          image={slide.image}
          sizes="(min-width: 1024px) 364px, (min-width: 768px) 760px, 100vw"
          loading={index === 0 ? "eager" : "lazy"}
          className={cn(
            "col-span-full row-start-1 block w-full aspect-square object-cover rounded-lg",
            split && "lg:col-span-3",
          )}
        />
      )}

      {count > 1 && (
        <>
          <span
            aria-hidden="true"
            className="row-start-2 col-start-1 mt-2 font-mono text-[11px] tracking-[1.4px] text-neutral-500 tabular-nums"
          >
            {pad(index + 1)} / {pad(count)}
          </span>
          {/* -10px: optical alignment of the chevron on the image edge. */}
          <div className="row-start-2 col-start-3 mt-2 flex items-center gap-1 -mr-2.5">
            <button
              type="button"
              data-control="prev"
              aria-label="Diapositive précédente"
              className={button}
              onClick={() => go(-1)}
            >
              <ChevronLeft size={24} strokeWidth={1.6} aria-hidden="true" />
            </button>
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
        </>
      )}

      {suite && (
        <button
          type="button"
          data-control="suite"
          aria-expanded={open}
          aria-controls={suiteId}
          onClick={onToggle}
          className={cn(
            "row-start-2 mt-2 inline-flex items-center min-h-11 font-mono text-xs tracking-[0.6px] uppercase text-kaki hover:text-kaki-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kaki",
            count > 1 ? "col-start-2 justify-self-center" : "col-start-1 justify-self-start",
            split && "lg:col-start-5 lg:justify-self-end",
          )}
        >
          {open ? "Voir moins −" : "Voir plus +"}
        </button>
      )}

      {resume && (
        // Desktop: sized by the image row only. The clip spares accents and descenders.
        <div
          ref={boxRef}
          className={cn(
            "col-span-full row-start-3 mt-4 md:mt-3",
            split && "lg:col-start-5 lg:col-span-1 lg:row-start-1 lg:mt-0 lg:self-stretch",
            fit && "lg:[contain:size] lg:[clip-path:inset(-0.5em_-1em_-0.3em_-1em)]",
          )}
        >
          <RichText
            ref={textRef}
            html={resume}
            className={cn(bodyText, split && "lg:[text-box:trim-both_cap_alphabetic]")}
          />
        </div>
      )}

      {suite && (
        <div
          id={suiteId}
          hidden={!open}
          // 16px: room left under the chevron ink, so the seen gap matches image to text.
          className={cn("col-span-full row-start-4 mt-4", split && "lg:mt-4")}
        >
          <RichText
            html={suite}
            className={cn(bodyText, split && "lg:[text-box:trim-start_cap_alphabetic]")}
          />
        </div>
      )}
    </div>
  );
}

export function Carousel({ slides, label }: CarouselProps) {
  const [index, setIndex] = useState(0);
  // Shared: a reader who opened one slide's text wants the next ones open too.
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState<number>();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const pendingFocus = useRef<string | null>(null);
  const baseId = useId();
  const count = slides.length;

  // Stage height follows the active slide (auto until hydrated).
  useEffect(() => {
    const active = stageRef.current?.querySelector<HTMLElement>("[data-active]");
    if (!active || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.borderBoxSize[0]?.blockSize ?? entry.target.getBoundingClientRect().height);
    });
    observer.observe(active);
    return () => observer.disconnect();
  }, [index]);

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
      {/* Only the active slide is in flow; the others sit on top of it, faded out. */}
      <div
        ref={stageRef}
        style={{ height }}
        className="relative overflow-y-clip touch-pan-y transition-[height] duration-[180ms] ease-out motion-reduce:transition-none"
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
                "duration-[180ms] motion-reduce:transition-none",
                // Shown at once (so its buttons can take focus), hidden after the fade.
                active
                  ? "relative opacity-100 transition-opacity"
                  : "absolute inset-x-0 top-0 invisible opacity-0 transition-[opacity,visibility]",
              )}
            >
              {slide.titre && (
                <h4 className="max-w-[calc(100%-24px)] text-base leading-5 mb-2 md:max-w-[calc(100%-32px)] md:text-lg md:leading-[22px] font-semibold uppercase tracking-[-0.2px] text-neutral-700">
                  {slide.titre}
                </h4>
              )}
              <SlideView
                slide={slide}
                index={i}
                count={count}
                open={open}
                suiteId={`${baseId}-suite-${i}`}
                onToggle={() => setOpen((o) => !o)}
                go={go}
              />
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
