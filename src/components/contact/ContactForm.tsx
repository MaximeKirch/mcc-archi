import { useState } from "react";
import { contactSchema } from "#/lib/contact.ts";
import type { ContactInput, ContactStatus } from "#/lib/contact.ts";
import { sendContactMessage } from "#/server/contact.ts";
import { track } from "#/lib/analytics.ts";
import type { ContactLabels } from "#/config/labels.ts";

type Field = "nom" | "email" | "profil" | "message";
type Errors = Partial<Record<Field, string>>;

const labelClass = "font-mono text-[10px] tracking-[1.2px] uppercase text-neutral-500";
const inputClass =
  "w-full m-0 py-3.5 min-h-12 border-0 border-b border-neutral-400 rounded-none bg-transparent text-base leading-6 font-light text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-kaki aria-[invalid=true]:border-red-700 transition-colors";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-red-700">
      {message}
    </p>
  );
}

export function ContactForm({
  fallbackEmail,
  labels,
}: {
  fallbackEmail: string;
  labels: ContactLabels;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<ContactStatus | "sending" | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Partial<ContactInput>;
    const parsed = contactSchema.safeParse(values);

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as Field;
        next[field] ??= issue.message;
      }
      setErrors(next);
      form.querySelector<HTMLElement>(`[name="${String(parsed.error.issues[0].path[0])}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const result = await sendContactMessage({ data: parsed.data });
      setStatus(result.status);
      if (result.status === "sent") {
        form.reset();
        track("contact-envoye", { profil: parsed.data.profil });
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p role="status" className="texte-justifie mt-8 max-w-[640px] text-lg leading-7 font-light text-neutral-800">
        {labels.confirmation}
      </p>
    );
  }

  const describedBy = (field: Field) => (errors[field] ? `${field}-error` : undefined);
  const profils = { particulier: labels.profil_particulier, agence: labels.profil_agence };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="js-contact-details flex flex-col gap-5 md:gap-6 mt-8 max-w-[640px]"
    >
      <label className="block">
        <span className={labelClass}>{labels.champ_nom}</span>
        <input
          type="text"
          name="nom"
          autoComplete="name"
          placeholder={labels.champ_nom}
          aria-invalid={!!errors.nom}
          aria-describedby={describedBy("nom")}
          className={inputClass}
        />
        <FieldError id="nom-error" message={errors.nom} />
      </label>

      <label className="block">
        <span className={labelClass}>{labels.champ_email}</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder={labels.champ_email}
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("email")}
          className={inputClass}
        />
        <FieldError id="email-error" message={errors.email} />
      </label>

      <fieldset className="m-0 p-0 border-0 min-w-0" aria-describedby={describedBy("profil")}>
        <legend className={`p-0 ${labelClass}`}>{labels.champ_profil}</legend>
        <div className="flex flex-wrap gap-x-8 gap-y-2 mt-1.5">
          {Object.entries(profils).map(([value, label]) => (
            <label
              key={value}
              className="inline-flex items-center gap-2 min-h-11 text-base font-light text-neutral-800 cursor-pointer"
            >
              <input
                type="radio"
                name="profil"
                value={value}
                aria-invalid={!!errors.profil}
                className="m-0 size-[18px] accent-kaki"
              />
              {label}
            </label>
          ))}
        </div>
        <FieldError id="profil-error" message={errors.profil} />
      </fieldset>

      <label className="block">
        <span className={labelClass}>{labels.champ_message}</span>
        <textarea
          name="message"
          rows={4}
          placeholder={`${labels.champ_message}…`}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message")}
          className={`${inputClass} min-h-[120px] resize-none`}
        />
        <FieldError id="message-error" message={errors.message} />
      </label>

      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label>
          Laissez ce champ vide
          <input type="text" name="site_web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="lg:flex lg:items-center lg:justify-between lg:gap-6">
        <button
          type="submit"
          disabled={status === "sending"}
          className="min-h-12 px-7 border-0 rounded bg-kaki text-neutral-50 font-mono text-xs tracking-[0.9px] uppercase cursor-pointer hover:bg-kaki-dark disabled:opacity-60 disabled:cursor-wait transition-colors"
        >
          {status === "sending" ? "Envoi en cours…" : `${labels.bouton} →`}
        </button>
        <p className="mt-3 lg:mt-0 lg:text-right text-xs leading-[18px] font-light text-neutral-500">
          {labels.mention_donnees}
        </p>
      </div>

      <div aria-live="polite">
        {status === "rate_limited" && (
          <p className="text-sm text-red-700">
            Trop de messages envoyés depuis votre connexion. Réessayez dans une heure.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-700">
            L'envoi a échoué. Réessayez dans quelques minutes
            {fallbackEmail && (
              <>
                {" "}
                ou écrivez directement à{" "}
                <a href={`mailto:${fallbackEmail}`} className="underline">
                  {fallbackEmail}
                </a>
              </>
            )}
            .
          </p>
        )}
      </div>
    </form>
  );
}
