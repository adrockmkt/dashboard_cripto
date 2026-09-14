# Prontidão para AdSense e qualidade pública Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar um Cripto Dashboard público, responsivo, confiável e com conteúdo editorial suficiente para a Ad Rock solicitar avaliação do Google AdSense com segurança.

**Architecture:** O dashboard continua como uma SPA aberta; as explicações indexáveis vivem em rotas públicas estáticas e reutilizam `PublicLayout`. A camada de dados distingue resultado real, parcial e indisponível antes de chegar à UI. Uma matriz de QA combina testes Vitest, Playwright em desktop/mobile e validação de integrações externas sem efeitos reais.

**Tech Stack:** React 18, TypeScript, Vite, React Router, Tailwind, shadcn/ui, Vitest, Testing Library, Playwright CLI, Nginx no Droplet DigitalOcean e GA4.

**Spec:** `docs/adsense-production-readiness-spec.md`

## Global Constraints

- Manter produto aberto, sem login e sem coleta de dados pessoais para uso básico.
- Nunca exibir valores gerados localmente como dado de mercado real.
- Não instalar código ou slots reais do AdSense antes de aprovação explícita e do Publisher ID da Ad Rock.
- Não enviar e-mail, webhook, WhatsApp ou notificação real na auditoria; testar apenas estado local, permissão simulada ou destino validado.
- Preservar identidade visual Ad Rock e a logo existente.
- Cobrir cada mudança de comportamento com teste em vermelho antes da implementação e commitar cada tarefa aprovada.

## Arquivos e responsabilidades

- `src/services/onChainService.ts`: contrato de dados, fontes e erro parcial da integração on-chain.
- `src/components/advanced/OnChainMetrics.tsx`: estado visual honesto da ferramenta On-Chain.
- `ops/nginx/cripto-dashboard-market-gateway.conf`: rotas de proxy permitidas para fornecedores de mercado.
- `src/components/advanced/AdvancedAlertsSystem.tsx`: configuração e layout mobile de alertas.
- `src/hooks/useAdvancedAlerts.ts` e `src/services/alertDeliveryService.ts`: limites seguros para canais de entrega.
- `src/pages/Index.tsx`, `src/components/MobileBottomNav.tsx`, `src/index.css`: shell e comportamento responsivo do dashboard.
- `src/content/editorial.ts`, `src/pages/public/*`, `src/routes/public.tsx`, `src/App.tsx`: conteúdo, páginas-guia e descoberta orgânica.
- `src/components/public/ToolGuideLayout.tsx` e `src/pages/public/ToolsHubPage.tsx`: novos blocos reutilizáveis de guias e hub de ferramentas.
- `src/lib/analytics.ts`, `docs/ga4-tracking-plan.md`: mensuração consentida dos guias e CTAs.
- `docs/audits/functional-audit-2026-09-12.md`, `docs/adsense-readiness.md`: evidência final e decisão de inscrição.

---

### Task 1: Transformar o aviso On-Chain em uma correção de dados, não em texto cosmético

**Files:**
- Modify: `src/services/onChainService.ts`
- Modify: `src/components/advanced/OnChainMetrics.tsx`
- Modify: `ops/nginx/cripto-dashboard-market-gateway.conf`
- Create: `src/services/onChainService.test.ts`
- Create: `src/components/advanced/OnChainMetrics.test.tsx`

**Interfaces:**
- Produces: `OnChainSnapshot` com `availability: "complete" | "partial" | "unavailable"` e lista de métricas ausentes sem URL ou mensagem de fornecedor.
- Consumes: endpoints permitidos no gateway Nginx e respostas normalizadas de Blockchain.com/mempool.space.

- [ ] **Step 1: Escrever os testes que falham**

