import type { ContactAcf } from "#/types/wordpress.ts";
import { RichText } from "#/components/page/Section.tsx";

const DEFAULT_TITLE = ["Échangeons sur", "votre projet."];

export function ContactHero({ contact }: { contact: ContactAcf | null }) {
  const light = contact?.titre_ligne_1 || DEFAULT_TITLE[0];
  const bold = contact?.titre_ligne_2 || DEFAULT_TITLE[1];

  return (
    // Same width as the form.
    <div className="max-w-[640px]">
      <h1 className="text-[40px] leading-[1.1] md:text-7xl lg:max-[1100px]:text-[64px] md:leading-[1.055] tracking-[-0.05em] uppercase text-kaki [font-kerning:none]">
        <span className="js-contact-title block overflow-hidden">
          {/* Spread letter by letter to the form width. Justify only widens: the line must fit (64px on narrow lg). */}
          <span className="block font-extralight text-justify [text-align-last:justify] [text-justify:inter-character]">
            {light}
          </span>
        </span>
        <span className="js-contact-title block overflow-hidden">
          <span className="block font-semibold">{bold}</span>
        </span>
      </h1>
      {contact?.intro && (
        <RichText
          html={contact.intro}
          className="js-contact-details mt-6 md:mt-8 text-[17px] leading-[26px] md:text-lg md:leading-7 font-light text-neutral-500 text-justify"
        />
      )}
    </div>
  );
}
