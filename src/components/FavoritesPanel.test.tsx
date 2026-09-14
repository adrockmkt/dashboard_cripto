import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FavoritesPanel } from "./FavoritesPanel";

vi.mock("@/hooks/useFavorites", () => ({
  useFavorites: () => ({
    favorites: [],
    isLoading: false,
    removeFromFavorites: vi.fn(),
    refreshFavorites: vi.fn(),
  }),
}));

describe("FavoritesPanel", () => {
  it("names the button that refreshes favorites", () => {
    render(<FavoritesPanel />);

    expect(screen.getByRole("button", { name: "Atualizar favoritos" })).toBeVisible();
  });
});
