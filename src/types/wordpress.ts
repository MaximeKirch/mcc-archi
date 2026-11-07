import type { ContactLabels, HomeLabels, ProjectLabels } from "#/config/labels.ts";

export default interface WordPressProject {
  id: number;
  slug: string;
  modified: string;
  categories: number[];
  title: {
    rendered: string;
  };
  acf: {
    title: string;
    description: string;
    annee: number;
    architecture_localisation: string;
    architecture_cover_image: string;
    architecture_surface: number;
    image_1: string | false;
    image_2: string | false;
    image_3: string | false;
    image_4: string | false;
    image_5: string | false;
    image_6: string | false;
    image_7: string | false;
    image_8: string | false;
    image_9: string | false;
    image_10: string | false;
  };
}

export interface WordPressPage<Acf> {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: Acf & SeoFields;
}

export interface SeoFields {
  seo_titre: string;
  seo_description: string;
}

export interface AccompanimentItem {
  numero: string;
  libelle: string;
  texte: string;
  texte_lien: string;
  cible_lien: string;
}

export interface HomeAcf {
  accroche: string;
  accompagnement: AcfList<AccompanimentItem>;
  libelles?: Partial<HomeLabels>;
}

export interface WordPressImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  sizes: Record<string, string | number>;
}

type AcfList<T> = T[] | false | "";
type AcfImage = WordPressImage | false | null;

export interface CarouselSlide {
  image: AcfImage;
  titre: string;
  texte: string;
}

// Flexible content row: `acf_fc_layout` names the layout.
interface AcfSection {
  titre: string;
  ancre: string;
}

export type AtelierBloc = { titre: string } & (
  | {
      acf_fc_layout: "presentation";
      accroche: string;
      texte_principal: string;
      texte_secondaire: string;
      citation: string;
      texte_final: string;
      // Missing until the backend field ships.
      carrousel?: AcfList<CarouselSlide>;
    }
  | { acf_fc_layout: "texte"; texte: string; texte_lien: string; cible_lien: string }
  | { acf_fc_layout: "liste"; intro: string; elements: AcfList<{ titre: string; texte: string }> }
  | { acf_fc_layout: "texte_riche"; contenu: string }
  | { acf_fc_layout: "diplomes"; elements: AcfList<{ lieu: string; intitule: string }> }
  | { acf_fc_layout: "missions"; elements: AcfList<{ libelle: string }> }
  | { acf_fc_layout: "encadre"; texte: string; texte_bouton: string; email: string }
);

export interface AtelierSection extends AcfSection {
  acf_fc_layout: "section";
  blocs: AcfList<AtelierBloc>;
}

export interface AtelierAcf {
  photo_hero: AcfImage;
  sections: AcfList<AtelierSection>;
}

export interface RechercheFiche {
  titre: string;
  annee: string;
  etiquette: string;
  pdf: { url: string; filename: string } | false | null;
  couverture: AcfImage;
  resume: string;
}

export interface SavoirFaireFiche {
  titre: string;
  dates: string;
  etiquette: string;
  lieu: string;
  photo: AcfImage;
  description: string;
}

export type PortfolioSection = AcfSection &
  (
    | { acf_fc_layout: "projets" }
    | { acf_fc_layout: "recherches"; texte_lien: string; fiches: AcfList<RechercheFiche> }
    | { acf_fc_layout: "savoir_faire"; fiches: AcfList<SavoirFaireFiche> }
  );

export interface PortfolioAcf {
  photo_hero: AcfImage;
  sections: AcfList<PortfolioSection>;
  libelles_projet?: Partial<ProjectLabels>;
}

export type SocialNetwork = "facebook" | "instagram" | "linkedin";

export interface ContactAcf {
  titre_ligne_1: string;
  titre_ligne_2: string;
  intro: string;
  email: string;
  telephone: string;
  adresse: string;
  mention_intervention: string;
  reseaux: AcfList<{ reseau: SocialNetwork; url: string }>;
  libelles?: Partial<ContactLabels>;
}
