# Database and Local Data Model - Flutter Mobile

## Objetivo

Definir o modelo de dados remoto e local necessario para o app Flutter.

## Tabelas remotas atuais relevantes

Base atual observada no projeto web:

- `portfolio`
- `notifications`
- `favorites`
- `custom_alerts`
- `advanced_alerts`
- `alert_delivery_queue`
- `alert_delivery_history`

## Entidades de dominio no app

### Asset

- id
- symbol
- name
- price
- change24h
- marketCap
- marketCapRank
- totalVolume
- imageUrl

### FavoriteAsset

- assetId
- symbol
- name
- lastKnownPrice
- change24h

### PortfolioHolding

- id
- symbol
- name
- quantity
- avgPrice
- currentPrice
- totalValue
- pnl
- pnlPercentage

### BasicAlert

- id
- assetId
- type
- value
- isActive
- triggered

### AdvancedAlert

- id
- name
- type
- conditions
- actions
- isActive
- triggered
- lastTriggered

### AlertDelivery

- id
- alertId
- channel
- status
- message
- metricValues
- deliveredAt

### MarketReport

- summary
- rankings
- educationalCards
- source
- updatedAt

## Cache local recomendado

No dispositivo, armazenar:

- watchlist
- ultimos snapshots de mercado
- portfolio
- alertas
- preferencias de UI
- idioma
- tema

## Regras de cache

- portfolio: persistente
- watchlist: persistente
- market list: TTL curto
- report: TTL medio
- on-chain: TTL medio
- news: TTL curto

## Segredos e sessoes

- tokens de sessao em `flutter_secure_storage`
- nada sensivel em cache aberto

## Sincronizacao

### Estrategia

- local-first para preferencias
- remote-first para mercado
- sync explicito para portfolio e alertas

### Conflitos

- ultima escrita vence para preferencias simples
- para holdings e alertas, preferir reconciliacao remota
