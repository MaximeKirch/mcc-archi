import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { PROFILS, contactSchema } from "#/lib/contact.ts";
import type { ContactStatus } from "#/lib/contact.ts";

const mailEnv = z.object({
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  CONTACT_TO: z.string().min(1),
  CONTACT_FROM: z.string().min(1),
});

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
// In memory: resets on restart, enough for a single Node instance.
const sentAt = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (sentAt.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    sentAt.set(ip, recent);
    return true;
  }
  sentAt.set(ip, [...recent, now]);
  return false;
}

export const sendContactMessage = createServerFn({ method: "POST" })
  .validator(contactSchema)
  .handler(async ({ data }): Promise<{ status: ContactStatus }> => {
    if (data.site_web) return { status: "sent" };

    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    if (isRateLimited(ip)) return { status: "rate_limited" };

    const env = mailEnv.safeParse(process.env);
    if (!env.success) {
      console.error("[contact] SMTP non configuré", z.treeifyError(env.error));
      return { status: "error" };
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } = env.data;
    const nodemailer = await import("nodemailer");
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });

    try {
      await transport.sendMail({
        from: CONTACT_FROM,
        to: CONTACT_TO,
        replyTo: { name: data.nom, address: data.email },
        subject: `Nouveau message du site : ${data.nom} (${PROFILS[data.profil]})`,
        text: [
          `Nom et prénom : ${data.nom}`,
          `Email : ${data.email}`,
          `Vous êtes : ${PROFILS[data.profil]}`,
          "",
          data.message,
        ].join("\n"),
      });
      return { status: "sent" };
    } catch (error) {
      console.error("[contact] Échec de l'envoi", error);
      return { status: "error" };
    }
  });
