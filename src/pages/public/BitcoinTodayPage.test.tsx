import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { BitcoinTodayPage } from "./BitcoinTodayPage";

describe("BitcoinTodayPage", () => {
  it("identifies the author, update date, sources, and investment-risk notice", () => {
    render(
      <MemoryRouter>
        <BitcoinTodayPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { level: 1, name: /bitcoin hoje/i })).toBeInTheDocument();
    expect(screen.getByText(/atualizado em/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /fontes/i })).toBeInTheDocument();
    expect(screen.getByText(/não constitui recomendação de investimento/i)).toBeInTheDocument();
  });
});
