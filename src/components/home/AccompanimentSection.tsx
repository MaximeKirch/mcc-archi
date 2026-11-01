import type { AccompanimentItem } from "#/types/wordpress.ts";
import { TextLink } from "#/components/page/TextLink.tsx";

export function AccompanimentSection({ items }: { items: AccompanimentItem[] }) {
  if (!items.length) return null;

  return (
    <section className="mt-14 md:mt-24">
      <div className="border-t border-line-kaki pt-6">
        <h2 className="font-mono text-lg leading-[26px] tracking-[1.8px] md:text-2xl md:leading-8 md:tracking-[2.4px] font-medium uppercase text-kaki">
          Deux niveaux d'accompagnement
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 md:mt-10">
        {items.map((item) => (
          <div key={item.numero + item.libelle}>
            <div className="flex items-baseline gap-2.5 md:gap-3 font-mono uppercase">
              <span className="text-[13px] md:text-sm text-neutral-500">
                {item.numero} /
              </span>
              <span className="text-xs tracking-[0.9px] text-kaki">
                {item.libelle}
              </span>
            </div>
            {item.texte && (
              <p className="mt-3 md:mt-4 max-w-[520px] text-base leading-[25px] md:text-lg md:leading-7 font-light text-neutral-700">
                {item.texte}
              </p>
            )}
            {item.texte_lien && item.cible_lien && (
              <TextLink href={item.cible_lien} className="md:mt-4">
                {item.texte_lien}
              </TextLink>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
