// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Carousel, type Slide } from "./Carousel.tsx";

const slides: Slide[] = ["Un", "Deux", "Trois"].map((titre) => ({
  image: null,
  titre,
  texte: `<p>${titre}</p>`,
}));

const activeTitle = (container: HTMLElement) =>
  container.querySelector("[data-active] h4")?.textContent;

afterEach(cleanup);

describe("Carousel", () => {
  it("renders nothing without slides", () => {
    const { container } = render(<Carousel slides={[]} label="Test" />);
    expect(container.firstChild).toBeNull();
  });

  it("has no controls for a single slide", () => {
    render(<Carousel slides={slides.slice(0, 1)} label="Test" />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("loops both ways and updates the counter", () => {
    const { container } = render(<Carousel slides={slides} label="Test" />);
    const prev = screen.getByLabelText("Diapositive précédente");
    const next = screen.getByLabelText("Diapositive suivante");

    fireEvent.click(prev);
    expect(activeTitle(container)).toBe("Trois");
    expect(container.textContent).toContain("03 / 03");

    fireEvent.click(next);
    expect(activeTitle(container)).toBe("Un");
  });

  it("moves with arrow keys and keeps hidden slides inert", () => {
    const { container } = render(<Carousel slides={slides} label="Test" />);
    const group = screen.getByRole("group", { name: "Test" });

    fireEvent.keyDown(group, { key: "ArrowRight" });
    expect(activeTitle(container)).toBe("Deux");

    const inert = container.querySelectorAll("[aria-roledescription='diapositive'][inert]");
    expect(inert).toHaveLength(2);
  });
});
