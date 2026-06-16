# Frontend Product Spec - Flutter Mobile

## Objetivo

Definir o escopo funcional do app mobile a partir do produto web atual.

## Escopo de MVP

O MVP mobile deve focar em:

- Home com resumo de mercado
- Markets com lista e busca
- detalhe de ativo
- Portfolio
- alertas basicos e avancados
- noticias
- comparativo simples
- relatorio tatico resumido

## Regra de produto enxuto

O app mobile deve refletir o repositorio atual, mas com a disciplina do
`ponytail`:

- nao portar tudo da web para o mobile de uma vez
- nao transformar cada componente web em uma tela
- nao criar UI pesada quando um fluxo curto resolver
- priorizar tarefas frequentes do usuario em vez de completude visual

## Features por prioridade

### P0

- autenticacao opcional ou modo anonimo com persistencia local
- home de mercado
- lista de criptos
- detalhe de ativo
- favoritos/watchlist
- portfolio
- alertas
- push notifications

### P1

- DCA
- Stock-to-Flow
- rankings e comparativos
- relatorio diario
- on-chain resumido

### P2

- camada educacional ampliada
- social sentiment direto
- automacoes mais sofisticadas

## Navegacao recomendada

### Bottom tabs

- Home
- Markets
- Alerts
- Portfolio
- More

### More

- Report
- Models
- Settings
- About

## Mapeamento web -> mobile

### Dashboard web

Mobile:

- `HomeScreen`
- `MarketOverviewCard`
- `FavoritesSection`
- `NewsSection`

### Trading Pro web

Mobile:

- `AssetDetailScreen`
- `AssetChartSection`
- `IndicatorSection`
- `KeyLevelsSection`

### On-Chain web

Mobile:

- subsecao em `AssetDetailScreen`
- ou tela dedicada acessada por drill-down

### Modelos web

Mobile:

- `ModelsHubScreen`
- `DcaSimulatorScreen`
- `StockToFlowScreen`

### Portfolio web

Mobile:

- `PortfolioScreen`
- `HoldingDetailSheet`

### Alertas web

Mobile:

- `AlertsListScreen`
- `CreateAlertScreen`
- `AlertHistoryScreen`

### Relatorio web

Mobile:

- `ReportScreen`

## Telas principais

### HomeScreen

Conteudo:

- humor do mercado
- dominancia BTC
- top movers
- watchlist
- noticias
- snapshot do portfolio

### MarketsScreen

Conteudo:

- top 20/50 ativos
- busca
- filtros simples
- acesso ao detalhe

### AssetDetailScreen

Conteudo:

- header de preco
- grafico principal
- 24h / 7d / 30d
- indicadores principais
- noticias relacionadas
- CTA para criar alerta

### PortfolioScreen

Conteudo:

- valor total
- P&L
- distribuicao
- lista de posicoes

### AlertsScreen

Conteudo:

- alertas ativos
- historico
- configuracoes de canais
- criar novo alerta

### ReportScreen

Conteudo:

- resumo executivo
- inteligencia de mercado
- ranking
- leitura educacional curta

## Regras de UX

- a Home nao deve virar uma copia do dashboard web
- a tela de ativo e o coracao do produto mobile
- modulos analiticos profundos entram por contexto, nao todos na tela inicial
- indicadores avancados devem ser opcionais ou expansivos
- se um fluxo puder ser resolvido com componente nativo simples, preferir isso
  antes de widgets customizados complexos

## Estados obrigatorios

Todo modulo critico precisa prever:

- loading
- erro
- empty
- stale
- fallback

## Internacionalizacao

Idiomas obrigatorios:

- pt-BR
- en
- es

## Tema

- dark mode como referencia principal para leitura analitica
- light mode suportado

## Funcionalidades que nao devem nascer no MVP

- social sentiment de varias redes sem fonte robusta
- estrategias complexas de automacao local
- bibliotecas pesadas de dezenas de widgets pouco usados
- parity cega com cada detalhe visual do dashboard web
