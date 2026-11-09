import { asList } from "#/queries/pages.ts";
import type { ContactAcf } from "#/types/wordpress.ts";
import type { ContactLabels } from "#/config/labels.ts";
import { SOCIAL_LABELS, SocialIcon } from "./SocialIcon.tsx";

function InfoBlock({ label, children, extendedClassName }: { label: string; children?: React.ReactNode; extendedClassName?: string }) {
  return (
    <div className={`js-contact-details ${extendedClassName || ""}`}>
      <h2 className="font-mono text-[10px] tracking-[1.2px] uppercase text-neutral-500">
        {label}
      </h2>
      {children}
    </div>
  );
}

const valueLink =
  "inline-flex items-center min-h-11 lg:min-h-6 lg:mt-1.5 text-base leading-6 font-light text-neutral-800 hover:text-kaki transition-colors";

// "+33 (0)6 52 05 55 86" -> "+33652055586"
function telHref(phone: string): string {
  return `tel:${phone.replace("(0)", "").replace(/[^\d+]/g, "")}`;
}

export function ContactDetails({
  contact,
  labels,
}: {
  contact: ContactAcf | null;
  labels: ContactLabels;
}) {
  if (!contact) return null;
  const reseaux = asList(contact.reseaux).filter((r) => r.url);

  return (
    <div className="mt-12 pt-7 border-t border-line-kaki flex flex-col gap-6 lg:mt-0 lg:pt-2 lg:pb-2 lg:pl-12 lg:border-t-0 lg:border-l lg:gap-7 lg:self-start">
      {contact.email && (
        <InfoBlock label={labels.titre_email}>
          <a href={`mailto:${contact.email}`} className={valueLink}>
            {contact.email}
          </a>
        </InfoBlock>
      )}

      {contact.telephone && (
        <InfoBlock label={labels.titre_telephone}>
          <a href={telHref(contact.telephone)} className={valueLink}>
            {contact.telephone}
          </a>
        </InfoBlock>
      )}

      {contact.adresse && (
        <InfoBlock label={labels.titre_adresse}>
          <address className="mt-1.5 not-italic whitespace-pre-line text-base leading-6 font-light text-neutral-800">
            {contact.adresse}
          </address>
        </InfoBlock>
      )}

      {contact.mention_intervention && (
        <InfoBlock label={contact.mention_intervention} extendedClassName="mt-1.5" />
      )}

      {reseaux.length > 0 && (
        <InfoBlock label={labels.titre_reseaux}>
          <div className="flex gap-2 mt-1 lg:gap-4 lg:mt-2.5">
            {reseaux.map(({ reseau, url }) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={SOCIAL_LABELS[reseau]}
                className="inline-flex items-center justify-center size-11 lg:size-6 text-kaki hover:text-kaki-dark transition-colors"
              >
                <SocialIcon network={reseau} />
              </a>
            ))}
          </div>
        </InfoBlock>
      )}
    </div>
  );
}
