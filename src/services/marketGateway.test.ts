import { afterEach, describe, expect, it, vi } from "vitest";
import { getMarketJson } from "./marketGateway";

describe("getMarketJson", () => {
  afterEach(() => vi.restoreAllMocks());

  it("requests an allowlisted same-origin market path as JSON", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: "ok" }), { status: 200 })
    );

    await expect(getMarketJson<{ data: string }>("/cripto-dashboard/api/market/coingecko/global")).resolves.toEqual({ data: "ok" });
    expect(fetchMock).toHaveBeenCalledWith(
      "/cripto-dashboard/api/market/coingecko/global",
      expect.objectContaining({ cache: "no-store", headers: { Accept: "application/json" } })
    );
  });

  it("rejects paths outside the market gateway", async () => {
    await expect(getMarketJson("https://api.coingecko.com/api/v3/global" as never)).rejects.toThrow("Rota de mercado inválida");
  });
});
