import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ToolGuideLayout, type ToolGuide } from "./ToolGuideLayout";

const guide: ToolGuide = {
  slug: "metricas-on-chain",
  title: "Métricas on-chain: como usar",
  description: "Aprenda a interpretar atividade, hashrate, mempool e taxas sem transformar indicadores em recomendação.",
  updatedAt: "14 de setembro de 2026",
  intro: "Use os dados para formular perguntas e conferir a origem de cada métrica.",
  steps: ["Abra a ferramenta.", "Compare o período e a fonte."],
  interpretation: "Um indicador isolado não determina uma decisão de investimento.",
  limitations: "As fontes podem ter atraso ou indisponibilidade temporária.",
  dashboardHref: "/",
  relatedLinks: [{ label: "Aviso de risco", href: "/aviso-de-risco" }],
  sources: [{ label: "Blockchain.com Charts", url: "https://www.blockchain.com/explorer/charts" }],
};

describe("ToolGuideLayout", () => {
  it("renders the required educational sections and dashboard CTA", () => {
    render(
      <MemoryRouter>
        <ToolGuideLayout guide={guide} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /^como usar$/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /^como interpretar$/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /^limites e cuidados$/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /abrir ferramenta/i })).toHaveAttribute("href", "/");
  });
});
