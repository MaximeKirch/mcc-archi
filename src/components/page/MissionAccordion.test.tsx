// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MissionAccordion } from "./MissionAccordion.tsx";

afterEach(cleanup);

const items = [
  { libelle: "Conseil", definition: "Analyse du potentiel." },
  { libelle: "Diagnostic", definition: "État des lieux." },
  { libelle: "Relevé", definition: "" },
  { libelle: "Esquisse", definition: "Premières hypothèses." },
];

describe("MissionAccordion", () => {
  it("starts closed and opens one mission at a time", () => {
    render(<MissionAccordion items={items} />);
    const conseil = screen.getByRole("button", { name: "Conseil" });
    const diagnostic = screen.getByRole("button", { name: "Diagnostic" });
    expect(screen.queryAllByRole("region")).toHaveLength(0);

    fireEvent.click(conseil);
    expect(conseil.getAttribute("aria-expanded")).toBe("true");
    const region = screen.getByRole("region", { name: "Conseil" });
    expect(region.id).toBe(conseil.getAttribute("aria-controls"));
    expect(region.textContent).toBe("Analyse du potentiel.");

    fireEvent.click(diagnostic);
    expect(conseil.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getAllByRole("region")).toHaveLength(1);

    fireEvent.click(diagnostic);
    expect(screen.queryAllByRole("region")).toHaveLength(0);
  });

  it("shows a mission without definition as plain text", () => {
    render(<MissionAccordion items={items} />);
    expect(screen.queryByRole("button", { name: "Relevé" })).toBeNull();
    expect(screen.getByText("Relevé").closest("li")?.querySelector("svg")).toBeNull();
  });

  it("fills three columns in order, 5 / 5 / 4 for 14 missions", () => {
    const many = Array.from({ length: 14 }, (_, i) => ({ libelle: `M${i}`, definition: "d" }));
    const { container } = render(<MissionAccordion items={many} />);
    const columns = [...container.querySelectorAll("ul")];
    expect(columns.map((ul) => ul.children.length)).toEqual([5, 5, 4]);
    expect(columns[1].textContent).toMatch(/^M5/);
  });

  it("keeps the last word with the chevron", () => {
    render(<MissionAccordion items={[{ libelle: "Permis de construire (PC)", definition: "d" }]} />);
    const nowrap = screen.getByRole("button").querySelector(".whitespace-nowrap")!;
    expect(nowrap.textContent).toBe("(PC)");
    expect(nowrap.querySelector("svg")).not.toBeNull();
  });
});
