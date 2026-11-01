import { z } from "zod";

export const PROFILS = {
  particulier: "Particulier",
  agence: "Agence d'architecture",
} as const;

// Shared by the form and the server function.
export const contactSchema = z.object({
  nom: z
    .string()
    .trim()
    .min(2, "Indiquez votre nom et prénom.")
    .max(120, "Ce nom est trop long.")
    .regex(/^[^\r\n]*$/, "Indiquez votre nom et prénom."),
  email: z
    .string()
    .trim()
    .max(200, "Cette adresse est trop longue.")
    .pipe(z.email("Indiquez une adresse email valide.")),
  profil: z.enum(["particulier", "agence"], {
    error: "Indiquez si vous êtes un particulier ou une agence.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Votre message doit faire au moins 10 caractères.")
    .max(5000, "Votre message doit faire moins de 5 000 caractères."),
  // Honeypot: hidden from people, filled by bots.
  site_web: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactStatus = "sent" | "rate_limited" | "error";
