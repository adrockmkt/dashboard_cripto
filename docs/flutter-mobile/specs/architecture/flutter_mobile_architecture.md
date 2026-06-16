# Arquitetura - Flutter Mobile

## Objetivo

Definir a arquitetura do futuro app Flutter do Cripto Dashboard, usando o estado
real do projeto web como referencia e corrigindo os pontos que nao escalam bem
no mobile.

## Meta arquitetural

Construir um app modular, com:

- UI desacoplada de integracoes
- estado previsivel
- dados agregados por dominio
- push e alertas pensados para execucao fora da sessao
- capacidade de crescer sem virar um espelho do web

## Principio arquitetural adicional

Seguir a logica do `ponytail`: a melhor arquitetura para este app nao e a mais
abstrata, e sim a menor arquitetura que sustenta:

- seguranca
- legibilidade
- testabilidade
- evolucao futura previsivel

Consequencias praticas:

- nao criar camada "enterprise" desnecessaria no MVP
- usar recursos do Flutter e do Dart antes de plugins
- manter poucos arquivos por feature quando isso nao comprometer clareza
- evitar wrappers de wrappers para UI e rede

## Arquitetura recomendada

Padrao:

- feature-first
- clean-ish architecture pragmatica
- repository pattern
- providers por feature
- sem sobre-engenharia ritualistica

## Camadas

### Presentation

- pages/screens
- widgets
- controllers/providers de UI

### Domain

- entities
- use cases
- regras de negocio

### Data

- repositories
- remote data sources
- local data sources
- DTOs e mappers

### Core

- networking
- environment
- error handling
- analytics
- notifications
- auth/session

## Estrutura sugerida

```txt
lib/
  app/
    app.dart
    router/
    theme/
  core/
    env/
    error/
    network/
    storage/
    notifications/
    analytics/
  features/
    dashboard/
    markets/
    asset_detail/
    alerts/
    portfolio/
    models/
    report/
    settings/
  shared/
    widgets/
    models/
    formatters/
```

## Modulos do app

### dashboard

- resumo de mercado
- watchlist
- noticias
- top movers

### markets

- lista de ativos
- rankings
- busca

### asset_detail

- price overview
- grafico
- indicadores
- noticias
- on-chain contextual

### alerts

- alertas simples
- alertas avancados
- historico
- canais de entrega

### portfolio

- holdings
- P&L
- alocacao
- exportacao futura

### models

- DCA
- Stock-to-Flow

### report

- leitura editorial
- inteligencia de mercado

### settings

- idioma
- tema
- canais de notificacao
- chaves/configuracoes quando necessario

## Estrategia de dados

No web atual, parte das chamadas vai direto a APIs terceiras. No app mobile,
isso deve ser separado em dois niveis:

### Nivel 1 - leitura direta aceitavel

Pode existir no MVP para dados publicos e nao sensiveis, quando:

- nao houver segredo
- o custo/rate limit for aceitavel
- a UX tolerar fallback

### Nivel 2 - backend/BFF recomendado

Obrigatorio para:

- alertas fora da sessao
- agregacao multiprovedor
- normalizacao de dados
- protecao contra rate limit
- logs operacionais
- integracoes com segredo

## Politica de cache

Cada repository deve definir:

- TTL por recurso
- estrategia stale-while-revalidate quando fizer sentido
- degradacao offline
- fallback explicito para a UI

## Notificacoes e alertas

O app mobile nao deve replicar a logica final de alertas apenas no cliente.

Arquitetura recomendada:

1. app cria/edita alerta
2. backend persiste regra
3. worker/scheduler avalia condicoes
4. push notification enviada ao dispositivo
5. app abre a tela relevante

## Integracao com o legado atual

Fontes atuais do web:

- CoinGecko
- CryptoCompare
- Alternative.me
- Blockchain.com Charts
- mempool.space
- Supabase opcional

No mobile, o ideal e encapsular isso atras de:

- `MarketApi`
- `NewsApi`
- `OnChainApi`
- `AlertsApi`
- `PortfolioApi`
- `ReportApi`

## Principais decisoes de arquitetura

- Riverpod para estado
- Dio para rede
- cache local estruturado
- push nativo
- backend de suporte para alertas e agregacao

## Regras de simplificacao consciente

Quando uma simplificacao for aceita no codigo futuro do app:

- marcar com `ponytail:`
- dizer qual e o limite conhecido
- dizer qual seria o caminho de upgrade

Exemplos:

- `ponytail: cache local simples por TTL; migrar para reconciliacao por entidade quando portfolio multi-device exigir sync forte`
- `ponytail: comparativo limitado a 3 ativos no MVP; expandir quando UX e performance forem validadas`

## Riscos arquiteturais

- tentar espelhar 100% do web no primeiro release
- depender demais de chamadas diretas a terceiros
- transportar simulacoes do web para o app
- tratar push como extensao do estado local
