import { queryOptions } from "@tanstack/react-query";
import type { AtelierAcf } from "#/types/wordpress.ts";
import { fetchPageBySlug } from "./pages.ts";

export const atelierPageQueryOptions = queryOptions({
  queryKey: ["page", "atelier"],
  queryFn: () => fetchPageBySlug<AtelierAcf>("atelier"),
});
