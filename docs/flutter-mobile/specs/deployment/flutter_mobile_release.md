# Deployment and Release Spec - Flutter Mobile

## Objetivo

Definir o fluxo de build, assinatura, ambientes e publicacao do app Flutter.

## Ambientes

- `dev`
- `staging`
- `prod`

## Flavors recomendados

Android:

- `dev`
- `staging`
- `prod`

iOS:

- schemes equivalentes

## Configuracao por ambiente

Cada flavor deve definir:

- API base URL
- flags de observabilidade
- provider de analytics
- provider de push
- modo de logs

## Build commands sugeridos

```bash
flutter build apk --flavor prod --release
flutter build appbundle --flavor prod --release
flutter build ios --flavor prod --release
```

## CI/CD minimo

Pipeline recomendada:

1. install
2. format check
3. analyze
4. tests
5. build Android
6. build iOS
7. release artifacts

## Distribuicao recomendada

- Android Internal Testing
- TestFlight

## Requisitos de release

- changelog curto
- validacao de ambiente
- versao sem logs de debug
- teste de fluxo principal
- teste de push basico

## Assinatura e segredos

- chaves fora do repo
- secrets no CI seguro
- nada de arquivo sensivel versionado

## Checklist de release

- app abre
- home carrega
- markets carrega
- detalhe de ativo carrega
- portfolio sincroniza
- alerta pode ser criado
- push basico validado
- crash reporting habilitado

## Observacao importante

O app mobile nao deve depender de deploy manual por copia de arquivos como no
frontend web estatico. O ciclo de release precisa nascer automatizavel.