```ts
it("does not create fallback market values when every upstream series fails", async () => {
  mockGatewayFailures();
  const result = await fetchOnChainSnapshot();
  expect(result.data?.availability).toBe("unavailable");
  expect(result.data?.history).toEqual([]);
});

it("does not expose provider errors or the legacy integration notice", () => {
  render(<OnChainMetrics />);
  expect(screen.queryByText(/Exchange flow/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/\(400\)/)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Executar e confirmar a falha**

Run: `npm test -- src/services/onChainService.test.ts src/components/advanced/OnChainMetrics.test.tsx`  
Expected: FAIL porque ainda existe `buildFallbackHistory` para renderização e o aviso técnico incondicional.

- [ ] **Step 3: Corrigir contrato, proxy e UI**

```ts
type OnChainAvailability = "complete" | "partial" | "unavailable";

type OnChainSnapshot = {
  availability: OnChainAvailability;
  unavailableMetrics: string[];
  overview: OnChainOverview | null;
  history: OnChainHistoryPoint[];
};
```

Remover a série inventada da resposta pública. Corrigir no Nginx cada rota que
retorna 400, testando-a diretamente no servidor; se o provedor não suportar a
consulta, removê-la do gateway e marcar a métrica como indisponível. Na UI,
renderizar uma mensagem curta, “Algumas métricas on-chain estão temporariamente
indisponíveis”, apenas com nomes de métricas e botão “Tentar novamente”. Remover
o alerta de Sprint 1 e qualquer detalhe de exceção. Gráficos só aparecem se
existir série real para sua aba.

- [ ] **Step 4: Executar testes e verificação HTTP**

Run: `npm test -- src/services/onChainService.test.ts src/components/advanced/OnChainMetrics.test.tsx && npm run build`  
Expected: PASS; nenhum texto “Exchange flow”, URL de fornecedor ou `(400)` no bundle renderizado.

Verificar no Droplet as quatro URLs do gateway, aplicar a configuração Nginx,
rodar `nginx -t`, recarregar Nginx e validar a aba On-Chain no navegador.

- [ ] **Step 5: Commit**

```bash
git add src/services/onChainService.ts src/services/onChainService.test.ts src/components/advanced/OnChainMetrics.tsx src/components/advanced/OnChainMetrics.test.tsx ops/nginx/cripto-dashboard-market-gateway.conf
git commit -m "fix: present honest on-chain data availability"
```

### Task 2: Tornar Alertas utilizável e seguro em mobile

**Files:**
- Modify: `src/components/advanced/AdvancedAlertsSystem.tsx`
- Modify: `src/hooks/useAdvancedAlerts.ts`
- Modify: `src/services/alertDeliveryService.ts`
- Create: `src/components/advanced/AdvancedAlertsSystem.test.tsx`
- Create: `src/hooks/useAdvancedAlerts.test.tsx`

**Interfaces:**
- Produces: cabeçalho de alertas empilhado em telas menores que 640 px e ações de entrega explicitamente indisponíveis quando não há backend confiável.
- Consumes: `Notification.permission` via wrapper já existente em `browserNotifications.ts`.

- [ ] **Step 1: Escrever os testes que falham**

```tsx
it("keeps refresh and create-alert controls visible in a narrow viewport", () => {
  setViewport(320);
  render(<AdvancedAlertsSystem />);
  expect(screen.getByRole("button", { name: /Atualizar/i })).toBeVisible();
  expect(screen.getByRole("button", { name: /Novo alerta/i })).toBeVisible();
});

