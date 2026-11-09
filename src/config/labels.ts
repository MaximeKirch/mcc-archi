// Default texts, editable in each page's "Libellés" tab.
export const HOME_LABELS = {
  titre_projets: "Projets d'architecture",
  titre_accompagnement: "Deux niveaux d'accompagnement",
  titre_architecte: "Architecte DE/HMONP",
  localisation: "Atelier d'architecture - EVISA | CORSE",
  lien_atelier: "L'atelier",
  lien_portfolio: "Portfolio",
  lien_contact: "Contact",
};

export const CONTACT_LABELS = {
  titre_email: "Email",
  titre_telephone: "Téléphone",
  titre_adresse: "Adresse",
  titre_reseaux: "Réseaux sociaux",
  champ_nom: "Nom et prénom",
  champ_email: "Email",
  champ_profil: "Vous êtes",
  profil_particulier: "Particulier",
  profil_agence: "Agence d'architecture",
  champ_message: "Message",
  champ_placeholder_message: "Dites nous en plus sur votre projet : localisation, type de mission, surface, budget, besoins, etc.",
  bouton: "Envoyer le message",
  mention_donnees: "Vos données nous servent uniquement à vous répondre.",
  confirmation:
    "Merci, votre message a bien été envoyé. Le studio vous répondra dans les meilleurs délais.",
};

// Stored on the Portfolio page.
export const PROJECT_LABELS = {
  retour: "Retour aux projets",
  prefixe: "Projet",
  fiche_technique: "Fiche Technique",
  localisation: "Localisation",
  annee: "Année de livraison",
  superficie: "Superficie",
  sans_couverture: "Aucun visuel de couverture disponible",
};

export type HomeLabels = typeof HOME_LABELS;
export type ContactLabels = typeof CONTACT_LABELS;
export type ProjectLabels = typeof PROJECT_LABELS;

// Empty or missing values keep the default.
export function withDefaults<T extends Record<string, string>>(
  values: Partial<T> | null | undefined,
  defaults: T,
): T {
  const merged = { ...defaults };
  for (const key in defaults) {
    const value = values?.[key];
    if (value) merged[key] = value;
  }
  return merged;
}
