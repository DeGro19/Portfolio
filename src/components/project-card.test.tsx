import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "./project-card";

const base = {
  title: "Test Project",
  subtitle: "Subtitle",
  summary: "A summary.",
  points: ["First point"],
  tech: ["TypeScript"],
};

describe("ProjectCard", () => {
  it("renders the title, points and tech tags", () => {
    render(<ProjectCard project={base} />);

    expect(
      screen.getByRole("heading", { name: "Test Project" }),
    ).toBeInTheDocument();
    expect(screen.getByText("First point")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("omits the footer entirely when there are no links", () => {
    const { container } = render(<ProjectCard project={base} />);
    expect(container.querySelector("footer")).toBeNull();
  });

  it("shows a certificate link without implying there is code to read", () => {
    render(<ProjectCard project={{ ...base, certificate: "/cert.pdf" }} />);

    expect(
      screen.getByRole("link", { name: /view certificate/i }),
    ).toHaveAttribute("href", "/cert.pdf");
    expect(screen.queryByRole("link", { name: /view code/i })).toBeNull();
  });

  it("opens external repository links safely in a new tab", () => {
    render(
      <ProjectCard project={{ ...base, repo: "https://github.com/a/b" }} />,
    );

    const link = screen.getByRole("link", { name: /view code/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
  });
});