it("does not enqueue email or webhook delivery from the browser", async () => {
  const { result } = renderHook(() => useAdvancedAlerts());
  await act(() => result.current.createAlert(alertWithWebhook));
  expect(mockFetch).not.toHaveBeenCalledWith(expect.stringContaining("webhook"), expect.anything());
});
```

- [ ] **Step 2: Executar e confirmar a falha**

Run: `npm test -- src/components/advanced/AdvancedAlertsSystem.test.tsx src/hooks/useAdvancedAlerts.test.tsx`  
Expected: FAIL porque o cabeçalho usa `justify-between` sem quebra e canais não implementados ainda parecem acionáveis.

- [ ] **Step 3: Implementar a correção mínima**

Usar `flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between`
no título/ações, e `w-full sm:w-auto` em ambos os botões. Garantir que cards de
switch usem uma coluna em até 639 px. Exibir Email e Webhook como “Em breve” e
desabilitados; manter apenas som, aviso visual e notificação do navegador.
Validar URL de webhook no backend futuro, não no cliente atual.

- [ ] **Step 4: Executar testes e inspeção visual**

Run: `npm test -- src/components/advanced/AdvancedAlertsSystem.test.tsx src/hooks/useAdvancedAlerts.test.tsx && npm run build`  
Expected: PASS.

No Playwright, capturar 320 × 568, 390 × 844 e 768 × 1024. Confirmar que o CTA
laranja inteiro cabe, o rodapé mobile não cobre o último controle e o formulário
de criação abre/fecha com teclado.

- [ ] **Step 5: Commit**

```bash
git add src/components/advanced/AdvancedAlertsSystem.tsx src/components/advanced/AdvancedAlertsSystem.test.tsx src/hooks/useAdvancedAlerts.ts src/hooks/useAdvancedAlerts.test.tsx src/services/alertDeliveryService.ts
git commit -m "fix: make alerts safe and responsive on mobile"
```

### Task 3: Fechar a auditoria de todos os botões e controles

**Files:**
- Modify: `docs/audits/functional-audit-2026-09-12.md`
- Create: `tests/e2e/public-dashboard.spec.ts`
- Create: `tests/e2e/mobile-dashboard.spec.ts`
- Modify: `package.json`
- Modify: componentes que falharem durante a matriz, somente após teste reproduzir a falha.

**Interfaces:**
- Produces: uma linha aprovada, reprovada ou bloqueada para cada ID `NAV-*`, `DATA-*`, `UTIL-*`, `TRANS-*`, `EXT-*` e `A11Y-*`.
- Consumes: matriz existente, ambiente de produção e navegador com sessão limpa.

- [ ] **Step 1: Criar testes de navegação que falham quando o destino não muda**

```ts
for (const [label, expectedHeading] of [
  ["Trading Pro", /Trading/i], ["On-Chain", /On-Chain/i], ["Alertas", /Alertas/i],
]) {
  test(`opens ${label}`, async ({ page }) => {
    await page.getByRole("button", { name: label }).click();
    await expect(page.getByRole("heading", { name: expectedHeading })).toBeVisible();
  });
}
```

- [ ] **Step 2: Rodar a suíte inicialmente**

Run: `npx playwright test tests/e2e/public-dashboard.spec.ts tests/e2e/mobile-dashboard.spec.ts`  
Expected: primeira execução cria a lista de falhas reais; não marcar nenhum item como aprovado sem captura e resultado observável.

- [ ] **Step 3: Corrigir em ciclos pequenos**

Executar a matriz por grupo: navegação, dados, ferramentas, utilidades,
transições e links externos. Para downloads, checar nome/tipo do arquivo sem
abrir arquivo externo. Para e-mail, WhatsApp, webhook e permissões, validar
destino/diálogo e cancelar antes de qualquer envio. Acrescentar teste unitário
para toda regressão corrigida.

- [ ] **Step 4: Fazer as verificações de acessibilidade e responsividade**

Testar Tab, Shift+Tab, Enter, Espaço e Escape em menu, busca, dialogs, tabs,
tour, consentimento e alertas. Em cada viewport, confirmar `document.body.scrollWidth
<= window.innerWidth`, áreas de toque de 44 px e nenhum conteúdo sob a navegação
inferior. Registrar screenshot e URL/ação na coluna Evidência.

- [ ] **Step 5: Atualizar documentação e commit**

```bash
git add docs/audits/functional-audit-2026-09-12.md tests/e2e package.json src
git commit -m "test: complete public dashboard interaction audit"
```

### Task 4: Criar o hub e as páginas explicativas das ferramentas prioritárias

**Files:**
- Create: `src/components/public/ToolGuideLayout.tsx`
- Create: `src/pages/public/ToolsHubPage.tsx`
- Create: `src/pages/public/OnChainGuidePage.tsx`
- Create: `src/pages/public/AlertsGuidePage.tsx`
- Create: `src/pages/public/DcaSimulatorGuidePage.tsx`
- Create: `src/pages/public/TradingChartGuidePage.tsx`
- Modify: `src/content/editorial.ts`
- Modify: `src/App.tsx`
- Modify: `src/routes/public.tsx`
- Create: `src/pages/public/ToolsHubPage.test.tsx`
- Create: `src/pages/public/ToolGuideLayout.test.tsx`

**Interfaces:**
- Produces: `/ferramentas`, `/ferramentas/metricas-on-chain`, `/ferramentas/alertas-cripto`, `/ferramentas/simulador-dca` e `/ferramentas/grafico-bitcoin`.
- Consumes: `ToolGuide` com `title`, `description`, `steps`, `limitations`, `relatedLinks`, `sources` e `openDashboardTab`.

- [ ] **Step 1: Escrever testes de conteúdo estrutural**

```tsx
it("renders the required editorial sections for a tool", () => {
  render(<ToolGuideLayout guide={onChainGuide} />);
  expect(screen.getByRole("heading", { name: /como usar/i })).toBeVisible();
  expect(screen.getByRole("heading", { name: /limites/i })).toBeVisible();
  expect(screen.getByRole("link", { name: /abrir ferramenta/i })).toHaveAttribute("href", "/");
});
```

- [ ] **Step 2: Executar e confirmar a falha**

Run: `npm test -- src/pages/public/ToolsHubPage.test.tsx src/pages/public/ToolGuideLayout.test.tsx`  
Expected: FAIL porque o componente e as rotas ainda não existem.

- [ ] **Step 3: Implementar páginas originais e úteis**

Para cada guia, escrever conteúdo humano revisável com: explicação da decisão
que a ferramenta apoia, passos, leitura responsável dos resultados, limitações
de atualização/fonte, aviso de risco e pelo menos duas ligações internas.
Não copiar notícias nem produzir previsão de preço. O hub lista todas as
ferramentas, inclusive as já existentes, mas prioriza as quatro páginas acima
na primeira entrega. Inserir o `AdPlaceholder` somente depois de seções
substantivas e antes das fontes; não inseri-lo nas telas de dashboard.

- [ ] **Step 4: Validar descoberta e SEO local**

Run: `npm test -- src/pages/public/ToolsHubPage.test.tsx src/pages/public/ToolGuideLayout.test.tsx src/routes/public.test.ts && npm run build`  
Expected: PASS; cada rota aparece em `publicRoutes`, sitemap e título/canonical.

- [ ] **Step 5: Commit**

```bash
git add src/components/public src/pages/public src/content/editorial.ts src/App.tsx src/routes/public.tsx src/routes/public.test.ts
git commit -m "feat: add explanatory guides for dashboard tools"
```

### Task 5: Ligar ferramenta, guia, GA4 e navegação pública sem poluir o dashboard

**Files:**
- Modify: `src/pages/Index.tsx`
- Modify: `src/components/Sidebar.tsx`
- Modify: `src/components/MobileBottomNav.tsx`
- Modify: `src/components/public/PublicLayout.tsx`
- Modify: `src/lib/analytics.ts`
- Modify: `src/lib/analytics.test.ts`
- Modify: `docs/ga4-tracking-plan.md`

**Interfaces:**
- Produces: evento permitido `tool_guide_open` com `tool_slug` e `tool_guide_cta_click` com `tool_slug`, ambos emitidos apenas após consentimento.
- Consumes: links públicos para guias e o consentimento já administrado por `CookieConsent`.

- [ ] **Step 1: Escrever testes de consentimento e links**

```ts
it("does not send tool-guide analytics before consent", () => {
  trackToolGuideOpen("metricas-on-chain");
  expect(mockGtag).not.toHaveBeenCalled();
});

