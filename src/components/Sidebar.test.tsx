import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  it("names the collapse control according to its current state", () => {
    render(<Sidebar activeTab="dashboard" onTabChange={vi.fn()} />);

    const collapseButton = screen.getByRole("button", { name: "Recolher navegação" });
    fireEvent.click(collapseButton);

    expect(screen.getByRole("button", { name: "Expandir navegação" })).toBeInTheDocument();
  });
});
