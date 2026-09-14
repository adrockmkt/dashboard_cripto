import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchOnChainSnapshot } from "./onChainService";
import { getMarketJson } from "./marketGateway";

vi.mock("./marketGateway", () => ({ getMarketJson: vi.fn() }));

describe("fetchOnChainSnapshot", () => {
  afterEach(() => vi.resetAllMocks());

  it("does not invent a historical series when every provider is unavailable", async () => {
    vi.mocked(getMarketJson).mockRejectedValue(new Error("Fonte indisponível"));

    const result = await fetchOnChainSnapshot();

    expect(result.data?.history).toEqual([]);
    expect(result.data?.overview).toBeNull();
    expect(result.source).toBe("fallback");
  });

  it("uses the available Blockchain total-fees series for the USD fees chart", async () => {
    vi.mocked(getMarketJson).mockImplementation(async (path) => {
      if (path.includes("mempool/api/v1/fees/recommended")) {
        return { fastestFee: 12, halfHourFee: 8, hourFee: 5 } as never;
      }

      if (path.includes("transaction-fees-usd?")) {
        return { values: [{ x: 1_726_099_200, y: 42 }] } as never;
      }

      return { values: [{ x: 1_726_099_200, y: 10 }] } as never;
    });

    const result = await fetchOnChainSnapshot();

    expect(getMarketJson).toHaveBeenCalledWith(expect.stringContaining("transaction-fees-usd?"));
    expect(result.data?.history[0]?.fees).toBe(42);
  });

  it("uses the latest available value of each metric when providers end on different dates", async () => {
    vi.mocked(getMarketJson).mockImplementation(async (path) => {
      if (path.includes("mempool/api/v1/fees/recommended")) {
        return { fastestFee: 12, halfHourFee: 8, hourFee: 5 } as never;
      }
      if (path.includes("n-unique-addresses")) return { values: [{ x: 1_726_099_200, y: 100 }] } as never;
      if (path.includes("hash-rate")) return { values: [{ x: 1_726_185_600, y: 200 }] } as never;
      if (path.includes("mempool-count")) return { values: [{ x: 1_726_272_000, y: 300 }] } as never;
      return { values: [{ x: 1_726_358_400, y: 400 }] } as never;
    });

    const result = await fetchOnChainSnapshot();

    expect(result.data?.overview).toMatchObject({
      activeAddresses: 100,
      // Blockchain.com reports this series in TH/s; the application exposes EH/s.
      hashrate: 0.0002,
      mempoolTransactions: 300,
      averageFeeUsd: 400,
    });
  });
});
