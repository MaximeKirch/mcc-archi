import { Link } from "@tanstack/react-router";

interface HeroHeaderProps {
  name: string;
}

const linkClass =
  "no-underline text-xs font-mono uppercase tracking-wider !text-[#515f3c] border-b !border-[#515f3c] hover:!text-neutral-400 hover:!border-neutral-400 transition-colors pb-0.5 w-max";

export function HeroHeader({ name }: HeroHeaderProps) {
  const words = name.split(" ");
  const firstWord = words[0];
  const rest = words.slice(1).join(" ");

  return (
    <header className="max-w-7xl mx-auto mb-8 mt-6 md:mt-8">
      <div className="flex items-start gap-6 lg:grid lg:grid-cols-3 lg:items-start">
        <div className="flex-1 overflow-hidden lg:col-span-2 ">
          <h1 className="js-header-title text-5xl md:text-7xl font-semibold tracking-tighter uppercase leading-[1.2] text-[#515f3c]">
            {firstWord}{" "}
            <span className="font-extralight text-4xl md:text-5xl lowercase">
              {rest}
            </span>
          </h1>
        </div>
        <div className="">
          <img
            src="/kaki_fullpage.svg"
            alt="Cuccasa"
            className="js-header-title h-16 md:h-22 w-auto"
            style={{
              justifySelf: "flex-end",
              borderRadius: 0,
            }}
          />
          <div className="js-header-fade hidden lg:flex lg:flex-col lg:items-end mt-8 gap-1">
            <p className="text-[#515f3c] text-xs tracking-widest uppercase font-mono">
              Atelier d'architecture — Evisa
            </p>
            <Link to="/contact" className={linkClass}>
              Nous contacter →
            </Link>
            <Link to="/about" className={linkClass}>
              À propos de l'atelier →
            </Link>
          </div>
        </div>
      </div>
      <div className="js-header-fade mt-4 lg:hidden flex flex-col gap-1">
        <p className="text-[#515f3c] text-xs tracking-widest uppercase font-mono">
          Atelier d'architecture — Evisa
        </p>
        <Link to="/contact" className={linkClass}>
          Nous contacter →
        </Link>
        <Link to="/about" className={linkClass}>
          À propos de l'atelier →
        </Link>
      </div>
      <div className="js-header-line h-[1px] w-full bg-neutral-200 mt-8" />
    </header>
  );
}
