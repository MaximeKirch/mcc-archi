import type { WordPressImage } from "#/types/wordpress.ts";

interface ResponsiveImageProps {
  image: WordPressImage;
  sizes: string;
  className?: string;
  loading?: "eager" | "lazy";
}

const SIZE_NAMES = ["medium_large", "large", "1536x1536", "2048x2048"];

export function ResponsiveImage({
  image,
  sizes,
  className,
  loading = "lazy",
}: ResponsiveImageProps) {
  const candidates = SIZE_NAMES.flatMap((name) => {
    const url = image.sizes[name];
    const width = image.sizes[`${name}-width`];
    return typeof url === "string" && typeof width === "number"
      ? [`${url} ${width}w`]
      : [];
  });
  candidates.push(`${image.url} ${image.width}w`);

  return (
    <img
      src={image.url}
      srcSet={[...new Set(candidates)].join(", ")}
      sizes={sizes}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={loading}
      className={className}
    />
  );
}
