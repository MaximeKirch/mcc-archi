import { siteConfig } from "#/config/site.ts";
import type { WordPressImage } from "#/types/wordpress.ts";

const wpOrigin = new URL(siteConfig.apiUrl).origin;

// Media URLs keep the host they were uploaded on; point them at the API host.
export function normalizeUrl(url: string | false): string | false {
  if (!url) return false;
  return url.replace(/^https?:\/\/[^/]+/, wpOrigin);
}

export function normalizeImage(
  image: WordPressImage | false | null | undefined,
): WordPressImage | null {
  if (!image) return null;
  const sizes = Object.fromEntries(
    Object.entries(image.sizes).map(([key, value]) => [
      key,
      typeof value === "string" ? (normalizeUrl(value) as string) : value,
    ]),
  );
  return { ...image, url: normalizeUrl(image.url) as string, sizes };
}