it("links the on-chain dashboard context to its guide", () => {
  render(<OnChainMetrics />);
  expect(screen.getByRole("link", { name: /entender métricas on-chain/i })).toBeVisible();
});
```

- [ ] **Step 2: Executar e confirmar a falha**

Run: `npm test -- src/lib/analytics.test.ts src/components/advanced/OnChainMetrics.test.tsx`  
Expected: FAIL porque os eventos e links ainda não existem.

- [ ] **Step 3: Implementar links contextuais e telemetria mínima**

Adicionar um link “Como usar esta ferramenta” em cada módulo prioritário,
sem modal, sem anúncio e sem interromper a ação principal. O hub recebe link
no menu lateral e no menu “Mais” mobile. Os eventos entram no plano GA4 com
objetivo, parâmetros, gatilho e regra de consentimento; não registrar valores
de portfólio, buscas nem campos de alerta.

- [ ] **Step 4: Validar**

Run: `npm test -- src/lib/analytics.test.ts src/components/advanced/OnChainMetrics.test.tsx && npm run build`  
Expected: PASS.

No DebugView, com uma sessão que aceita Analytics, abrir um guia e retornar à
ferramenta; confirmar somente `tool_guide_open` e `tool_guide_cta_click` com
o slug, sem dados financeiros pessoais.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Index.tsx src/components/Sidebar.tsx src/components/MobileBottomNav.tsx src/components/public/PublicLayout.tsx src/lib/analytics.ts src/lib/analytics.test.ts docs/ga4-tracking-plan.md
git commit -m "feat: connect tool guides with consented analytics"
```

