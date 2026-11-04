import type { ContactAcf } from "#/types/wordpress.ts";
import { RichText } from "#/components/page/Section.tsx";

const DEFAULT_TITLE = ["Échangeons sur", "votre projet."];

export function ContactHero({ contact }: { contact: ContactAcf | null }) {
  const light = contact?.titre_ligne_1 || DEFAULT_TITLE[0];
  const bold = contact?.titre_ligne_2 || DEFAULT_TITLE[1];

  return (
    <div className="w-fit max-w-full">
      <h1 className="text-[40px] leading-[44px] tracking-[-2px] md:text-7xl md:leading-[76px] md:tracking-[-3.6px] uppercase text-kaki [font-kerning:none]">
        <span className="js-contact-title block overflow-hidden">
          <span className="block font-extralight">{light}</span>
        </span>
        <span className="js-contact-title block overflow-hidden">
          <span className="block font-semibold">{bold}</span>
        </span>
      </h1>
      {/* w-0 min-w-full: as wide as the title, never wider. */}
      {contact?.intro && (
        <RichText
          html={contact.intro}
          className="js-contact-details w-0 min-w-full mt-6 md:mt-8 text-[17px] leading-[26px] md:text-lg md:leading-7 font-light text-neutral-500 text-justify [text-align-last:justify]"
        />
      )}
    </div>
  );
}
