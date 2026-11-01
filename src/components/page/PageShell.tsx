import { PageNav } from "./PageNav.tsx";
import { SiteFooter } from "./SiteFooter.tsx";

interface PageShellProps {
  navLabel: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

// Inner pages: nav, 1280px content column (maquette 1440 minus 2x80), footer.
export function PageShell({ navLabel, children, ref }: PageShellProps) {
  return (
    <div
      ref={ref}
      className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased flex flex-col"
    >
      <PageNav backLabel="Accueil" rightLabel={navLabel} />
      <div className="flex-1 flex flex-col max-w-[84rem] w-full mx-auto px-4 md:px-8">
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
