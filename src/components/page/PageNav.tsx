import { Link } from "@tanstack/react-router";

interface PageNavProps {
  backLabel: string;
  rightLabel: string;
  sticky?: boolean;
}

export function PageNav({
  backLabel,
  rightLabel,
  sticky = false,
}: PageNavProps) {
  return (
    <nav
      className={`max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-neutral-200/60 ${
        sticky ? "bg-neutral-50/80 backdrop-blur sticky top-0 z-50" : ""
      }`}
    >
      <Link
        to="/"
        className="text-xs uppercase tracking-widest text-kaki hover:text-neutral-400 transition-colors flex items-center gap-2"
      >
        ← {backLabel}
      </Link>
      <span className="text-xs font-mono text-neutral-400">{rightLabel}</span>
    </nav>
  );
}
