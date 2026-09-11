import { describe, expect, it } from "vitest";
import { buildPageMeta } from "./seo";

describe("buildPageMeta", () => {
  it("creates an absolute canonical URL and complete indexable metadata", () => {
    const meta = buildPageMeta({
      path: "/sobre",
      title: "Sobre a plataforma",
      description: "Conheça a proposta editorial do Cripto Dashboard.",
    });

    expect(meta.canonical).toBe("https://mobiledelivery.com.br/cripto-dashboard/sobre");
    expect(meta.title).toContain("Sobre a plataforma");
    expect(meta.description).not.toHaveLength(0);
    expect(meta.robots).toBe("index,follow");
  });
});
