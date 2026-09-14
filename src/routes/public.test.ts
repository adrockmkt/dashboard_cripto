import { describe, expect, it } from "vitest";
import { getPublicRoute } from "./public";

describe("publicRoutes", () => {
  it("keeps the dashboard home indexable after the application hydrates", () => {
    const home = getPublicRoute("/");

    expect(home?.meta.robots).toBe("index,follow");
    expect(home?.meta.canonical).toBe("https://mobiledelivery.com.br/cripto-dashboard");
  });

  it("includes the tools hub and every priority guide as indexable routes", () => {
    [
      "/ferramentas",
      "/ferramentas/metricas-on-chain",
      "/ferramentas/alertas-cripto",
      "/ferramentas/simulador-dca",
      "/ferramentas/grafico-bitcoin",
    ].forEach((path) => expect(getPublicRoute(path)?.meta.robots).toBe("index,follow"));
  });
});
