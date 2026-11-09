import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { HOME_LABELS } from "#/config/labels.ts";
import { gsap, prefersReducedMotion, useGSAP } from "#/lib/gsap.ts";

interface PageNavProps {
  backLabel: string;
  rightLabel: string;
  sticky?: boolean;
  showLinks?: boolean;
  bordered?: boolean;
  // Mobile: arrow only, label kept for screen readers.
  compactBack?: boolean;
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
  bordered = true,
  compactBack = false,
}: PageNavProps) {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = useLocation({ select: (location) => location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  useGSAP(
    () => {
      const panel = ".js-nav-panel";
      const duration = prefersReducedMotion() ? 0 : 0.35;
      if (open) {
        gsap.to(panel, { autoAlpha: 1, y: 0, duration, ease: "power3.out" });
        gsap.fromTo(
          ".js-nav-panel li",
          { autoAlpha: 0, y: -6 },
          { autoAlpha: 1, y: 0, duration, stagger: duration && 0.05, ease: "power3.out" },
        );
      } else {
        gsap.to(panel, { autoAlpha: 0, y: -8, duration: duration * 0.6, ease: "power2.in" });
      }
    },
    { scope: navRef, dependencies: [open] },
  );

  return (
    <div
      className={`w-full ${
        sticky ? "bg-neutral-50/80 backdrop-blur sticky top-0 z-50" : "relative z-40"
      }`}
    >
      <nav ref={navRef} className="relative max-w-[84rem] mx-auto px-4 md:px-8">
        <div className={`py-5 md:py-6 flex items-center justify-between font-mono text-xs tracking-[0.6px] ${bordered ? "border-b border-kaki" : ""}`}>
          <Link
            to="/"
            className={`inline-flex items-center min-h-11 md:min-h-0 uppercase text-kaki hover:text-kaki-dark transition-colors ${compactBack ? "min-w-11 md:min-w-0" : ""}`}
          >
            <span aria-hidden="true">←</span>
            <span className={compactBack ? "max-md:sr-only" : ""}>&nbsp;{backLabel}</span>
          </Link>
          {showLinks ? (
            <>
              <button
                ref={buttonRef}
                type="button"
                aria-expanded={open}
                aria-controls="nav-mobile"
                aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                onClick={() => setOpen((o) => !o)}
                className="lg:hidden -mr-3 size-11 flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer text-kaki"
              >
                <span aria-hidden="true" className="relative block w-5 h-[7px]">
                  <span className={`absolute left-0 w-full h-px bg-current transition-transform duration-300 motion-reduce:transition-none ${open ? "top-[3px] rotate-45" : "top-0"}`} />
                  <span className={`absolute left-0 w-full h-px bg-current transition-transform duration-300 motion-reduce:transition-none ${open ? "top-[3px] -rotate-45" : "top-[6px]"}`} />
                </span>
              </button>
              <ul className="hidden lg:flex items-center gap-8 uppercase">
                {NAV_LINKS.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink to={to} label={label} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <span className="text-neutral-500">{rightLabel}</span>
          )}
        </div>

        {showLinks && (
          // Starts hidden; GSAP toggles visibility.
          <div
            id="nav-mobile"
            inert={!open}
            className="js-nav-panel invisible opacity-0 lg:hidden absolute inset-x-4 md:inset-x-8 top-full bg-neutral-50 border-b border-kaki"
          >
            <ul className="font-mono text-xs tracking-[0.6px] uppercase">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to} className="border-b border-line-kaki last:border-b-0">
                  <NavLink
                    to={to}
                    label={label}
                    onClick={() => setOpen(false)}
                    className="flex items-center min-h-12 py-2"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}

interface NavLinkProps {
  to: (typeof NAV_LINKS)[number]["to"];
  label: string;
  className?: string;
  onClick?: () => void;
}

function NavLink({ to, label, className = "", onClick }: NavLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`hover:text-kaki transition-colors ${className}`}
      activeProps={{ className: "font-bold text-kaki" }}
      inactiveProps={{ className: "text-neutral-500" }}
    >
      {label}
    </Link>
  );
}
