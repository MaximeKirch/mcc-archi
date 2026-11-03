import { env } from "#/env.ts";

const SCRIPT_URL = "https://stats.cuccasa.com/script.js";
const TRACKED_DOMAIN = "www.cuccasa.com";

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string>) => void };
  }
}

// No website id (dev, preview): no script at all.
export function umamiScripts() {
  if (!env.VITE_UMAMI_WEBSITE_ID) return [];
  return [
    {
      src: SCRIPT_URL,
      defer: true,
      "data-website-id": env.VITE_UMAMI_WEBSITE_ID,
      "data-domains": TRACKED_DOMAIN,
      "data-do-not-track": "true",
    },
  ];
}

export function track(event: string, data?: Record<string, string>) {
  window.umami?.track(event, data);
}

// Maps a clicked link to an event, null when not worth tracking.
export function linkEvent(link: HTMLAnchorElement): [string, Record<string, string>?] | null {
  const url = new URL(link.href, window.location.href);
  if (url.protocol === "mailto:") return ["clic-email"];
  if (url.protocol === "tel:") return ["clic-telephone"];
  if (url.pathname.toLowerCase().endsWith(".pdf")) {
    return ["ouverture-pdf", { fichier: decodeURIComponent(url.pathname.split("/").pop() ?? "") }];
  }
  if (url.host !== window.location.host && /^https?:$/.test(url.protocol)) {
    return ["clic-externe", { site: url.hostname.replace(/^www\./, "") }];
  }
  return null;
}

// One listener for every link, WordPress-authored ones included.
export function trackLinkClicks(): () => void {
  const onClick = (event: MouseEvent) => {
    const link = (event.target as Element | null)?.closest?.("a[href]");
    if (!(link instanceof HTMLAnchorElement)) return;
    const result = linkEvent(link);
    if (result) track(...result);
  };
  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
