import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchOHLCVData } from "./chartService";

describe("fetchOHLCVData", () => {
  afterEach(() => vi.restoreAllMocks());

  it("uses the same-origin CoinGecko history endpoint for real candles", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ prices: [[1_700_000_000_000, 50_000], [1_700_003_600_000, 50_100]] }), { status: 200 })
    );

    const result = await fetchOHLCVData("BTC", "1h", 2);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/cripto-dashboard/api/market/coingecko/coins/bitcoin/market_chart"),
      expect.anything()
    );
    expect(result.source).toBe("real");
    expect(result.data).toHaveLength(2);
  });
});
