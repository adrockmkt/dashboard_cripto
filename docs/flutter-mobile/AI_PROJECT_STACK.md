# AI_PROJECT_STACK.md - Cripto Dashboard Mobile

Este documento adapta o padrao de stack AI-assisted da Ad Rock para a criacao
do app Flutter do Cripto Dashboard.

## Objetivos desta stack

- acelerar o nascimento do repo mobile com contexto persistente
- reduzir ambiguidades entre produto, design e implementacao
- facilitar handoff entre IA e humano
- manter continuidade entre o dashboard web atual e o app mobile

## Stack principal recomendada

### 1. Flutter + Dart

Base do app mobile:

- Flutter 3.24+
- Dart 3.5+
- Android e iOS a partir do mesmo codigo

### 2. Navegacao

- `go_router`

Uso esperado:

- tabs principais
- rotas aninhadas para detalhes de ativo
- deeplinks futuros para alertas e notificacoes

### 3. Estado

- `flutter_riverpod`

Uso esperado:

- estado global leve
- providers por feature
- leitura de async state com `AsyncValue`
- teste isolado de regras de negocio

### 4. Rede e integracoes

- `dio`
- interceptors
- modelos gerados com `json_serializable`

Uso esperado:

- cliente por dominio
- retries controlados
- headers padronizados
- observabilidade de falhas

### 5. Modelos e tipagem

- `freezed`
- `json_serializable`
- `build_runner`

Uso esperado:

- DTOs
- entidades de dominio
- sealed states para fluxos complexos

### 6. Persistencia local

Recomendacao primaria:

- `isar` ou `hive_ce` para cache estruturado
- `flutter_secure_storage` para tokens e segredos de sessao
- `shared_preferences` apenas para flags simples

### 7. Backend e auth

Opcoes recomendadas:

- `supabase_flutter` se a estrategia atual com Supabase for mantida
- BFF/edge functions para agregacao de dados e alertas server-side

### 8. Notificacoes

- `firebase_messaging`
- `flutter_local_notifications`

Uso esperado:

- push remoto
- notificacao local contextual
- abertura profunda de tela via deeplink

### 9. Observabilidade

Recomendacao:

- `sentry_flutter` para erros e traces
- analytics com Firebase Analytics ou equivalente

### 10. UI e graficos

- Material 3 como base
- design tokens proprios
- biblioteca de grafico a definir em spike

Direcao recomendada:

- `fl_chart` para series simples
- biblioteca financeira/candlestick avaliada em spike tecnico
- evitar depender de WebView como grafico principal

## Estrutura recomendada

```txt
docs/flutter-mobile/
  README.md
  AGENTS.md
  CONTRIBUTING.md
  AI_PROJECT_STACK.md
  design.md
  design/
  specs/
```

## Regras de uso desta stack

- mobile-first
- performance-first
- seguranca-first para integracoes
- backend de suporte sempre que o cliente ficar vulneravel a rate limit,
  segredo exposto ou logica critica

## Anti-patterns proibidos

- chamar dezenas de APIs terceiras diretamente da UI
- manter logica de alerta apenas no dispositivo como estrategia final
- empilhar providers globais sem modularizacao
- usar cache sem politica de expiracao
- misturar DTO e entidade de dominio indiscriminadamente
