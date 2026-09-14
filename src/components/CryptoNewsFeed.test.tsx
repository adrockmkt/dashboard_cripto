import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CryptoNewsFeed } from "./CryptoNewsFeed";

vi.mock("@/services/newsService", () => ({
  fetchCryptoNews: vi.fn(() => new Promise(() => {})),
}));

describe("CryptoNewsFeed", () => {
  it("names the button that refreshes the news feed", () => {
    render(<CryptoNewsFeed />);

    expect(screen.getByRole("button", { name: "Atualizar notícias" })).toBeVisible();
  });
});
