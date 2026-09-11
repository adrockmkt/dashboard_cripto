# Crescimento público e design do dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o Cripto Dashboard em uma ferramenta Ad Rock com superfície pública indexável, uma interface operacional mais clara e preparação responsável para monetização futura.

**Architecture:** O produto terá uma camada pública pré-renderizada para conteúdo editorial e institucional, mais o aplicativo React existente em `/cripto-dashboard`. O design continuará usando os componentes locais shadcn/ui e tokens Tailwind; não haverá migração para Material UI. Dados privados, portfolio e preferências ficarão fora do sitemap e das superfícies editoriais.

**Tech Stack:** React 18, TypeScript, Vite, React Router, Tailwind CSS, shadcn/ui, Radix UI, TanStack Query, Supabase opcional.

**Spec:** `docs/superpowers/specs/2026-09-09-public-growth-and-dashboard-design.md`

## Global Constraints

- Manter `src/components/ui/` como a base de componentes e não introduzir Material UI.
- Publicar conteúdo financeiro somente com data de atualização, fonte, autoria e aviso de risco.
- Não indexar portfolio, alertas, configurações nem qualquer dado específico do usuário.
- Não adicionar anúncios até a revisão manual da Fase 6.
- Identificar as páginas institucionais como Ad Rock Digital Mkt, CNPJ 12.520.651/0001-91 e contato@adrock.com.br.
- Aplicar GA4 apenas com consentimento analítico e seguir `docs/ga4-tracking-plan.md`.
- Cada tarefa deve preservar `npm run build`; corrigir o lint antes de usá-lo como critério de pronto.

---

## Estrutura de arquivos planejada

- `src/routes/public.tsx`: árvore de rotas públicas e metadados por rota.
- `src/pages/public/`: páginas editoriais e institucionais, cada qual com uma responsabilidade temática.
- `src/components/public/`: layout público, cabeçalho, rodapé, blocos de autoria, fontes e aviso de risco.
- `src/content/`: conteúdo editorial versionado e validado por schema.
- `src/lib/seo.ts`: contrato para title, description, canonical, Open Graph e JSON-LD.
- `public/robots.txt` e `public/sitemap.xml`: descoberta somente de URLs canônicas públicas.
- `vite.config.ts`: estratégia de split e pré-renderização escolhida na Fase 2.
- `src/pages/Index.tsx`: dashboard operacional com nova hierarquia.
- `src/components/advanced/ProfessionalCandlestickChart.tsx`: gráfico e controles adaptados para desktop e mobile.

## Sequência de execução

### Fase 0: Linha de base e decisões de publicação

**Files:**
- Modify: `README.md`
- Modify: `ROADMAP.md`
- Create: `.env.example`

- [x] **Step 1: Registrar o domínio canônico e os ambientes**

Definir em `README.md` uma única URL de produção, o caminho final do aplicativo e os responsáveis por conteúdo e infraestrutura. Não usar `localhost` como valor de produção.

- [x] **Step 2: Criar o contrato de ambiente**

Criar `.env.example` com as chaves públicas já esperadas pelo produto, sem valores reais:

