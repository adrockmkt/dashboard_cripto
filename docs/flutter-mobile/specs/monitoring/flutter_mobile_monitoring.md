# Monitoring Spec - Flutter Mobile

## Objetivo

Definir a camada minima de observabilidade e monitoramento para o app Flutter e
para os servicos criticos que o suportam.

## O que monitorar

### App mobile

- crashes
- falhas de tela critica
- falhas de integracao
- tempo de abertura
- sucesso de push open

### Backend de suporte

- healthcheck
- uptime
- latencia
- erros por integracao
- fila de notificacao
- job de avaliacao de alertas

## Ferramentas recomendadas

### Cliente

- Sentry
- Firebase Crashlytics
- Firebase Analytics ou equivalente

### Servidor

- logs estruturados
- uptime externo
- alertas de erro e indisponibilidade

## Eventos minimos de produto

- app_open
- market_view
- asset_detail_view
- alert_created
- alert_triggered
- push_opened
- portfolio_updated
- report_viewed

## Healthchecks

Backend de suporte deve expor:

- `/health`
- `/ready`

## Alertas operacionais

Precisam existir para:

- job de alerta parado
- fila de notificacao acumulando
- taxa de erro de integracao alta
- falha de push

## Regras de ruido

- nao alertar por erro isolado de API publica
- usar janelas de agregacao
- separar warning de critical

## Logs

- estruturados
- sem dados sensiveis
- com contexto de usuario anonimizavel quando necessario

## SLA inicial sugerido

- Home funcional: alta prioridade
- Alerts pipeline: alta prioridade
- Report e educacional: media prioridade

## Observacao

O monitoramento do app mobile precisa ser pensado junto com o backend de alertas.
Sem isso, a experiencia de push e entrega fica opaca e dificil de operar.
