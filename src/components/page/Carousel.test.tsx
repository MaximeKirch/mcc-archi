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

  it("puts one title above the image, with or without one", () => {
    const image = { url: "/a.jpg", alt: "", width: 800, height: 600, sizes: {} };
    const { container } = render(
      <Carousel slides={[{ ...slides[0], image }, slides[1]]} label="Test" />,
    );
    const titles = container.querySelectorAll("h4");
    expect(titles).toHaveLength(2);
    expect(titles[0].nextElementSibling?.firstElementChild?.tagName).toBe("IMG");
  });

  it("shows the full text on demand, for every slide", () => {
    const withSuite = slides.map((s) => ({ ...s, texte_court: "<p>Court</p>", texte: "<p>Long</p>" }));
    const { container } = render(<Carousel slides={withSuite} label="Test" />);
    const toggle = () => active(container).querySelector<HTMLButtonElement>('[data-control="suite"]')!;
    const suite = () => document.getElementById(toggle().getAttribute("aria-controls")!)!;

    expect(suite().hidden).toBe(true);
    fireEvent.click(toggle());
    expect(toggle().getAttribute("aria-expanded")).toBe("true");
    expect(suite().hidden).toBe(false);

    fireEvent.click(control(container, "next"));
    expect(suite().hidden).toBe(false);
    expect(suite().textContent).toBe("Long");
  });

  it("shows the text directly without a short one", () => {
    const { container } = render(<Carousel slides={slides} label="Test" />);
    expect(container.querySelector('[data-control="suite"]')).toBeNull();
    expect(active(container).textContent).toContain("Un");
  });

  it("keeps focus on the same button in the new slide", () => {
    const { container } = render(<Carousel slides={slides} label="Test" />);
    control(container, "next").focus();

    fireEvent.click(control(container, "next"));
    expect(document.activeElement).toBe(control(container, "next"));
  });
});
