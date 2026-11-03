import { env } from "#/env.ts";

export const siteConfig = {
  name: "Cuccà[sa] Architettura",
  architect: "Marie Coulombon-Casanova",
  description:
    "Un atelier pluridisciplinaire pour accompagner, analyser, et réaliser vos projets en faveur d'une architecture locale et singulière.",
  url: "https://www.cuccasa.com",
  logo: "/LOGO-Kaki-transparent-final.png",
  defaultImage: "/LOGO - Fond kaki 2.png",
  areaServed: ["Corse", "France"],
  apiUrl: env.VITE_WP_API_URL,
  acfFormatParam: "acf_format=standard",
};

export type SiteConfig = typeof siteConfig;
