import { queryOptions } from "@tanstack/react-query";
import type { HomeAcf } from "#/types/wordpress.ts";
import { fetchPageBySlug } from "./pages.ts";

export const homePageQueryOptions = queryOptions({
  queryKey: ["page", "accueil"],
  queryFn: () => fetchPageBySlug<HomeAcf>("accueil"),
});