```env
VITE_PUBLIC_SITE_URL=https://dominio-da-ad-rock.com.br
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

- [x] **Step 3: Registrar métricas iniciais**

Anotar no `ROADMAP.md`: páginas indexadas, impressões, cliques orgânicos, CWV, tamanho gzip do chunk inicial e data da primeira medição no Search Console.

- [x] **Step 4: Verificar a linha de base**

Run: `npm run build`

Expected: build de produção concluída; registrar o tamanho de `dist/assets/index-*.js`.

- [x] **Step 5: Commit**

```bash
git add README.md ROADMAP.md .env.example
git commit -m "docs: define public growth baseline"
```

### Fase 1: Fundação institucional e editorial

**Files:**
- Create: `src/pages/public/AboutPage.tsx`
- Create: `src/pages/public/MethodologyPage.tsx`
- Create: `src/pages/public/ContactPage.tsx`
- Create: `src/pages/public/PrivacyPage.tsx`
- Create: `src/pages/public/TermsPage.tsx`
- Create: `src/pages/public/AiPolicyPage.tsx`
- Create: `src/pages/public/RiskDisclosurePage.tsx`
- Create: `src/components/public/PublicLayout.tsx`
- Create: `src/components/public/EditorialMeta.tsx`
- Modify: `src/App.tsx`

- [x] **Step 1: Escrever testes de rota pública**

Instalar uma camada mínima de testes com Vitest e Testing Library; criar um teste que renderize `/sobre` e exija um único `h1`, link para `/cripto-dashboard` e texto "Ad Rock".

```tsx
expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Sobre a plataforma");
expect(screen.getByRole("link", { name: /abrir dashboard/i })).toHaveAttribute("href", "/cripto-dashboard");
```

- [x] **Step 2: Executar o teste e confirmar falha**

Run: `npm run test -- AboutPage.test.tsx`

Expected: FAIL porque a rota e o componente ainda não existem.

- [x] **Step 3: Implementar layout público e páginas legais**

`PublicLayout` recebe `children`, `title` e `updatedAt`; renderiza cabeçalho com marca, navegação, rodapé, autoria da Ad Rock e links institucionais. Cada página legal usa texto aprovado pelo responsável jurídico antes do deploy.

As páginas devem identificar Ad Rock Digital Mkt, CNPJ 12.520.651/0001-91 e
contato@adrock.com.br. Incluir `/politica-de-ia`, com limites, transparência e
supervisão humana de qualquer funcionalidade assistida por IA.

- [x] **Step 4: Verificar navegação e semântica**

Run: `npm run test -- AboutPage.test.tsx && npm run build`

Expected: testes verdes e build concluída.

- [x] **Step 5: Commit**

```bash
git add src/pages/public src/components/public src/App.tsx package.json package-lock.json
git commit -m "feat: add public institutional foundation"
```

### Fase 1.5: Consentimento e tracking GA4

**Files:**
- Create: `src/lib/analytics.ts`
- Create: `src/components/privacy/CookieConsent.tsx`
- Create: `src/lib/analytics.test.ts`
- Modify: `.env.example`
- Modify: `src/main.tsx`
- Modify: `src/pages/Index.tsx`
- Modify: `docs/ga4-tracking-plan.md`

- [x] **Step 1: Escrever testes para consentimento e eventos**

Criar testes que provem que `trackEvent` não envia nada antes de
`updateAnalyticsConsent("granted")` e que remove quaisquer propriedades não
permitidas dos eventos.

```ts
expect(trackEvent("dashboard_tab_view", { tab_name: "trading" })).toBe(false);
updateAnalyticsConsent("granted");
expect(trackEvent("dashboard_tab_view", { tab_name: "trading" })).toBe(true);
```

- [x] **Step 2: Executar o teste e confirmar falha**

Run: `npm run test -- analytics.test.ts`

Expected: FAIL porque a biblioteca de tracking ainda não existe.

- [x] **Step 3: Implementar biblioteca GA4 com consentimento**

Implementar as interfaces abaixo; aceitar somente os eventos e parâmetros
documentados em `docs/ga4-tracking-plan.md`.

```ts
export type AnalyticsConsent = "granted" | "denied";
export function initializeAnalytics(measurementId: string): void;
export function updateAnalyticsConsent(consent: AnalyticsConsent): void;
export function trackEvent(name: AnalyticsEventName, params: AnalyticsEventParams): boolean;
```

O estado inicial precisa ser `denied`. Nenhum evento pode conter PII, valores de
portfolio, texto de busca, endereço de carteira ou chave de API.

- [x] **Step 4: Implementar banner de preferências**

`CookieConsent` oferece aceitar, recusar e reabrir preferências. Persistir apenas
a decisão localmente e linkar `/privacidade`; o dashboard permanece funcional
independentemente da escolha.

- [x] **Step 5: Conectar somente os eventos aprovados**

Instrumentar conclusão/início do onboarding, visualização de abas, alterações
de timeframe, exportações e alertas. A busca global pode registrar
`search_scope: "global"`, mas nunca o termo pesquisado.

- [x] **Step 6: Verificar no ambiente local**

Run: `npm run test -- analytics.test.ts && npm run build`

Expected: teste verde, build concluída e nenhum identificador GA4 no HTML antes
da interação de consentimento.

- [x] **Step 7: Validar na propriedade GA4 antes do deploy**

Usar DebugView e Realtime para conferir somente eventos e parâmetros previstos.
Configurar tráfego interno e dimensões customizadas descritas em
`docs/ga4-tracking-plan.md`; esta etapa exige acesso à propriedade GA4.

- [x] **Step 8: Commit**

```bash
git add src/lib/analytics.ts src/lib/analytics.test.ts src/components/privacy/CookieConsent.tsx .env.example src/main.tsx src/pages/Index.tsx docs/ga4-tracking-plan.md
git commit -m "feat: add consented GA4 tracking"
```

### Fase 2: Rotas públicas, pré-renderização e SEO técnico

**Files:**
- Create: `src/lib/seo.ts`
- Create: `src/routes/public.tsx`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Modify: `index.html`
- Modify: `vite.config.ts`
- Modify: `src/App.tsx`

- [x] **Step 1: Escrever testes do contrato SEO**

Criar teste para `buildPageMeta` exigindo canonical absoluto, title específico e description não vazia.

```ts
expect(buildPageMeta({ path: "/bitcoin-hoje", title: "Bitcoin hoje" }).canonical)
  .toBe("https://dominio-da-ad-rock.com.br/bitcoin-hoje");
