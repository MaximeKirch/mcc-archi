import { Link } from "@tanstack/react-router";

interface HeroHeaderProps {
  name: string;
}

export function HeroHeader({ name }: HeroHeaderProps) {
  const words = name.split(" ");
  const firstWord = words[0];
  const rest = words.slice(1).join(" ");

  return (
    <header className="max-w-7xl mx-auto mb-20 mt-12 md:mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
        <div className="lg:col-span-2 overflow-hidden">
          <h1 className="js-header-fade text-5xl md:text-7xl font-extralight tracking-tighter uppercase leading-none text-neutral-900">
            {firstWord} <span className="font-semibold">{rest}</span>
          </h1>
        </div>
        <div className="pb-2">
          <div className="js-header-fade lg:text-right">
            <p className="text-neutral-400 text-xs tracking-widest uppercase font-mono">
              Studio d'architecture — Montréal
            </p>
            <Link
              to="/contact"
              className="mt-3 lg:mt-1 text-xs font-mono uppercase tracking-wider text-neutral-900 hover:text-neutral-400 transition-colors border-b border-neutral-400 hover:border-neutral-900 pb-0.5 inline-block w-max"
            >
              Discuter d'un projet →
            </Link>
          </div>
        </div>
      </div>
      <div className="js-header-line h-[1px] w-full bg-neutral-200 mt-8" />
    </header>
  );
}
