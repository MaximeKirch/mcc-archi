import { Link } from "@tanstack/react-router";
import { HOME_LABELS } from "#/config/labels.ts";

interface PageNavProps {
  backLabel: string;
  rightLabel: string;
  sticky?: boolean;
  showLinks?: boolean;
}

const NAV_LINKS = [
  { to: "/atelier", label: HOME_LABELS.lien_atelier },
  { to: "/portfolio", label: HOME_LABELS.lien_portfolio },
  { to: "/contact", label: HOME_LABELS.lien_contact },
] as const;

export function PageNav({
  backLabel,
  rightLabel,
  sticky = false,
  showLinks = false,
}: PageNavProps) {
  return (
    <div
      className={`w-full ${
        sticky ? "bg-neutral-50/80 backdrop-blur sticky top-0 z-50" : ""
      }`}
    >
      <nav className="max-w-[84rem] mx-auto px-4 md:px-8">
        <div className="py-5 md:py-6 flex items-center justify-between border-b border-line-kaki font-mono text-xs tracking-[0.6px]">
          <Link
            to="/"
            className="inline-flex items-center min-h-11 md:min-h-0 uppercase text-kaki hover:text-kaki-dark transition-colors"
          >
            ← {backLabel}
          </Link>
          <span className={`text-neutral-500 ${showLinks ? "lg:hidden" : ""}`}>
            {rightLabel}
          </span>
          {showLinks && (
            <ul className="hidden lg:flex items-center gap-8 uppercase">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="hover:text-kaki transition-colors"
                    activeProps={{ className: "font-bold text-kaki" }}
                    inactiveProps={{ className: "text-neutral-500" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
}
