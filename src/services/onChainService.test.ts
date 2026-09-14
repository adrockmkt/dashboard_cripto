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
});
