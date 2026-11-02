import { Link, useRouter } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { PageShell } from "./PageShell.tsx";
import { textLinkClass } from "./TextLink.tsx";

interface StatusPageProps {
  code: string;
  navLabel: string;
  title: string;
  text: string;
  children?: React.ReactNode;
}

function StatusPage({ code, navLabel, title, text, children }: StatusPageProps) {
  return (
    <PageShell navLabel={navLabel}>
      <p className="mt-12 md:mt-24 font-mono text-[13px] md:text-sm text-neutral-500">{code}</p>
      <h1 className="mt-2 text-[44px] leading-[52px] tracking-[-2px] md:text-7xl md:leading-[86px] md:tracking-[-3.6px] font-semibold uppercase text-kaki [font-kerning:none]">
        {title}
      </h1>
      <div className="mt-6 md:mt-8 border-t border-line-kaki" />
      <p className="mt-6 md:mt-8 max-w-[520px] text-[17px] leading-[26px] md:text-lg md:leading-7 font-light text-neutral-700">
        {text}
      </p>
      <div className="mt-4 md:mt-6 flex flex-wrap gap-x-8 gap-y-2">
        {children}
        <Link to="/" className={textLinkClass}>
          Retour à l'accueil →
        </Link>
      </div>
    </PageShell>
  );
}

export function NotFoundPage() {
  return (
    <StatusPage
      code="404"
      navLabel="Page introuvable"
      title="Page introuvable"
      text="Cette page n'existe pas ou a été déplacée."
    />
  );
}

export function ErrorPage({ error }: ErrorComponentProps) {
  const router = useRouter();
  const { reset } = useQueryErrorResetBoundary();

  return (
    <StatusPage
      code="Erreur"
      navLabel="Cuccà[sa] Architettura"
      title="Un problème est survenu"
      text="La page n'a pas pu s'afficher. Réessayez dans un instant ou revenez à l'accueil."
    >
      <button
        type="button"
        onClick={() => {
          reset();
          router.invalidate();
        }}
        className={`${textLinkClass} bg-transparent border-0 p-0 cursor-pointer`}
      >
        Réessayer →
      </button>
      {import.meta.env.DEV && (
        <pre className="basis-full mt-6 p-4 overflow-auto text-xs text-red-800 bg-red-50 whitespace-pre-wrap">
          {error instanceof Error ? (error.stack ?? error.message) : String(error)}
        </pre>
      )}
    </StatusPage>
  );
}
