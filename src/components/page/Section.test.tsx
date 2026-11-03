// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { RichText } from "./Section.tsx";

describe("RichText", () => {
  it("renders WYSIWYG html with the field's base classes", () => {
    const { container } = render(
      <RichText
        html={'<p>Un <span class="taille-grand">grand</span> mot</p>\n<p>Suite</p>'}
        className="text-lg"
      />,
    );
    const root = container.firstElementChild!;
    expect(root.className).toBe("texte-riche text-lg");
    expect(root.querySelectorAll("p")).toHaveLength(2);
    expect(root.querySelector(".taille-grand")?.textContent).toBe("grand");
  });

  it("splits old plain text on blank lines, without parsing it as html", () => {
    const { container } = render(<RichText html={"Premier\n\nSecond 1 < 2"} />);
    const paragraphs = container.querySelectorAll("p");
    expect([...paragraphs].map((p) => p.textContent)).toEqual(["Premier", "Second 1 < 2"]);
  });
});
