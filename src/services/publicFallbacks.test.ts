import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchMarketDominance } from "./marketService";
import { fetchCryptoNews } from "./newsService";

describe("public provider fallbacks", () => {
  afterEach(() => vi.restoreAllMocks());

  it("serves identified editorial news without calling an authenticated provider", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const result = await fetchCryptoNews();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.source).toBe("fallback");
    expect(result.error).toMatch(/provedor/i);
  });

  it("serves dominance fallback without triggering rate-limited global data", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const result = await fetchMarketDominance();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({ btc_dominance: expect.any(Number) }));
  });
});
