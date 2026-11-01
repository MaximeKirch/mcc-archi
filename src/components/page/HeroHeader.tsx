import { Link } from "@tanstack/react-router";
import { cn } from "#/lib/utils.ts";

interface HeroHeaderProps {
  name: string;
  architect: string;
}

const intro =
  "Studio d’architecture & de conception durable basé à Evisa. Accompagnement sur-mesure pour vos projets de vie et support.";

const linkClass =
  "no-underline text-xs font-mono uppercase tracking-wider text-kaki border-b border-kaki hover:text-neutral-400 hover:border-neutral-400 transition-colors pb-0.5 w-max leading-none [text-box:trim-both_cap_alphabetic]";

// 44px hit area without moving the border underline.
const touchArea = "relative before:absolute before:inset-x-0 before:-inset-y-4";

export function HeroHeader({ name, architect }: HeroHeaderProps) {
  const words = name.split(" ");
  const firstWord = words[0];

  return (
    <header className="max-w-7xl min-[120rem]:max-w-[1800px] mx-auto mt-6 md:mt-8">
      <div className="flex items-start gap-6 lg:grid lg:grid-cols-3 lg:items-stretch">
        <div className="flex-1 overflow-hidden lg:col-span-2 lg:flex lg:flex-col">
          <h1 className="js-header-title text-[clamp(2rem,10.5vw,3rem)] md:text-7xl font-semibold tracking-tighter md:tracking-[0.065em] uppercase leading-[1.2] text-kaki">
            {firstWord}{" "}
          </h1>
          <p className="js-header-title mb-4 mt-6 text-kaki text-sm tracking-[0.065em] uppercase font-mono ">
            {architect} | Architecte DE/HMONP
          </p>
          <p className="js-header-fade hidden lg:block mt-auto w-[436px] text-sm leading-[25px] font-light text-neutral-700 text-justify">
            {intro}
          </p>
        </div>
        <div className="flex flex-col items-end lg:justify-self-end">
          <img
            src="/LOGO-Kaki-transparent-final.png"
            alt="Cuccasa"
            className="js-header-title h-16 md:h-22 w-auto"
            style={{ borderRadius: 0 }}
          />
          <div className="js-header-fade hidden lg:flex lg:flex-col lg:items-end mt-8 gap-1 ">
            <p className="mb-4 text-kaki text-sm tracking-widest uppercase font-mono leading-none [text-box:trim-both_cap_alphabetic]">
              Atelier d'architecture - EVISA | CORSE
            </p>
            <Link to="/atelier" className={cn(linkClass, "mb-2")}>
              L'atelier →
            </Link>
            <Link to="/" className={cn(linkClass, "mb-2")}>
              Portfolio →
            </Link>
            <Link to="/contact" className={linkClass}>
              Nous contacter →
            </Link>
          </div>
        </div>
      </div>
      <div className="js-header-fade mt-4 lg:hidden flex flex-col gap-1">
        <p className="mb-4 text-kaki text-sm tracking-widest uppercase font-mono">
          Atelier d'architecture - EVISA | CORSE
        </p>
        <p className="mb-3 text-[15px] leading-[22px] font-light text-neutral-700">
          {intro}
        </p>
        <nav aria-label="Navigation principale" className="flex flex-col gap-8 py-4">
          <Link to="/atelier" className={cn(linkClass, touchArea)}>
            L'atelier →
          </Link>
          <Link to="/" className={cn(linkClass, touchArea)}>
            Portfolio →
          </Link>
          <Link to="/contact" className={cn(linkClass, touchArea)}>
            Nous contacter →
          </Link>
        </nav>
      </div>
      <div className="js-header-line h-[1px] w-full bg-kaki mt-8" />
    </header>
  );
}
