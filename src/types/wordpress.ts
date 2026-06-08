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
