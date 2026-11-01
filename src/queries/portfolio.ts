import { queryOptions } from "@tanstack/react-query";
import type { PortfolioAcf } from "#/types/wordpress.ts";
import { fetchPageBySlug } from "./pages.ts";

export const portfolioPageQueryOptions = queryOptions({
  queryKey: ["page", "portfolio"],
  queryFn: () => fetchPageBySlug<PortfolioAcf>("portfolio"),
});
