import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ToolsHubPage } from "./ToolsHubPage";

describe("ToolsHubPage", () => {
  it("lists the priority guides with internal links", () => {
    render(
      <MemoryRouter>
        <ToolsHubPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { level: 1, name: /ferramentas cripto/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /métricas on-chain/i })).toHaveAttribute(
      "href",
      "/ferramentas/metricas-on-chain",
    );
    expect(screen.getByRole("link", { name: /simulador dca/i })).toHaveAttribute(
      "href",
      "/ferramentas/simulador-dca",
    );
  });
});
