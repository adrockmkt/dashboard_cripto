# Confiabilidade dos dados de mercado Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar falhas CORS e reduzir erros de limite das fontes públicas sem exigir login ou expor chaves no browser.

**Architecture:** O Nginx expõe rotas internas e allowlisted sob `/cripto-dashboard/api/market/`, cada uma encaminhada a um único provedor com cache curto e timeout. O frontend deixa de montar URLs de terceiros e consome um cliente tipado do mesmo origin. Fallbacks permanecem explícitos e são usados apenas após falha do proxy.

**Tech Stack:** Nginx reverse proxy/cache, React 18, TypeScript, Vite, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-11-public-tools-and-performance-design.md`

## Global Constraints

- Manter todas as funcionalidades abertas, sem login, chave de API ou dados pessoais.
- Não criar proxy genérico por URL: cada rota deve ter destino fixo no Nginx.
- Aplicar limites de tempo, cache e resposta de erro clara; não mascarar dados simulados como reais.
- Preservar CSP e atualizar somente as origens ainda necessárias no browser.

### Task 1: Criar o cliente same-origin

**Files:**
- Create: `src/services/marketGateway.ts`
- Create: `src/services/marketGateway.test.ts`

**Interfaces:** `getMarketJson<T>(path: string): Promise<T>` aceita somente caminhos relativos iniciados em `/cripto-dashboard/api/market/`, lança erro para status não-2xx e usa `Accept: application/json`.

- [ ] **Step 1: Escrever teste que falha**

```ts
expect(fetch).toHaveBeenCalledWith(
  "/cripto-dashboard/api/market/coingecko/global",
  expect.objectContaining({ headers: { Accept: "application/json" } })
);
```

- [ ] **Step 2: Implementar cliente mínimo**

```ts
export async function getMarketJson<T>(path: MarketGatewayPath): Promise<T> {
  const response = await fetch(path, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Fonte de mercado indisponível (${response.status})`);
  return response.json() as Promise<T>;
}
```

- [ ] **Step 3: Rodar `npm run test -- src/services/marketGateway.test.ts` e commitar**

### Task 2: Migrar serviços de mercado, candles, notícias e on-chain

**Files:**
- Modify: `src/services/marketService.ts`
- Modify: `src/services/chartService.ts`
- Modify: `src/services/newsService.ts`
- Modify: `src/services/onChainService.ts`

**Interfaces:** Serviços usam apenas `getMarketJson`; parâmetros são codificados com `URLSearchParams`; contratos de retorno existentes e fallbacks não mudam.

- [ ] **Step 1: Escrever testes de URL para os serviços, simulando o gateway**
- [ ] **Step 2: Substituir cada `fetch("https://...")` por rota same-origin equivalente**
- [ ] **Step 3: Rodar os testes focados e `npm run build`**
- [ ] **Step 4: Commit `feat: route market data through same-origin gateway`**

### Task 3: Configurar proxy allowlisted e cache

**Files:**
- Create: `ops/nginx/cripto-dashboard-market-gateway.conf`
- Modify: `ops/nginx/cripto-dashboard-security.conf`
- Modify: Nginx da publicação, no bloco de `/cripto-dashboard/`

**Interfaces:** Rotas fixas para CoinGecko, CryptoCompare, Blockchain.com, mempool.space e Alternative.me. Cada `location` define `proxy_pass` fixo, `proxy_ssl_server_name on`, `proxy_cache_valid 200`, `proxy_cache_use_stale`, timeout de 10s e não encaminha cabeçalhos de autenticação do cliente.

- [ ] **Step 1: Criar snippet versionado com os destinos fixos e cache por TTL**
- [ ] **Step 2: Copiar a configuração atual do Nginx para backup datado, incluir snippet, executar `nginx -t` e recarregar somente se aprovado**
- [ ] **Step 3: Verificar cada rota pelo domínio publicado, incluindo `Cache-Control` e resposta JSON**
- [ ] **Step 4: Commit `feat: proxy public market data through nginx`**

### Task 4: Validar e documentar

**Files:**
- Modify: `docs/audits/security-review-2026-09-12.md`
- Modify: `docs/audits/functional-audit-2026-09-12.md`

- [ ] **Step 1: Abrir sessão limpa da URL pública e confirmar ausência de erros CORS e de violações CSP**
- [ ] **Step 2: Registrar falhas de provedor que ainda levem a fallback, com origem e mensagem visível**
- [ ] **Step 3: Rodar `npm run test && npm run lint && npm run build && npm audit --omit=dev`**
- [ ] **Step 4: Atualizar a matriz funcional e commitar evidências**
