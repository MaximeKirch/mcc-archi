import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { cn } from "#/lib/utils.ts";

export const textLinkClass =
  "inline-flex items-center min-h-11 md:min-h-0 font-mono text-xs tracking-[0.6px] uppercase underline text-kaki hover:text-kaki-dark transition-colors";

interface TextLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

// For hrefs typed by the client in WordPress: internal paths stay in the router.
export function TextLink({ href, children, className }: TextLinkProps) {
  const classes = cn(textLinkClass, className);
  if (!href.startsWith("/")) {
    return (
      <a href={href} className={classes}>
        {children} →
      </a>
    );
  }
  const [path, hash] = href.split("#");
  return (
    <Link to={path as LinkProps["to"]} hash={hash} className={classes}>
      {children} →
    </Link>
  );
}
