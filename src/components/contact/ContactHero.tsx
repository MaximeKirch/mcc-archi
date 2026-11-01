import type { ContactAcf } from "#/types/wordpress.ts";

const DEFAULT_TITLE = ["Échangeons sur", "votre projet."];

export function ContactHero({ contact }: { contact: ContactAcf | null }) {
  const light = contact?.titre_ligne_1 || DEFAULT_TITLE[0];
  const bold = contact?.titre_ligne_2 || DEFAULT_TITLE[1];

  return (
    <>
      <h1 className="text-[40px] leading-[44px] tracking-[-2px] md:text-7xl md:leading-[76px] md:tracking-[-3.6px] uppercase text-neutral-900 [font-kerning:none]">
        <span className="js-contact-title block overflow-hidden">
          <span className="block font-extralight">{light}</span>
        </span>
        <span className="js-contact-title block overflow-hidden">
          <span className="block font-semibold">{bold}</span>
        </span>
      </h1>
      {contact?.intro && (
        <p className="js-contact-details mt-6 md:mt-8 max-w-[520px] text-[17px] leading-[26px] md:text-lg md:leading-7 font-light text-neutral-500">
          {contact.intro}
        </p>
      )}
    </>
  );
}
