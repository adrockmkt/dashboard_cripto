# Dashboard Cripto Avancado

Dashboard web para analise de criptomoedas com foco em mercado, indicadores tecnicos, portfolio, alertas e modulos analiticos.

Este README descreve o estado atual real do projeto. Para planejamento de evolucao e roadmap, consulte `ROADMAP.md`.

## Status atual do projeto

O projeto ja possui uma interface rica e funcional, com varias areas navegaveis e integracao real para parte dos dados de mercado.

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

### Dados de mercado
- Lista das top criptomoedas
- Preco e variacao em 24h
- Fear & Greed Index atual
- Dominancia do Bitcoin
- Grafico historico basico de BTC

### Recursos de usuario
- Favoritos com persistencia em Supabase ou `localStorage`
- Alertas basicos com persistencia em Supabase ou `localStorage`
- Portfolio com calculo de P&L
- Exportacao de dados em CSV, PDF e JSON

## O que existe, mas ainda esta parcial

### Trading Pro
O modulo de candlestick profissional existe, mas hoje ainda usa geracao local de candles para demonstracao. A interface e a estrutura estao prontas, porem falta integrar dados OHLCV reais.

### On-Chain
O modulo on-chain ja possui layout, graficos e visualizacoes, mas os dados ainda sao simulados localmente. Falta integrar provedores reais para metricas como enderecos ativos, hashrate, fluxo de exchanges e mempool.

### DCA e Stock-to-Flow
Os modulos existem e estao navegaveis, mas ainda usam simulacoes locais para parte relevante dos calculos. A proxima etapa e conectar historicos reais para transformar esses modulos em ferramentas mais confiaveis.

### Alertas avancados
Existe uma tela para configuracao de alertas avancados, mas as acoes externas ainda nao estao implementadas de ponta a ponta. Hoje o comportamento e majoritariamente demonstrativo.

### Noticias
O feed de noticias existe, mas ainda usa dados mockados.

## O que ainda nao esta implementado

- Comparativo real entre tokens
- Integracao social com X/Twitter ou outras fontes de buzz
- Secao educacional e glossario
- Motor real de alertas estrategicos com avaliacao continua baseada em dados externos

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

### Servicos e persistencia
- `src/services/cryptoApi.ts`
- `src/lib/supabase.ts`
- `src/hooks/useFavorites.ts`
- `src/hooks/useCustomAlerts.ts`
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

As proximas 3 sprints planejadas sao:

1. Integrar dados reais nas telas ja existentes
2. Transformar simulacoes analiticas e alertas em recursos confiaveis
3. Adicionar comparativos, sentimento social e diferenciais de produto

O detalhamento completo esta em `ROADMAP.md`.

## Contato

Rafael Marques Lins  
Ad Rock Digital Mkt

- Website: https://adrock.com.br
- Email: contato@adrock.com.br
- WhatsApp: +55 41 99125-5859
- GitHub: https://github.com/adrockmkt/dashboard_cripto
