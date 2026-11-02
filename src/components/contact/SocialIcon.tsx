import type { SocialNetwork } from "#/types/wordpress.ts";

export const SOCIAL_LABELS: Record<SocialNetwork, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
};

const PATHS: Record<SocialNetwork, React.ReactNode> = {
  facebook: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M13.5 20v-7h2.2l.4-2.6h-2.6V8.9c0-.8.4-1.4 1.5-1.4h1.2V5.2c-.4-.1-1.2-.2-2-.2-2 0-3.3 1.2-3.3 3.3v2.1H8.5V13h2.4v7" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.8" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 10.5V17M8 7.5v.01M12 17v-6.5M12 13.5c0-1.7 1-3 2.7-3S17 11.6 17 13.5V17" />
    </>
  ),
};

export function SocialIcon({ network }: { network: SocialNetwork }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[network]}
    </svg>
  );
}