### Task 6: Passar pelos gates finais de SEO, segurança e AdSense

**Files:**
- Modify: `docs/adsense-readiness.md`
- Modify: `docs/audits/pagespeed-2026-09-12.md`
- Modify: `docs/audits/security-review-2026-09-12.md`
- Modify: `README.md`

**Interfaces:**
- Produces: decisão explícita `Apto para solicitar` ou uma lista objetiva de bloqueios restantes; nunca “aprovado pelo Google”.

- [ ] **Step 1: Escrever checklist de release reprovado por padrão**

```md
- [ ] Nenhuma página pública contém anúncio real nem placeholder em tela operacional.
- [ ] Todos os itens críticos da auditoria funcional estão aprovados.
- [ ] `robots.txt`, sitemap e 100% das rotas públicas respondem 200 em produção.
- [ ] A versão mobile não possui overflow horizontal nas larguras aprovadas.
- [ ] Search Console recebeu o sitemap e GA4 foi validado após consentimento.
```

- [ ] **Step 2: Executar verificações objetivas**

Run: `npm test && npm run lint && npm run build`  
Expected: testes e build aprovados; avisos legados listados e sem novo erro.

Rodar PageSpeed em mobile e desktop, validar sitemap/robots/canonicals por
HTTP e executar a revisão de segurança focada em XSS, links externos,
localStorage, chamadas a API, permissões e ausência de segredo no bundle.

- [ ] **Step 3: Atualizar a documentação com evidências reais**

Substituir “pendente” apenas por evidência datada: URL, viewport, screenshot,
comando ou evento GA4. Se algum fornecedor continuar indisponível, declarar o
estado parcial como decisão aceita, não como defeito oculto.

- [ ] **Step 4: Preparar a solicitação**

Após o domínio canônico estar definido e indexável, revisar propriedade no
Search Console, preencher URL correta no AdSense e inserir código apenas quando
o painel solicitar. Manter os anúncios futuros em páginas editoriais; não em
alertas, portfólio, configurações ou resultados de ferramenta.

- [ ] **Step 5: Commit e deploy**

```bash
git add docs README.md
git commit -m "docs: record AdSense production readiness evidence"
git push origin main
```

Fazer deploy, repetir os checks HTTP e registrar o hash publicado.

## Cobertura da especificação

- Conteúdo por ferramenta: Tasks 4 e 5.
- Alertas e falha On-Chain das capturas: Tasks 1 e 2.
- Responsividade e todos os botões: Task 3.
- SEO, GA4, segurança, domínio canônico e decisão de AdSense: Tasks 5 e 6.
- Anúncios só depois de aprovação: Global Constraints, Tasks 4 e 6.

## Ordem de execução

Executar Tasks 1 → 2 → 3 → 4 → 5 → 6. As duas primeiras removem informação
enganosa e problemas mobile; a terceira impede que conteúdo novo seja entregue
sobre uma interface com controles quebrados.
