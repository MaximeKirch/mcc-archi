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
    <div
      className={`w-full ${
        sticky ? "bg-neutral-50/80 backdrop-blur sticky top-0 z-50" : ""
      }`}
    >
      <nav className="max-w-[84rem] mx-auto px-4 md:px-8">
        <div className="py-5 md:py-6 flex items-center justify-between border-b border-line font-mono text-xs tracking-[0.6px]">
          <Link
            to="/"
            className="inline-flex items-center min-h-11 md:min-h-0 uppercase text-kaki hover:text-kaki-dark transition-colors"
          >
            ← {backLabel}
          </Link>
          <span className="text-neutral-500">{rightLabel}</span>
        </div>
      </nav>
    </div>
  );
}
