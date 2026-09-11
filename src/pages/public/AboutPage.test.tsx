import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AboutPage } from "./AboutPage";

describe("AboutPage", () => {
  it("identifies Ad Rock and links to the dashboard", () => {
    render(
      <MemoryRouter basename="/cripto-dashboard" initialEntries={["/cripto-dashboard/sobre"]}>
        <AboutPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Sobre a plataforma");
    expect(screen.getByText("Ad Rock Digital Mkt")).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("link", { name: /abrir dashboard/i })
        .some((link) => link.getAttribute("href") === "/cripto-dashboard"),
    ).toBe(true);
  });
});
