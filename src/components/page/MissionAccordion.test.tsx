// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MissionsRow } from "./MissionAccordion.tsx";

afterEach(cleanup);

const items = [
  { libelle: "Conseil", definition: "Analyse du potentiel." },
  { libelle: "Diagnostic", definition: "État des lieux." },
  { libelle: "Relevé", definition: "" },
  { libelle: "Esquisse", definition: "Premières hypothèses." },
];

const formule = (titre: string) => ({ titre, texte: "Pour qui.", puces: ["Visite", "Relevé"] });

// The missions grid only (formules also use ul).
const missionColumns = (container: HTMLElement) =>
  [...container.querySelectorAll("ul")].filter((ul) => !ul.closest("li"));

describe("MissionsRow", () => {
  it("starts closed and opens one mission at a time", () => {
    render(<MissionsRow label="Missions" items={items} />);
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
    render(<MissionsRow label="Missions" items={items} />);
    expect(screen.queryByRole("button", { name: "Relevé" })).toBeNull();
    expect(screen.getByText("Relevé").closest("li")?.querySelector("svg")).toBeNull();
  });

  it("fills three columns in order, 5 / 5 / 4 for 14 missions", () => {
    const many = Array.from({ length: 14 }, (_, i) => ({ libelle: `M${i}`, definition: "d" }));
    const { container } = render(<MissionsRow label="" items={many} />);
    const columns = missionColumns(container);
    expect(columns.map((ul) => ul.children.length)).toEqual([5, 5, 4]);
    expect(columns[1].textContent).toMatch(/^M5/);
  });

  it("keeps at least 3 missions per column: 6 -> 3 / 3, 12 -> 4 / 4 / 4", () => {
    const counts = (n: number) => {
      const many = Array.from({ length: n }, (_, i) => ({ libelle: `M${i}`, definition: "" }));
      const { container, unmount } = render(<MissionsRow label="" items={many} />);
      const result = missionColumns(container).map((ul) => ul.children.length);
      unmount();
      return result;
    };
    expect(counts(6)).toEqual([3, 3]);
    expect(counts(12)).toEqual([4, 4, 4]);
    expect(counts(7)).toEqual([3, 3, 1]);
  });

  it("keeps the last word with the chevron", () => {
    render(<MissionsRow label="" items={[{ libelle: "Permis de construire (PC)", definition: "d" }]} />);
    const nowrap = screen.getByRole("button").querySelector(".whitespace-nowrap")!;
    expect(nowrap.textContent).toBe("(PC)");
    expect(nowrap.querySelector("svg")).not.toBeNull();
  });

  it("renders one card per formule, nothing without formules", () => {
    const { container, rerender } = render(<MissionsRow label="" items={items} />);
    expect(container.querySelectorAll("h4")).toHaveLength(0);

    rerender(<MissionsRow label="" items={items} formules={[formule("Essentielle"), formule("Complète")]} />);
    expect(screen.getAllByRole("heading", { level: 4 }).map((h) => h.textContent)).toEqual([
      "Essentielle",
      "Complète",
    ]);
    expect(screen.getAllByText("Visite")).toHaveLength(2);
  });
});
