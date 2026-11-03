import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "#/lib/seo.ts";
import { fetchProjects } from "#/queries/projects.ts";

const STATIC_PATHS = ["/", "/atelier", "/portfolio", "/contact"];

function urlEntry(path: string, lastmod?: string): string {
  const lastmodTag = lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : "";
  return `<url><loc>${absoluteUrl(path)}</loc>${lastmodTag}</url>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const projects = await fetchProjects();
        const entries = [
          ...STATIC_PATHS.map((path) => urlEntry(path)),
          ...projects.map((p) => urlEntry(`/projets/${encodeURIComponent(p.slug)}`, p.modified)),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join("")}</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
