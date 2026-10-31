import { Link } from "@tanstack/react-router";
import { cn } from "#/lib/utils.ts";

interface HeroHeaderProps {
  name: string;
  architect: string;
}

const linkClass =
  "no-underline text-xs font-mono uppercase tracking-wider !text-[#515f3c] border-b !border-[#515f3c] hover:!text-neutral-400 hover:!border-neutral-400 transition-colors pb-0.5 w-max leading-none [text-box:trim-both_cap_alphabetic]";

export function HeroHeader({ name, architect }: HeroHeaderProps) {
  const words = name.split(" ");
  const firstWord = words[0];

  return (
    <header className="max-w-7xl min-[120rem]:max-w-[1800px] mx-auto mt-6 md:mt-8">
      <div className="flex items-start gap-6 lg:grid lg:grid-cols-3 lg:items-start">
        <div className="flex-1 overflow-hidden lg:col-span-2 ">
          <h1 className="js-header-title text-[clamp(2rem,10.5vw,3rem)] md:text-7xl font-semibold tracking-tighter md:tracking-[0.065em] uppercase leading-[1.2] text-[#515f3c]">
            {firstWord}{" "}
          </h1>
          <p className="js-header-title mb-4 mt-6 text-[#515f3c] text-sm tracking-[0.065em] uppercase font-mono ">
            {architect} | Architecte DE/HMONP
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
            <p className="mb-4 text-[#515f3c] text-sm tracking-widest uppercase font-mono leading-none [text-box:trim-both_cap_alphabetic]">
              Atelier d'architecture - EVISA | CORSE
            </p>
            <Link to="/contact" className={cn(linkClass, "mb-2")}>
              Nous contacter →
            </Link>
            <Link to="/about" className={linkClass}>
              À propos de l'atelier →
            </Link>
          </div>
        </div>
      </div>
      <div className="js-header-fade mt-4 lg:hidden flex flex-col gap-1">
        <p className="mb-4 text-[#515f3c] text-sm tracking-widest uppercase font-mono">
          Atelier d'architecture - EVISA | CORSE
        </p>
        <Link to="/contact" className={linkClass}>
          Nous contacter →
        </Link>
        <Link to="/about" className={linkClass}>
          À propos de l'atelier →
        </Link>
      </div>
      <div className="js-header-line h-[1px] w-full bg-[#515f3c] mt-8" />
    </header>
  );
}
