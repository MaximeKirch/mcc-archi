import { createFileRoute, redirect } from "@tanstack/react-router";
import { siteConfig } from "#/config/site.ts";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    throw redirect({ href: `${new URL(siteConfig.apiUrl).origin}/login`, statusCode: 302 });
  },
});
