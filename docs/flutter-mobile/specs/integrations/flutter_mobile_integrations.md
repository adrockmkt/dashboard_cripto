# Integracoes - Flutter Mobile

## Objetivo

Listar e normalizar as integracoes necessarias para o app mobile, separando o
que pode ser direto no cliente, o que deve ficar em backend e como tratar
fallback.

## Integracoes herdadas do web

### Mercado

- CoinGecko
- CryptoCompare como fallback

Uso atual no web:

- top criptos
- market cap
- historico basico
- comparativos

### Sentimento

- Alternative.me

Uso atual no web:

- Fear & Greed Index

### On-Chain

- Blockchain.com Charts
- mempool.space

Uso atual no web:

- active addresses
- hashrate
- mempool
- fees

### Noticias

- CryptoCompare news
- fallback editorial local

### Persistencia

- Supabase opcional

Uso atual no web:

- favoritos
- portfolio
- alertas
- notificacoes
- fila/historico de entrega de alertas

## Recomendacao por dominio

### MarketApi

Responsabilidades:

- top assets
- asset detail
- historical prices
- rankings
- comparison

Observacao:

- pode iniciar com leitura direta
- deve migrar para BFF se o volume/rate limit crescer

### NewsApi

Responsabilidades:

- feed geral
- feed por ativo
- categorizacao

Observacao:

- no mobile, fallback editorial deve ser claramente marcado

### OnChainApi

Responsabilidades:

- snapshot por ativo
- historico resumido
- fees recomendadas

Observacao:

- preferir consolidacao server-side no medio prazo

### AlertsApi

Responsabilidades:

- CRUD de alertas
- historico de disparos
- preferencias de canal
- status de entrega

Observacao:

- deve nascer pensando em backend, nao so cache local

### PortfolioApi

Responsabilidades:

- holdings
- sync de portfolio
- calculo remoto opcional

### ReportApi

Responsabilidades:

- resumo executivo
- cards de inteligencia
- rankings e insights

## Contrato de resposta recomendado

Todo endpoint do BFF deve seguir a logica:

```txt
data
source
updated_at
error
```

Onde `source` pode ser:

- `real`
- `fallback`
- `simulated`

No app mobile, `simulated` so deve existir em telas explicitamente experimentais.

## Politica de fallback

- nunca esconder fallback de forma silenciosa
- registrar motivo da degradacao
- manter UI funcional com estado claro

## Politica de refresh

### Home

- auto refresh leve ao abrir
- pull to refresh manual

### Asset detail

- refresh ao entrar
- refresh manual

### Portfolio

- refresh manual + invalida ao editar posicao

### Alerts

- sync ao abrir

## Integracoes que nao devem ficar no cliente como estrategia final

- avaliacao continua de alertas
- segredos de provedores premium
- agregacao multiprovedor com retry
- canais externos como email/webhook administrativo
