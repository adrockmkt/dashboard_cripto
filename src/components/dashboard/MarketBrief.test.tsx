import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarketBrief } from "./MarketBrief";

describe("MarketBrief", () => {
  it("presents the market overview with the current Bitcoin dominance", () => {
    render(<MarketBrief fearGreedLabel="Neutro" fearGreedValue={50} btcDominance={52.1} />);

    expect(screen.getByRole("heading", { name: "Visão de mercado" })).toBeVisible();
    expect(screen.getByText("52.1%")).toBeVisible();
  });
});
