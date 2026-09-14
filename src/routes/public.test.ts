import { describe, expect, it } from "vitest";
import { getPublicRoute } from "./public";

describe("publicRoutes", () => {
  it("keeps the dashboard home indexable after the application hydrates", () => {
    const home = getPublicRoute("/");

    expect(home?.meta.robots).toBe("index,follow");
    expect(home?.meta.canonical).toBe("https://mobiledelivery.com.br/cripto-dashboard");
  });
});