```

- [x] **Step 2: Executar teste e confirmar falha**

Run: `npm run test -- seo.test.ts`

Expected: FAIL porque `buildPageMeta` ainda não existe.

- [x] **Step 3: Implementar contrato e rotas**

Definir a interface abaixo e usá-la nas rotas públicas:

```ts
export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  robots: "index,follow" | "noindex,nofollow";
}

export function buildPageMeta(input: { path: string; title: string; description: string }): PageMeta;
```

Configurar pré-renderização estática para as rotas editoriais; validar que o HTML gerado contém `h1`, title e descrição sem precisar executar dados de mercado no cliente.

- [x] **Step 4: Criar descoberta controlada**

`robots.txt` aponta ao sitemap. `sitemap.xml` inclui somente home, páginas institucionais e conteúdo editorial público; `/cripto-dashboard`, portfolio e alertas ficam fora até uma decisão explícita de indexação.

- [x] **Step 5: Verificar artefatos de produção**

Run: `npm run test -- seo.test.ts && npm run build && rg -n "bitcoin-hoje|<h1|canonical" dist public`

Expected: testes verdes, build concluída e sinais SEO presentes no HTML pré-renderizado.

- [ ] **Step 6: Commit**

```bash
git add src/lib/seo.ts src/routes/public.tsx src/App.tsx index.html vite.config.ts public/robots.txt public/sitemap.xml
git commit -m "feat: add public routes and SEO foundation"
```

### Fase 3: Conteúdo editorial original e fontes

**Files:**
- Create: `src/content/editorial.ts`
- Create: `src/pages/public/BitcoinTodayPage.tsx`
- Create: `src/pages/public/EthereumTodayPage.tsx`
- Create: `src/pages/public/FearGreedPage.tsx`
- Create: `src/pages/public/DcaGuidePage.tsx`
- Create: `src/pages/public/GlossaryIndexPage.tsx`
- Create: `src/components/public/SourceList.tsx`
- Create: `src/components/public/RiskDisclosure.tsx`

- [x] **Step 1: Escrever teste de artigo**

Exigir título, autoria, data de atualização, pelo menos uma fonte e o aviso de risco na página Bitcoin.

```tsx
expect(screen.getByText(/atualizado em/i)).toBeInTheDocument();
expect(screen.getByRole("heading", { name: /fontes/i })).toBeInTheDocument();
expect(screen.getByText(/não constitui recomendação de investimento/i)).toBeInTheDocument();
```

- [x] **Step 2: Executar teste e confirmar falha**

Run: `npm run test -- BitcoinTodayPage.test.tsx`

Expected: FAIL porque a página e o conteúdo ainda não existem.

- [x] **Step 3: Implementar modelo editorial tipado**

```ts
export interface EditorialPage {
  slug: string;
  title: string;
  description: string;
  author: string;
  updatedAt: string;
  sources: Array<{ label: string; url: string }>;
  sections: Array<{ heading: string; body: string }>;
}
```

Criar conteúdo escrito pela Ad Rock; dados de mercado devem declarar fonte e horário. Não replicar notícias de terceiros.

- [x] **Step 4: Verificar conteúdo e build**

Run: `npm run test -- BitcoinTodayPage.test.tsx && npm run build`

Expected: teste verde e páginas incluídas na produção.

- [ ] **Step 5: Commit**

```bash
git add src/content src/pages/public src/components/public
git commit -m "feat: add original crypto editorial pages"
```

### Fase 4: Redesign do dashboard e Trading Pro

**Files:**
- Modify: `src/pages/Index.tsx`
- Modify: `src/components/Sidebar.tsx`
- Modify: `src/components/MarketStats.tsx`
- Modify: `src/components/CryptoNewsFeed.tsx`
- Modify: `src/components/advanced/ProfessionalCandlestickChart.tsx`
- Modify: `src/index.css`
- Create: `src/components/dashboard/MarketBrief.tsx`
- Create: `src/components/dashboard/TradingControlsSheet.tsx`

- [x] **Step 1: Escrever teste para prioridade do gráfico no mobile**

Renderizar `ProfessionalCandlestickChart` e exigir um botão "Indicadores e alertas" que abre um `Sheet`; o contêiner do gráfico deve aparecer antes desse botão no DOM.

```tsx
expect(screen.getByTestId("trading-chart").compareDocumentPosition(
  screen.getByRole("button", { name: /indicadores e alertas/i })
)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
```

- [x] **Step 2: Executar teste e confirmar falha**

Run: `npm run test -- ProfessionalCandlestickChart.test.tsx`

Expected: FAIL porque os controles ainda aparecem antes do gráfico.

- [x] **Step 3: Implementar a hierarquia visual**

No mobile, mover switches e filtros para `TradingControlsSheet`; manter timeframe, estado da fonte e gráfico no topo. No dashboard, introduzir `MarketBrief` com uma leitura curta de contexto antes das coleções de cards e transformar notícias em lista sem rolagem interna na primeira dobra.

- [x] **Step 4: Verificar acessibilidade e responsividade**

Run: `npm run test -- ProfessionalCandlestickChart.test.tsx && npm run build`

Expected: teste verde; build concluída. Verificar manualmente viewport mobile e desktop, incluindo foco do drawer, labels e contraste.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Index.tsx src/components/Sidebar.tsx src/components/MarketStats.tsx src/components/CryptoNewsFeed.tsx src/components/advanced/ProfessionalCandlestickChart.tsx src/components/dashboard src/index.css
git commit -m "feat: prioritize market context and trading chart"
```

### Fase 5: Performance, observabilidade e qualidade

**Files:**
- Modify: `vite.config.ts`
- Modify: `src/pages/Index.tsx`
- Modify: `src/main.tsx`
- Modify: `eslint.config.js`
- Modify: `package.json`

- [x] **Step 1: Corrigir a base de lint**

Fixar versões compatíveis de ESLint e `@typescript-eslint/*`, ou ajustar a configuração da regra `@typescript-eslint/no-unused-expressions` para receber opções válidas.

- [x] **Step 2: Criar uma medição de bundle repetível**

Adicionar script `analyze:bundle` que executa o build e lista os arquivos JavaScript de `dist/assets` por tamanho gzip.

- [x] **Step 3: Separar dependências pesadas**

Configurar `manualChunks` para bibliotecas de gráficos, exportação PDF e Supabase. Manter o código da rota pública inicial fora dos módulos de charts e portfolio.

- [x] **Step 4: Verificar qualidade**

Run: `npm run lint && npm run test && npm run build && npm run analyze:bundle`

Expected: lint e testes verdes; redução registrada no chunk inicial em relação à Fase 0.

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts src/pages/Index.tsx src/main.tsx eslint.config.js package.json package-lock.json
git commit -m "perf: split public and dashboard bundles"
```

### Fase 6: Preparação e decisão AdSense

**Files:**
- Create: `docs/adsense-readiness.md`
- Modify: `src/components/public/PublicLayout.tsx`
- Modify: `src/lib/seo.ts`

- [x] **Step 1: Criar checklist de elegibilidade**

Documentar: domínio próprio e acessível, política de privacidade, termos, contato, sobre, aviso de risco, conteúdo original, autoria, fontes, sitemap validado e ausência de anúncios invasivos.

- [x] **Step 2: Definir zonas de anúncio sem ativá-las**

Criar somente slots sem script de terceiros em páginas editoriais, abaixo de conteúdo substancial e fora de CTAs, gráficos e telas privadas. Os slots recebem `aria-label="Espaço reservado para publicidade"` e ficam desativados por padrão.

- [x] **Step 3: Fazer auditoria de pronto para inscrição**

Verificar Search Console, sitemap, Mobile Friendly, Core Web Vitals e a checklist. Registrar decisão "apto" ou "não apto" com data e evidências no documento.

- [x] **Step 4: Commit**

```bash
git add docs/adsense-readiness.md src/components/public/PublicLayout.tsx src/lib/seo.ts
git commit -m "docs: add adsense readiness checklist"
```

## Auto-revisão do plano

- Cobertura da spec: Fases 1–3 entregam a camada pública, conteúdo e SEO; Fase 4 entrega a atualização de UX; Fase 5 cobre performance e qualidade; Fase 6 trata a decisão AdSense.
- Sem placeholders: os arquivos, interfaces, comandos e critérios de cada fase estão definidos; as únicas informações externas pendentes são domínio canônico e aprovação jurídica dos textos, que precisam vir do responsável antes de publicar.
- Consistência: `EditorialPage` é o contrato de conteúdo; `buildPageMeta` é o contrato de metadados; `PublicLayout` é a composição comum das rotas públicas.
