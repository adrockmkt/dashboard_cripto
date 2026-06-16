# AGENTS.md - Cripto Dashboard Mobile

## Proposito

Guia operacional para agentes de IA e colaboradores humanos no futuro
repositorio Flutter do Cripto Dashboard Mobile.

Este documento herda a governanca padrao da Ad Rock e adapta os comandos e as
regras para um app Android/iOS feito em Flutter.

## Filosofia Ponytail aplicada

Este projeto deve adotar a escada de decisao inspirada no `ponytail`:

1. isso realmente precisa ser construido?
2. o Dart/Flutter SDK ja resolve?
3. a plataforma nativa ja cobre?
4. alguma dependencia ja instalada resolve?
5. o problema cabe na menor implementacao correta?
6. so depois disso criar codigo novo

Regras derivadas:

- sem abstractions nao pedidas
- sem plugin novo se o SDK ou Flutter resolverem
- sem boilerplate decorativo
- simplificar e deletar vale mais do que empilhar camadas
- quando um atalho consciente for adotado, marcar com `ponytail:` e explicar
  limite e caminho de upgrade

## Ambiente de desenvolvimento

### Requisitos

- Flutter 3.24+
- Dart 3.5+
- Xcode 15+ para iOS
- Android Studio Iguana+ ou SDK equivalente
- CocoaPods instalado
- Git habilitado

### Setup inicial

```bash
flutter pub get
flutter doctor
```

### Rodar local

```bash
flutter run
```

### Build de producao

```bash
flutter build apk --release
flutter build appbundle --release
flutter build ios --release
```

### Comandos obrigatorios de qualidade

```bash
dart format .
flutter analyze
flutter test
```

## Estrutura recomendada do repo Flutter

```txt
lib/
  app/
  core/
  features/
  shared/
test/
integration_test/
docs/
assets/
```

## Regras de qualidade

Todo commit relevante deve passar por:

- `dart format .`
- `flutter analyze`
- `flutter test`

Quando existir:

- `flutter test integration_test`

## Regras para agentes de IA

- ler este documento antes de operar
- nao trocar bibliotecas-base sem justificativa tecnica
- nao adicionar dependencia pesada sem necessidade clara
- manter separacao entre UI, estado, dados e integracoes
- preferir PRs pequenos e rastreaveis
- atualizar `docs/flutter-mobile/` quando a arquitetura mudar
- questionar escopo inflado quando uma solucao menor cobrir o caso

## Regras de implementacao

- uma feature por modulo
- sem logica de rede diretamente na UI
- sem segredos embutidos no app
- sem push notification acoplada a logica local apenas
- sem dependencias de webview como caminho principal do produto
- sem plugin para algo que um widget nativo do Flutter ja entregue bem

## Politica de dados e ambiente

- usar `.env.example` ou estrategia equivalente por flavor
- nunca commitar secrets reais
- validar ambiente antes de chamadas remotas
- diferenciar `dev`, `staging` e `prod`

## Convencao de commits

- `feat:`
- `fix:`
- `docs:`
- `refactor:`
- `test:`
- `chore:`

## Definicao de pronto por PR

- compila em pelo menos um target local
- nao quebra `flutter analyze`
- possui testes onde o fluxo justificar
- atualiza docs se tocar arquitetura, seguranca ou release
