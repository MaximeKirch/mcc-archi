import { createMiddleware } from "@tanstack/react-start";
import { siteConfig } from "#/config/site.ts";

const PREVIEW_PARAM = "apercu";
const PREVIEW_MAX_AGE = 60 * 60 * 24 * 30;
const STATUS_TTL_MS = 10_000;
const STATUS_URL = siteConfig.apiUrl.replace(/\/wp\/v2\/?$/, "/cuccasa/v1/statut");

let cachedStatus: { active: boolean; at: number } | null = null;

// WP unreachable: stay closed rather than show a half-filled site.
async function fetchMaintenanceActive(): Promise<boolean> {
  if (cachedStatus && Date.now() - cachedStatus.at < STATUS_TTL_MS) {
    return cachedStatus.active;
  }
  let active = true;
  try {
    const response = await fetch(STATUS_URL, { signal: AbortSignal.timeout(3000) });
    if (response.ok) active = Boolean((await response.json()).maintenance);
  } catch {}
  cachedStatus = { active, at: Date.now() };
  return active;
}

function readCookie(request: Request, name: string): string | undefined {
  const cookies = request.headers.get("cookie") ?? "";
  for (const part of cookies.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return value.join("=");
  }
  return undefined;
}

// `?apercu=<token>` stores the token in a cookie, any other value clears it.
export async function handleMaintenance(
  request: Request,
  token: string | undefined,
  isActive: () => Promise<boolean>,
): Promise<Response | null> {
  const url = new URL(request.url);
  const param = url.searchParams.get(PREVIEW_PARAM);
  if (param !== null) {
    url.searchParams.delete(PREVIEW_PARAM);
    const cookie =
      token && param === token
        ? `${PREVIEW_PARAM}=${token}; Path=/; Max-Age=${PREVIEW_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`
        : `${PREVIEW_PARAM}=; Path=/; Max-Age=0`;
    return new Response(null, {
      status: 302,
      headers: { Location: url.pathname + url.search, "Set-Cookie": cookie },
    });
  }

  if (token && readCookie(request, PREVIEW_PARAM) === token) return null;
  if (!(await isActive())) return null;

  return new Response(MAINTENANCE_HTML, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Retry-After": "3600",
    },
  });
}

export const maintenanceMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    // Staging is already behind Vercel login.
    if (process.env.VERCEL_ENV === "preview") return next();
    const response = await handleMaintenance(
      request,
      process.env.MAINTENANCE_PREVIEW_TOKEN,
      fetchMaintenanceActive,
    );
    return response ?? next();
  },
);

const MAINTENANCE_HTML = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${siteConfig.name}</title>
<link rel="icon" href="/favicon.ico">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..600&display=swap">
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; box-sizing: border-box;
    background: #fafafa; color: #171717; font-family: "Manrope", ui-sans-serif, system-ui, sans-serif; text-align: center; }
  img { height: 88px; width: auto; }
  p { margin: 32px 0 0; font-weight: 300; line-height: 1.6; }
  .label { color: #515f3c; font-size: 14px; letter-spacing: 0.065em; text-transform: uppercase; }
  a { color: #515f3c; }
</style>
</head>
<body>
<main>
  <img src="/LOGO-Kaki-transparent-final.png" alt="${siteConfig.name}">
  <p>Le site est en préparation.<br>Revenez très bientôt.</p>
  <p><a href="mailto:contact@cuccasa.com">contact@cuccasa.com</a></p>
</main>
</body>
</html>`;
