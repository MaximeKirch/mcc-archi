export default interface WordPressProject {
  id: number;
  slug: string;
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
  accompagnement: AcfList<AccompanimentItem>;
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

export interface AtelierAcf {
  photo_hero: AcfImage;
  philosophie: {
    accroche: string;
    texte_principal: string;
    texte_secondaire: string;
    citation: string;
    origine_nom: string;
    piliers_intro: string;
    piliers: AcfList<{ titre: string; texte: string }>;
    corse: string;
    diplomes: AcfList<{ lieu: string; intitule: string }>;
    formations_pratiques: string;
    ouverture_missions: string;
  } | null;
  particuliers: {
    approche_collaborative: string;
    missions: AcfList<{ libelle: string }>;
  } | null;
  agences: {
    presentation: string;
    missions: AcfList<{ libelle: string }>;
    texte_portfolio: string;
    email_portfolio: string;
  } | null;
}
