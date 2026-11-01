import { env } from "#/env.ts";

export const siteConfig = {
  name: "Cuccà[sa] Architettura",
  architect: "Marie Coulombon-Casanova",
  description:
    "Studio d'architecture et de conception durable basé à Evisa, en Corse. Accompagnement sur-mesure des particuliers et des agences d'architecture.",
  apiUrl: env.VITE_WP_API_URL,
  acfFormatParam: "acf_format=standard",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/mcc_architecture/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/marie-coulombon-casanova/" },
  ],
};

export type SiteConfig = typeof siteConfig;
