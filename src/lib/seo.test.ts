import { describe, expect, it } from "vitest";
import { jsonLdScript, organizationJsonLd, toDescription } from "./seo.ts";
import type { ContactAcf } from "#/types/wordpress.ts";

describe("toDescription", () => {
  it("strips tags and collapses whitespace", () => {
    expect(toDescription("<p>Une  maison</p>\n<p>en Corse.</p>")).toBe("Une maison en Corse.");
  });

  it("cuts long text on a word boundary", () => {
    const result = toDescription("mot ".repeat(100));
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result).toMatch(/mot…$/);
  });
});

describe("organizationJsonLd", () => {
  it("splits the ACF address and dedupes networks", () => {
    const contact = {
      adresse: "445 Strada di Zora\r\n20126 EVISA\r\nCorse, France",
      reseaux: [
        { reseau: "instagram", url: "https://instagram.com/a" },
        { reseau: "instagram", url: "https://instagram.com/a" },
      ],
    } as ContactAcf;
    const data = organizationJsonLd(contact);
    expect(data.address).toMatchObject({
      streetAddress: "445 Strada di Zora",
      postalCode: "20126",
      addressLocality: "EVISA",
    });
    expect(data.sameAs).toEqual(["https://instagram.com/a"]);
  });
});

describe("jsonLdScript", () => {
  it("escapes < so the JSON cannot close the script", () => {
    expect(jsonLdScript({ a: "</script>" }).children).not.toContain("</script>");
  });
});
