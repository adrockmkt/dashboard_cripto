import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProfessionalCandlestickChart } from "./ProfessionalCandlestickChart";

vi.mock("lightweight-charts", () => ({
  ColorType: { Solid: "solid" },
  CandlestickSeries: {},
  HistogramSeries: {},
  createChart: () => ({
    addSeries: () => ({ setData: vi.fn(), createPriceLine: vi.fn() }),
    priceScale: () => ({ applyOptions: vi.fn() }),
    timeScale: () => ({ fitContent: vi.fn() }),
    applyOptions: vi.fn(),
    remove: vi.fn(),
  }),
}));

vi.mock("@/services/chartService", () => ({
  fetchOHLCVData: vi.fn(() => new Promise(() => undefined)),
}));

describe("ProfessionalCandlestickChart", () => {
  it("places the chart before the mobile controls trigger", () => {
    render(<ProfessionalCandlestickChart />);

    const chart = screen.getByTestId("trading-chart");
    const trigger = screen.getByRole("button", { name: /indicadores e alertas/i });

    expect(chart.compareDocumentPosition(trigger)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: /indicadores e alertas/i })).toBeInTheDocument();
  });
});
