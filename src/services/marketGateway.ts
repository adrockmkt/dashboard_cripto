export type MarketGatewayPath = `/cripto-dashboard/api/market/${string}`;

export async function getMarketJson<T>(path: MarketGatewayPath): Promise<T> {
  if (!path.startsWith("/cripto-dashboard/api/market/")) {
    throw new Error("Rota de mercado inválida");
  }

  const response = await fetch(path, { headers: { Accept: "application/json" } });

  if (!response.ok) {
    throw new Error(`Fonte de mercado indisponível (${response.status})`);
  }

  return response.json() as Promise<T>;
}
