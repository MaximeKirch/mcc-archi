// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { linkEvent } from "./analytics.ts";

function link(href: string): HTMLAnchorElement {
  const a = document.createElement("a");
  a.href = href;
  return a;
}

describe("linkEvent", () => {
  it("classifies contact links", () => {
    expect(linkEvent(link("mailto:contact@cuccasa.com"))).toEqual(["clic-email"]);
    expect(linkEvent(link("tel:+33652055586"))).toEqual(["clic-telephone"]);
  });

  it("names the opened PDF", () => {
    expect(linkEvent(link("https://api.cuccasa.com/wp-content/uploads/M%C3%A9moire.pdf"))).toEqual([
      "ouverture-pdf",
      { fichier: "Mémoire.pdf" },
    ]);
  });

  it("tracks outbound links by host and ignores internal ones", () => {
    expect(linkEvent(link("https://www.instagram.com/mcc_architecture/"))).toEqual([
      "clic-externe",
      { site: "instagram.com" },
    ]);
    expect(linkEvent(link("/projets/casa-b"))).toBeNull();
  });
});
