// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Carousel, type Slide } from "./Carousel.tsx";

const slides: Slide[] = ["Un", "Deux", "Trois"].map((titre) => ({
  image: null,
  titre,
  texte: `<p>${titre}</p>`,
}));

const active = (container: HTMLElement) => container.querySelector<HTMLElement>("[data-active]")!;
const activeTitle = (container: HTMLElement) => active(container).querySelector("h4")?.textContent;
const control = (container: HTMLElement, name: "prev" | "next") =>
  active(container).querySelector<HTMLButtonElement>(`[data-control="${name}"]`)!;

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

  it("loops both ways and announces the position", () => {
    const { container } = render(<Carousel slides={slides} label="Test" />);

    fireEvent.click(control(container, "prev"));
    expect(activeTitle(container)).toBe("Trois");
    expect(active(container).textContent).toContain("03 / 03");
    expect(container.querySelector("[aria-live]")?.textContent).toBe("Diapositive 3 sur 3");

    fireEvent.click(control(container, "next"));
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

  it("keeps focus on the same button in the new slide", () => {
    const { container } = render(<Carousel slides={slides} label="Test" />);
    control(container, "next").focus();

    fireEvent.click(control(container, "next"));
    expect(document.activeElement).toBe(control(container, "next"));
  });
});
