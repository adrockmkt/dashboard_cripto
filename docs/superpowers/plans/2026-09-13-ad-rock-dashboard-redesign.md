# Ad Rock Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar uma experiência visual escura, acessível e reconhecivelmente Ad Rock ao Cripto Dashboard público, sem alterar seus recursos ou dados.

**Architecture:** Centralizar os novos tokens de marca em `src/index.css`, fazer o shell da aplicação consumi-los e ajustar somente os componentes mais visíveis. A estrutura React, as rotas, as consultas de dados e os componentes shadcn existentes continuam sendo a base.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/Radix UI, Lucide, Vitest, Testing Library e lightweight-charts.

**Spec:** `docs/superpowers/specs/2026-09-13-ad-rock-brand-dashboard-design.md`

## Global Constraints

- A logo de produção é `src/assets/adrock-logo.png`; não substituir por marca inventada.
- Tema padrão escuro em preto/grafite com laranja, vermelho, âmbar e prata; azul apenas para dados auxiliares.
- Não criar login, rota nova, coleta de dados pessoais, dependência visual nova, imagem pesada ou arte de IA em produção.
- Preservar rotas públicas, SEO, GA4, consentimento, gateway de mercado e áreas reservadas futuras de AdSense.
- Todo ícone-botão deve ter nome acessível, foco visível e comportamento preservado.
- Nenhum layout pode produzir rolagem horizontal em 360 px.

---

### Task 1: Criar tokens e utilitários de marca

**Files:**
- Modify: `src/index.css`
- Test: `src/components/Sidebar.test.tsx`

**Interfaces:**
- Consumes: as variáveis CSS mapeadas em `tailwind.config.ts`.
- Produces: tokens escuros e classes `adrock-panel` e `adrock-active` reutilizáveis.

- [ ] **Step 1: Escrever o teste do estado ativo**

```tsx
expect(screen.getByRole("button", { name: /painel|dashboard/i })).toHaveClass("adrock-active");
```

- [ ] **Step 2: Rodar o teste para confirmar falha**

Run: `npm test -- src/components/Sidebar.test.tsx`

Expected: FAIL porque o item ativo ainda não tem a classe de marca.

- [ ] **Step 3: Implementar tokens e utilitários mínimos**

```css
:root {
  --background: 220 25% 5%;
  --foreground: 36 25% 94%;
  --primary: 20 100% 51%;
  --primary-foreground: 20 20% 8%;
  --card: 220 22% 8%;
  --border: 220 16% 18%;
  --ring: 33 100% 55%;
}
.adrock-panel { @apply rounded-xl border border-border bg-card shadow-md; }
.adrock-active { @apply bg-primary text-primary-foreground shadow-sm; }
```

Atualizar `.dark` para a mesma família e preservar cores semânticas de alta e baixa.

- [ ] **Step 4: Verificar**

Run: `npm test -- src/components/Sidebar.test.tsx && npm run lint`

Expected: PASS e lint sem erros.

- [ ] **Step 5: Commitar**

```bash
git add src/index.css src/components/Sidebar.test.tsx
git commit -m "feat: add Ad Rock brand tokens"
```

### Task 2: Reestruturar navegação desktop e mobile

**Files:**
- Modify: `src/components/Sidebar.tsx`
- Modify: `src/components/MobileBottomNav.tsx`
- Modify: `src/components/Sidebar.test.tsx`

**Interfaces:**
- Consumes: `activeTab: string` e `onTabChange: (tab: string) => void`.
- Produces: navegação consistente nos dois tamanhos, com destino ativo e rótulos ARIA preservados.

- [ ] **Step 1: Expandir o teste do destino ativo**

```tsx
render(<Sidebar activeTab="trading" onTabChange={vi.fn()} />);
expect(screen.getByRole("button", { name: /trading/i })).toHaveClass("adrock-active");
```

- [ ] **Step 2: Rodar para confirmar falha**

Run: `npm test -- src/components/Sidebar.test.tsx`

Expected: FAIL até a navegação aplicar o tratamento Ad Rock.

- [ ] **Step 3: Implementar composição de navegação**

```tsx
<img src={adRockLogo} alt="Ad Rock Digital Mkt" className="h-auto w-36 object-contain" />
<Button className={cn("w-full justify-start rounded-lg px-3", isActive && "adrock-active")}>
  <Icon className="h-4 w-4" />
  <span>{item.label}</span>
</Button>
```

Mover a logo para o topo da sidebar, preservar recolhimento e manter no mobile os cinco atalhos com indicador laranja que não depende somente de ícone preenchido.

- [ ] **Step 4: Verificar**

Run: `npm test -- src/components/Sidebar.test.tsx && npm run lint`

Expected: PASS e nomes ARIA identificáveis.

- [ ] **Step 5: Commitar**

```bash
git add src/components/Sidebar.tsx src/components/MobileBottomNav.tsx src/components/Sidebar.test.tsx
git commit -m "feat: refresh Ad Rock navigation shell"
```

### Task 3: Aplicar a hierarquia ao shell e briefing

**Files:**
- Modify: `src/pages/Index.tsx`
- Modify: `src/components/dashboard/MarketBrief.tsx`
- Modify: `src/components/MarketStats.tsx`
- Create: `src/components/dashboard/MarketBrief.test.tsx`

**Interfaces:**
- Consumes: `MarketBriefProps` e `useCryptoAnalysis()` existentes.
- Produces: header enxuto, briefing primário e cards no sistema visual Ad Rock.

