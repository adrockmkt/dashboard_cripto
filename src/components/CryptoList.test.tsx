import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("jspdf", () => {
  throw new Error("PDF generation must not be required to show the market list");
});

vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({ isLoading: true }),
}));

vi.mock("@/hooks/useFavorites", () => ({
  useFavorites: () => ({
    addToFavorites: vi.fn(),
    removeFromFavorites: vi.fn(),
    isFavorite: vi.fn(),
  }),
}));

describe("CryptoList", () => {
  it("shows the market loading state without requiring the PDF generator", async () => {
    const { default: CryptoList } = await import("./CryptoList");

    render(<CryptoList />);

    expect(screen.getByText("Top Cryptocurrencies")).toBeVisible();
  });
});
