# Dashboard Cripto Avancado

Dashboard web para analise de criptomoedas com foco em mercado, indicadores tecnicos, portfolio, alertas e modulos analiticos.

Este README descreve o estado atual real do projeto. Para planejamento de evolucao e roadmap, consulte `ROADMAP.md`.

## Documentacao Flutter mobile

Foi adicionada uma trilha de documentacao especifica para evoluir este produto
para Android e iOS com Flutter em:

- `docs/flutter-mobile/README.md`
- `docs/flutter-mobile/AGENTS.md`
- `docs/flutter-mobile/CONTRIBUTING.md`
- `docs/flutter-mobile/AI_PROJECT_STACK.md`
- `docs/flutter-mobile/design.md`
- `docs/flutter-mobile/design/DESIGN.md`
- `docs/flutter-mobile/specs/`

## Status atual do projeto

O projeto ja possui uma interface rica e funcional, com varias areas navegaveis e integracao real para os modulos centrais de mercado, analise e relatorio.

Hoje o produto se divide em 3 blocos:

- Funcionalidades prontas e usaveis
- Funcionalidades implementadas em modo parcial
- Funcionalidades desenhadas na interface, mas ainda dependentes de integracao real

## O que ja esta pronto

### Dashboard e navegacao
- Dashboard principal com abas
- Sidebar e navegacao mobile
- Busca global com atalho `Ctrl+K` / `Cmd+K`
- Tema claro/escuro
- Loading states, lazy loading e error boundary

### Dados de mercado e analise
- Lista das top criptomoedas
- Preco e variacao em 24h
- Fear & Greed Index atual
- Dominancia do Bitcoin
- Grafico historico basico de BTC
- Candlestick profissional com dados reais como caminho principal
- Metricas on-chain com integracao real e fallback por metrica
- Comparativo entre ativos com performance relativa em 7 dias
- Rankings de mercado por variacao, liquidez relativa e market cap

### Recursos de usuario
- Favoritos com persistencia em Supabase ou `localStorage`
- Alertas basicos com persistencia em Supabase ou `localStorage`
- Portfolio com calculo de P&L e preco atual vindo do mercado
- Exportacao de dados em CSV, PDF e JSON
- Alertas avancados com motor de regras reais e webhook
- Centro de notificacoes com persistencia consistente

### Modelos e inteligencia
- DCA com historico real
- Stock-to-Flow com historico real separado da projecao
- Relatorio diario com resumo dinamico, camada editorial e leitura tatica
- Camada educacional inicial integrada ao produto
- Feed de noticias com fonte real e fallback editorial

## O que existe, mas ainda esta parcial

### Alertas avancados
O motor e as regras ja funcionam com dados reais na sessao atual do usuario. A Sprint 4 passa a incluir notificacoes nativas do navegador e a base de persistencia para evoluir essa execucao para backend dedicado, mas ainda nao existe uma automacao server-side completa fora da sessao do navegador.

### Graficos e analise complementar
Os modulos principais de candles, portfolio, dashboard e relatorio ja usam dados reais ou fallback controlado. Ainda restam componentes secundarios com partes simuladas, especialmente em visualizacoes auxiliares como `AdvancedCharts` e `AdvancedTechnicalIndicators`.

### Camada social
O relatorio ja usa uma proxy editorial baseada em noticias para validar sentimento de contexto, mas ainda nao ha integracao direta com X/Twitter, Reddit ou outras fontes sociais proprietarias.

### Educacional
Ja existe uma primeira camada educacional contextual, mas ainda nao ha glossario completo, trilhas ou biblioteca editorial dedicada.

## O que ainda nao esta implementado

- Integracao social direta com X/Twitter ou outras fontes de buzz
- Secao educacional completa com glossario e trilhas
- Backend dedicado para avaliacao continua de alertas fora da sessao do navegador
- Entrega de email transacional de ponta a ponta
- Eliminacao total de simulacoes em componentes auxiliares de analise

## Estrutura principal do app

### Pagina principal
- `src/pages/Index.tsx`

### Componentes centrais
- `src/components/CryptoList.tsx`
- `src/components/CryptoChart.tsx`
- `src/components/FavoritesPanel.tsx`
- `src/components/CryptoNewsFeed.tsx`
- `src/components/PortfolioManager.tsx`
- `src/components/CustomAlertsPanel.tsx`

### Modulos avancados
- `src/components/advanced/ProfessionalCandlestickChart.tsx`
- `src/components/advanced/OnChainMetrics.tsx`
- `src/components/advanced/DCASimulator.tsx`
- `src/components/advanced/StockToFlowModel.tsx`
- `src/components/advanced/AdvancedAlertsSystem.tsx`
- `src/components/MarketInsights.tsx`

### Servicos e persistencia
- `src/services/cryptoApi.ts`
- `src/services/insightsService.ts`
- `src/lib/supabase.ts`
- `src/hooks/useFavorites.ts`
- `src/hooks/useCustomAlerts.ts`
- `src/hooks/useAdvancedAlerts.ts`
- `src/sql/schema.sql`

## Tecnologias

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

### Visualizacao
- Recharts
- Lightweight Charts
- TradingView widgets

### Dados e estado
- TanStack Query
- React Hook Form
- Zod
- Supabase

### Utilitarios
- Sonner
- Lucide React
- jsPDF

## Como rodar localmente

### Pre-requisitos
- Node.js 18+
- npm ou yarn

### Instalacao

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:8080`.

### Build de producao

```bash
npm run build
```

### Preview do build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Configuracao

### APIs atualmente usadas
- CoinGecko
- CryptoCompare como fallback para lista de mercado
- Alternative.me para Fear & Greed
- Blockchain.com Charts e mempool.space para on-chain
- Supabase para persistencia opcional

### Variaveis de ambiente

Para habilitar Supabase, configure:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Sem Supabase, o projeto funciona com `localStorage` para favoritos, alertas e parte dos dados do usuario.

### Observacao sobre API keys

Existe uma interface para cadastro de chaves de API, mas nem todas as chaves configuradas nela ja estao conectadas a uma camada real de servico. Isso faz parte do roadmap.

## Deploy

O projeto gera uma build estatica na pasta `dist/`.

Fluxo basico:

```bash
npm run build
```

Depois, publique o conteudo de `dist/` em um servidor que suporte SPA.

Exemplo com PM2:

```bash
pm2 start npx --name cripto-frontend -- serve -s /home/adrock/cripto-dashboard -l 5173
pm2 save
pm2 startup
```

## Roadmap resumido

As 3 sprints principais ja foram executadas no produto atual:

1. Integracao de dados reais nas telas existentes
2. Transformacao dos modulos analiticos e alertas em recursos confiaveis
3. Adicao de comparativos, rankings, relatorio refinado e camada educacional inicial

### Sprint 4 em andamento

Foco atual:

1. robustez de producao para alertas
2. notificacoes nativas do navegador
3. preparacao de persistencia para backend futuro
4. otimizacao de bundle e carregamento inicial
5. fechamento das ultimas areas parciais de frontend e portfolio

O detalhamento completo esta em `ROADMAP.md`.

## Contato

Rafael Marques Lins  
Ad Rock Digital Mkt

- Website: https://adrock.com.br
- Email: contato@adrock.com.br
- WhatsApp: +55 41 99125-5859
- GitHub: https://github.com/adrockmkt/dashboard_cripto
