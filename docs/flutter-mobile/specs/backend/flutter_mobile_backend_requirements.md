# Backend Requirements - Flutter Mobile

## Objetivo

Definir o backend minimo recomendado para suportar o app Flutter de forma mais
robusta do que o modelo atual do web.

## Por que o backend de suporte e necessario

O web atual consegue funcionar com varias chamadas diretas, mas o app mobile
precisa de uma camada mais controlada para:

- reduzir rate limit
- esconder segredos
- consolidar dados
- registrar falhas
- disparar alertas fora da sessao
- suportar push notification real

## Responsabilidades minimas do backend

### 1. Agregacao de dados

- consolidar mercado
- consolidar noticias
- consolidar on-chain
- padronizar contratos

### 2. Alertas

- persistir alertas
- avaliar regras em scheduler/worker
- registrar disparos
- enviar push
- manter historico de entrega

### 3. Portfolio

- sincronizar holdings por usuario
- opcionalmente calcular agregados

### 4. Report

- gerar payload pronto para o app
- reduzir logica de montagem no cliente

## Endpoints recomendados

### Market

- `GET /v1/market/overview`
- `GET /v1/market/assets`
- `GET /v1/market/assets/{id}`
- `GET /v1/market/assets/{id}/history`
- `GET /v1/market/comparison`
- `GET /v1/market/rankings`

### News

- `GET /v1/news`
- `GET /v1/news/{assetId}`

### On-chain

- `GET /v1/onchain/{assetId}/overview`
- `GET /v1/onchain/{assetId}/history`

### Portfolio

- `GET /v1/portfolio`
- `POST /v1/portfolio/holdings`
- `PATCH /v1/portfolio/holdings/{id}`
- `DELETE /v1/portfolio/holdings/{id}`

### Alerts

- `GET /v1/alerts`
- `POST /v1/alerts`
- `PATCH /v1/alerts/{id}`
- `DELETE /v1/alerts/{id}`
- `GET /v1/alerts/history`

### Report

- `GET /v1/report/daily`

## Jobs/Workers recomendados

- `market_snapshot_job`
- `onchain_snapshot_job`
- `alerts_evaluator_job`
- `notification_dispatcher_job`

## Canais de notificacao

Prioridade:

1. push mobile
2. webhook
3. email

## Autenticacao recomendada

Opcoes:

- Supabase Auth
- backend proprio com JWT

Regra:

- o app nao deve confiar apenas em estado local para entidades do usuario

## Observacoes de rollout

- MVP pode usar mistura de cliente direto + BFF
- alertas e push devem nascer com backend planejado, mesmo que a primeira
  entrega ainda seja simples