- [ ] **Step 1: Criar teste do briefing acessível**

```tsx
render(<MarketBrief fearGreedLabel="Neutro" fearGreedValue={50} btcDominance={52.1} />);
expect(screen.getByRole("heading", { name: /visão de mercado/i })).toBeVisible();
expect(screen.getByText(/52.1%/)).toBeVisible();
```

- [ ] **Step 2: Rodar para confirmar falha**

Run: `npm test -- src/components/dashboard/MarketBrief.test.tsx`

Expected: FAIL porque o título inicial é diferente.

- [ ] **Step 3: Implementar painel e header**

```tsx
<section className="adrock-panel overflow-hidden p-5 md:p-6" aria-labelledby="market-brief-title">
  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Cripto Dashboard</p>
  <h2 id="market-brief-title">Visão de mercado</h2>
</section>
```

No desktop, organizar título, busca e ações. No mobile, manter menu, busca e atualização/notificações essenciais; idioma e tema vão para o menu. Aplicar `adrock-panel` aos cards sem tocar em consultas de dados.

- [ ] **Step 4: Verificar**

Run: `npm test -- src/components/dashboard/MarketBrief.test.tsx src/components/Sidebar.test.tsx && npm run build`

Expected: PASS e build concluído.

- [ ] **Step 5: Commitar**

```bash
git add src/pages/Index.tsx src/components/dashboard/MarketBrief.tsx src/components/dashboard/MarketBrief.test.tsx src/components/MarketStats.tsx
git commit -m "feat: redesign market dashboard hierarchy"
```

### Task 4: Ajustar Trading Pro à marca e à responsividade

**Files:**
- Modify: `src/components/advanced/ProfessionalCandlestickChart.tsx`
- Modify: `src/components/advanced/ProfessionalCandlestickChart.test.tsx`

**Interfaces:**
- Consumes: `ProfessionalCandlestickChartProps` e `fetchOHLCVData()`.
- Produces: contexto de ativo, controles agrupados e gráfico com cores coerentes; período e fonte preservados.

- [ ] **Step 1: Escrever teste de contexto**

```tsx
render(<ProfessionalCandlestickChart symbol="BTC" />);
expect(await screen.findByText(/BTC \/ BRL/i)).toBeVisible();
expect(screen.getByRole("button", { name: /atualizar/i })).toBeEnabled();
```

- [ ] **Step 2: Rodar para confirmar falha**

Run: `npm test -- src/components/advanced/ProfessionalCandlestickChart.test.tsx`

Expected: FAIL até o cabeçalho incluir par e rótulo de atualização.

- [ ] **Step 3: Implementar contexto e cores de gráfico**

```ts
layout: { background: { type: ColorType.Solid, color: "#101114" }, textColor: "#d9d5ce" },
grid: { vertLines: { color: "#28231f" }, horzLines: { color: "#28231f" } },
```

Acrescentar bloco `adrock-panel` acima do gráfico e preservar indicadores, switches, alertas, fonte e `TradingControlsSheet`. Em telas pequenas, controles quebram em linhas sem overflow.

- [ ] **Step 4: Verificar**

Run: `npm test -- src/components/advanced/ProfessionalCandlestickChart.test.tsx && npm run build`

Expected: PASS e nenhum erro TypeScript/Vite.

- [ ] **Step 5: Commitar**

```bash
git add src/components/advanced/ProfessionalCandlestickChart.tsx src/components/advanced/ProfessionalCandlestickChart.test.tsx
git commit -m "feat: align trading interface with Ad Rock theme"
```

### Task 5: QA visual, auditoria e publicação

**Files:**
- Create: `design-qa.md`
- Modify: `docs/audits/design-review-2026-09-13.md`

**Interfaces:**
- Consumes: referência aprovada, capturas Playwright e aplicação local.
- Produces: relatório `design-qa.md` com resultado exato `passed` ou `blocked`.

- [ ] **Step 1: Executar a suíte completa**

Run: `npm test && npm run lint && npm run build`

Expected: testes aprovados, lint sem erros e build concluído.

- [ ] **Step 2: Capturar a aplicação**

```bash
"/Users/rafaellins/.codex/skills/playwright/scripts/playwright_cli.sh" open http://127.0.0.1:4173/cripto-dashboard/ --headed
```

Capturar painel inicial e Trading Pro em desktop 1440 px e mobile 390 px; verificar console, menu, busca, atualização, navegação, período do gráfico e ausência de overflow.

- [ ] **Step 3: Registrar comparação e corrigir P0/P1/P2**

```md
source visual truth path: /Users/rafaellins/.codex/generated_images/01a087d6-4114-7d80-948e-4461d6000ae4/exec-8fb65599-b32b-472e-ac2c-c8fbf394c99e.png
viewport: 1440x1024
final result: passed
```

Registrar tipografia, spacing, cores, ativos e copy. Repetir captura para cada correção P0/P1/P2 antes de marcar `passed`.

- [ ] **Step 4: Revisar o diff final**

Run: `git diff --check && git status --short`

Expected: sem erro de whitespace e somente arquivos desta entrega.

- [ ] **Step 5: Commitar, enviar e publicar**

```bash
git add design-qa.md docs/audits/design-review-2026-09-13.md
git commit -m "docs: validate Ad Rock dashboard redesign"
git push origin main
```

Publicar o build validado na pasta já autorizada e conferir a URL de produção em desktop e mobile.
