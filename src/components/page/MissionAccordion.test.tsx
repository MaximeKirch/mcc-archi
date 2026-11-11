// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MissionsRow } from "./MissionAccordion.tsx";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

afterEach(cleanup);

const items = [
  { libelle: "Conseil", definition: "Analyse du potentiel." },
  { libelle: "Diagnostic", definition: "État des lieux." },
  { libelle: "Relevé", definition: "" },
  { libelle: "Esquisse", definition: "Premières hypothèses." },
];

// Two columns, no titles: Conseil + Diagnostic, Relevé + Esquisse.
const colonnes = [
  { titre: "", missions: items.slice(0, 2) },
  { titre: "", missions: items.slice(2) },
];

const formule = (titre: string) => ({ titre, texte: "Pour qui.", puces: ["Visite", "Relevé"] });

// The missions grid only (formules also use ul).
const missionColumns = (container: HTMLElement) =>
  [...container.querySelectorAll("ul")].filter((ul) => !ul.closest("li"));

describe("MissionsRow", () => {
  it("starts closed and opens one mission at a time", () => {
    render(<MissionsRow label="Missions" colonnes={colonnes} />);
    const conseil = screen.getByRole("button", { name: "Conseil" });
    const diagnostic = screen.getByRole("button", { name: "Diagnostic" });
    expect(screen.queryAllByRole("region")).toHaveLength(0);

    fireEvent.click(conseil);
    expect(conseil.getAttribute("aria-expanded")).toBe("true");
    // Accordion panel (below lg) and left-column panel (lg), CSS shows one.
    const regions = screen.getAllByRole("region", { name: "Conseil" });
    expect(regions).toHaveLength(2);
    const panel = regions.find((r) => r.id)!;
    const aside = regions.find((r) => !r.id)!;
    const controls = conseil.getAttribute("aria-controls")!.split(" ");
    expect(controls).toContain(panel.id);
    expect(controls).toContain(aside.parentElement!.id);
    expect(aside.parentElement!.getAttribute("aria-live")).toBe("polite");
    expect(aside.textContent).toBe("ConseilAnalyse du potentiel.");

    fireEvent.click(diagnostic);
    expect(conseil.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getAllByRole("region").every((r) => r.textContent?.includes("État des lieux."))).toBe(true);

    fireEvent.click(diagnostic);
    expect(screen.queryAllByRole("region")).toHaveLength(0);
  });

  it("shows a mission without definition as plain text", () => {
    render(<MissionsRow label="Missions" colonnes={colonnes} />);
    expect(screen.queryByRole("button", { name: "Relevé" })).toBeNull();
    expect(screen.getByText("Relevé").closest("li")?.querySelector("svg")).toBeNull();
  });

  it("shows the accroche above the columns, only when given", () => {
    const { rerender } = render(<MissionsRow label="" colonnes={colonnes} />);
    expect(screen.queryByRole("heading", { level: 4 })).toBeNull();

    rerender(<MissionsRow label="" accroche="Un accompagnement sur mesure" colonnes={colonnes} />);
    const heading = screen.getByRole("heading", { level: 4 });
    expect(heading.textContent).toBe("Un accompagnement sur mesure");
    expect(heading.nextElementSibling?.querySelector("ul")).not.toBeNull();
  });

  it("renders the columns as given, in order", () => {
    const { container } = render(<MissionsRow label="" colonnes={colonnes} />);
    const libelles = (ul: Element) => [...ul.querySelectorAll(".mission-mot")].map((m) => m.textContent);
    expect(missionColumns(container).map(libelles)).toEqual([
      ["Conseil", "Diagnostic"],
      ["Relevé", "Esquisse"],
    ]);
  });

  it("shows column headers only when titled, keeping an empty slot to align missions", () => {
    const { container, rerender } = render(<MissionsRow label="" colonnes={colonnes} />);
    expect(screen.queryAllByRole("heading", { level: 4 })).toHaveLength(0);

    rerender(<MissionsRow label="" colonnes={[{ ...colonnes[0], titre: "Phases préliminaires" }, colonnes[1]]} />);
    expect(screen.getByRole("heading", { level: 4 }).textContent).toBe("Phases préliminaires");
    expect(container.querySelectorAll('[aria-hidden="true"].md\\:block')).toHaveLength(1);
  });

  it("keeps the last word with the chevron", () => {
    render(
      <MissionsRow
        label=""
        colonnes={[{ titre: "", missions: [{ libelle: "Permis de construire (PC)", definition: "d" }] }]}
      />,
    );
    const nowrap = screen.getByRole("button").querySelector(".whitespace-nowrap")!;
    expect(nowrap.textContent).toBe("(PC)");
    expect(nowrap.querySelector("svg")).not.toBeNull();
  });

  it("renders bold and italic from the minimal editor", () => {
    const { container } = render(
      <MissionsRow
        label=""
        colonnes={[{ titre: "", missions: [{ libelle: "Conseil", definition: '<p style="text-align: center;">Analyse <strong>du site</strong></p><ul><li>Plans</li><li>Coupes</li></ul>' }] }]}
        formules={[{ titre: "Essentielle", texte: "<p>Pour <em>qui</em>.</p>", puces: ["Visite <strong>sur site</strong>"] }]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Conseil" }));
    expect(screen.getAllByRole("region").every((r) => r.querySelector("strong")?.textContent === "du site")).toBe(true);
    expect(screen.getAllByText("du site").every((b) => b.parentElement!.style.textAlign === "center")).toBe(true);
    expect(screen.getAllByRole("region").every((r) => r.querySelectorAll(".texte-minimal li").length === 2)).toBe(true);
    expect(container.querySelector(".italique-inverse li strong")?.textContent).toBe("sur site");
    expect(screen.getByText("qui").tagName).toBe("EM");
  });

  it("renders one card per formule, nothing without formules", () => {
    const { container, rerender } = render(<MissionsRow label="" colonnes={colonnes} />);
    expect(container.querySelectorAll("h4")).toHaveLength(0);

    rerender(<MissionsRow label="" colonnes={colonnes} formules={[formule("Essentielle"), formule("Complète")]} />);
    expect(screen.getAllByRole("heading", { level: 4 }).map((h) => h.textContent)).toEqual(["Essentielle", "Complète"]);
    expect(screen.getAllByText("Visite")).toHaveLength(2);
  });

  it("links to contact under the formules only", () => {
    const { rerender } = render(<MissionsRow label="" colonnes={colonnes} />);
    expect(screen.queryByRole("link")).toBeNull();

    rerender(<MissionsRow label="" colonnes={colonnes} formules={[formule("Essentielle")]} />);
    const link = screen.getByRole("link");
    expect(link.textContent).toBe("Discuter de votre projet →");
    expect(link.getAttribute("href")).toBe("/contact");

    rerender(
      <MissionsRow
        label=""
        colonnes={colonnes}
        formules={[formule("Essentielle")]}
        lienFormules="Prendre rendez-vous"
      />,
    );
    expect(screen.getByRole("link").textContent).toBe("Prendre rendez-vous →");
  });
});
