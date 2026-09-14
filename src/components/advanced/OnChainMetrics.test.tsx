import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OnChainMetrics } from "./OnChainMetrics";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => null,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

vi.mock("@/services/onChainService", () => ({
  fetchOnChainSnapshot: vi.fn().mockResolvedValue({
    data: {
      overview: {
        activeAddresses: 100,
        hashrate: 500,
        mempoolTransactions: 1000,
        averageFeeUsd: 2,
        recommendedFees: { fastestFee: 12, halfHourFee: 8, hourFee: 5 },
        networkHealth: { score: 70, factors: { security: 70, activity: 70, adoption: 70, fees: 70 } },
      },
      history: [],
      availability: "partial",
      unavailableMetrics: ["Endereços ativos"],
    },
    source: "fallback",
    updatedAt: "2026-09-14T00:00:00.000Z",
    error: "Fonte de mercado indisponível (400)",
  }),
}));

describe("OnChainMetrics", () => {
  afterEach(() => vi.clearAllMocks());

  it("does not expose the retired integration note or provider status code", async () => {
    render(<OnChainMetrics />);

    await screen.findByText("Endereços Ativos");

    expect(screen.queryByText(/Exchange flow/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\(400\)/)).not.toBeInTheDocument();
  });
});
