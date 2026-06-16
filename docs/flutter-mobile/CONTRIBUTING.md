# CONTRIBUTING.md - Cripto Dashboard Mobile

## Proposito

Definir como contribuir com o futuro app Flutter do Cripto Dashboard Mobile,
mantendo consistencia tecnica, previsibilidade de entrega e compatibilidade com
o padrao Ad Rock.

## Setup

```bash
flutter pub get
flutter doctor
```

## Fluxo de desenvolvimento

1. criar branch curta e descritiva
2. implementar uma entrega fechada
3. rodar qualidade local
4. atualizar docs quando necessario
5. abrir PR com descricao objetiva

## Checklist antes de PR

```bash
dart format .
flutter analyze
flutter test
```

Se a alteracao tocar fluxos criticos:

```bash
flutter test integration_test
```

## Padrões de codigo

- Dart idiomatico
- widgets pequenos e composiveis
- estado fora da camada de UI
- repositorios e datasources separados
- modelos tipados e serializacao automatizada
- nada de regras de negocio escondidas em widgets
- aplicar a escada do `ponytail` antes de adicionar codigo ou dependencia nova

## Regra de decisao enxuta

Antes de propor plugin, helper, wrapper ou camada nova, validar:

1. o problema precisa mesmo existir no app?
2. o Flutter SDK resolve?
3. Android/iOS nativo resolve via integracao pequena?
4. ja temos uma dependencia instalada que resolve?
5. da para manter a menor implementacao correta?

Se a resposta parar antes do item 5, nao adicionar arquitetura extra.

## Convencoes de commit

- `feat(mobile): adiciona detalhes do ativo`
- `fix(alerts): corrige rearm de alerta`
- `docs(flutter): atualiza arquitetura do app`

## Quando a documentacao deve ser atualizada

- nova feature no MVP
- mudanca de arquitetura
- mudanca de integracao externa
- mudanca de release/build
- mudanca de seguranca, auth ou notificacao

## Regras para agentes

- seguir `AGENTS.md`
- evitar PRs gigantes
- nao alterar estrategia de notificacao ou auth sem atualizar specs
- nao assumir backend pronto quando ele estiver marcado como futuro
- marcar simplificacoes conscientes com `ponytail:` quando houver limite claro

## Regras de revisao

Toda revisao deve validar:

- impacto em Android e iOS
- impacto em offline/cache
- impacto em push notifications
- impacto em consumo de API externa
- impacto em seguranca e segredo no cliente
