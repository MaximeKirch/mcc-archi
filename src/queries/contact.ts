import { queryOptions } from "@tanstack/react-query";
import type { ContactAcf } from "#/types/wordpress.ts";
import { fetchPageBySlug } from "./pages.ts";

export const contactPageQueryOptions = queryOptions({
  queryKey: ["page", "contact"],
  queryFn: () => fetchPageBySlug<ContactAcf>("contact"),
});
