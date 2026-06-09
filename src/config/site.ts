import { env } from "#/env.ts";

export const siteConfig = {
  name: "Cuccà[sa] Architettura",
  apiUrl: env.VITE_WP_API_URL,
  acfFormatParam: "acf_format=standard",
};

export type SiteConfig = typeof siteConfig;
