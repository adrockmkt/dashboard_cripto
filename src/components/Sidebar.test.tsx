import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  it("anchors the navigation with the Ad Rock logo", () => {
    render(<Sidebar activeTab="dashboard" onTabChange={vi.fn()} />);

    const brand = screen.getByRole("banner", { name: "Ad Rock" });
    expect(within(brand).getByRole("img", { name: "Ad Rock Digital MKT" })).toBeVisible();
  });

  it("marks the active destination with the Ad Rock treatment", () => {
    render(<Sidebar activeTab="dashboard" onTabChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "nav.dashboard" })).toHaveClass("adrock-active");
  });

  it("names the collapse control according to its current state", () => {
    render(<Sidebar activeTab="dashboard" onTabChange={vi.fn()} />);

    const collapseButton = screen.getByRole("button", { name: "Recolher navegação" });
    fireEvent.click(collapseButton);

    expect(screen.getByRole("button", { name: "Expandir navegação" })).toBeInTheDocument();
  });
});
