import { normalizeImage, normalizeUrl } from "#/lib/wp.ts";
import type {
  MemoireAcf,
  SavoirFaireAcf,
  WordPressImage,
  WordPressPost,
} from "#/types/wordpress.ts";
import { ResponsiveImage } from "#/components/page/ResponsiveImage.tsx";
import { TextLink } from "#/components/page/TextLink.tsx";

interface CardProps {
  image: WordPressImage | null;
  imageClass: string;
  sizes: string;
  meta: [string, string];
  title: string;
  text: string;
  children?: React.ReactNode;
}

function Card({ image, imageClass, sizes, meta, title, text, children }: CardProps) {
  return (
    <article>
      {image && (
        <ResponsiveImage
          image={image}
          sizes={sizes}
          className={`w-full object-cover rounded-lg ${imageClass}`}
        />
      )}
      <div className="flex justify-between gap-4 mt-3 md:mt-3.5 font-mono text-[11px] tracking-[0.9px] uppercase text-neutral-500">
        <span>{meta[0]}</span>
        <span>{meta[1]}</span>
      </div>
      <h3 className="mt-2 text-xl leading-7 tracking-[-0.5px] font-light uppercase text-neutral-800">
        {title}
      </h3>
      {text && (
        <p className="mt-2 text-sm leading-[21px] font-light text-neutral-500">{text}</p>
      )}
      {children}
    </article>
  );
}

export function RechercheCard({ post }: { post: WordPressPost<MemoireAcf> }) {
  const pdf = post.acf.pdf ? normalizeUrl(post.acf.pdf.url) : false;
  return (
    <Card
      image={normalizeImage(post.acf.couverture)}
      imageClass="aspect-[3/2]"
      sizes="(min-width: 768px) 624px, 100vw"
      meta={[post.acf.etiquette, post.acf.annee]}
      title={post.title.rendered}
      text={post.acf.resume}
    >
      {pdf && (
        <TextLink href={pdf} newTab className="md:mt-3">
          Consulter le mémoire
        </TextLink>
      )}
    </Card>
  );
}

export function SavoirFaireCard({ post }: { post: WordPressPost<SavoirFaireAcf> }) {
  return (
    <Card
      image={normalizeImage(post.acf.photo)}
      imageClass="aspect-[4/3]"
      sizes="(min-width: 1024px) 405px, (min-width: 768px) 50vw, 100vw"
      meta={[post.acf.etiquette, post.acf.dates]}
      title={post.title.rendered}
      text={post.acf.description}
    >
      {post.acf.lieu && (
        <p className="mt-2 font-mono text-[11px] tracking-[0.9px] uppercase text-neutral-500">
          {post.acf.lieu}
        </p>
      )}
    </Card>
  );
}
