# Security Spec - Flutter Mobile

## Objetivo

Aplicar o padrao Ad Rock de seguranca ao app Flutter, com foco em:

- autenticacao
- protecao de credenciais
- canais de notificacao
- uso de APIs externas
- seguranca operacional do cliente

## Principios

- nenhum segredo real no cliente
- autenticacao separada de autorizacao
- push e alertas com trilha auditavel
- logs sem dados sensiveis
- regras criticas fora do cliente quando necessario

## Riscos principais do app

- exposicao de keys de API
- abuso de endpoints publicos
- manipulacao local de estado de alerta
- push notification sem controle de origem
- logs com payload sensivel

## Regras obrigatorias

### Secrets

- nunca embutir tokens de provedores pagos
- usar backend/BFF para integracoes sensiveis
- armazenar apenas tokens de sessao em `flutter_secure_storage`

### Auth

- expirar sessao quando aplicavel
- diferenciar usuario anonimo de usuario autenticado
- validar acesso a portfolio e alertas por usuario

### Alertas

- historico de disparo deve ser remoto e auditavel
- cliente nao e fonte de verdade final para entrega de alerta

### Webhooks

- criacao e edicao via backend autenticado
- validacao de URL
- logs de tentativa sem vazar segredo

### Push notifications

- device token tratado como dado sensivel operacional
- rotacao e invalidacao quando necessario
- payload enxuto

## Regras de cliente

- desabilitar logs verbosos em release
- ofuscar build Android release
- usar configuracao de release por flavor
- tratar links externos com validacao

## Seguranca de rede

- HTTPS obrigatorio
- certificate pinning opcional para fase posterior, se criticidade subir
- timeout e retry controlados

## Testes de seguranca minimos

- tentativa de uso sem auth onde auth for obrigatoria
- validacao de expiracao de sessao
- validacao de armazenamento seguro
- validacao de rotas protegidas no backend

## Riscos residuais assumidos no MVP

- leitura de alguns dados publicos diretamente do cliente
- dependencia parcial de APIs terceiras publicas

Esses riscos sao aceitaveis apenas para leitura de dados nao sensiveis e devem
ser explicitamente documentados.
