# Cripto Dashboard Mobile - Documentacao Flutter

Este diretorio consolida a documentacao de planejamento, arquitetura e operacao
para evoluir o projeto atual em um app mobile nativo com Flutter para Android e
iOS.

O objetivo nao e reescrever cegamente a interface web. O objetivo e transformar
o produto atual em uma experiencia mobile consistente, escalavel e segura,
preservando o que ja funciona e corrigindo os limites naturais da implementacao
web.

## Referencia metodologica adicional

Esta documentacao passa a refletir tambem a filosofia do projeto `ponytail`
([DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)),
principalmente na disciplina de implementacao enxuta:

- primeiro questionar se a feature precisa mesmo existir
- preferir Dart/Flutter SDK antes de escrever codigo novo
- preferir recurso nativo da plataforma antes de plugin adicional
- preferir dependencia ja instalada antes de adicionar outra
- so escrever codigo novo quando os niveis anteriores nao resolverem

Aplicacao pratica no app Flutter:

- usar o maximo possivel de widgets e capacidades nativas do Flutter
- evitar bibliotecas redundantes de UI, estado e charting
- reduzir wrappers e abstractions sem ganho real
- documentar simplificacoes conscientes com marcador `ponytail:`

Limites desta filosofia:

- seguranca
- acessibilidade
- validacao em fronteiras de confianca
- prevencao de perda de dados

Esses pontos nao entram em modo "lazy" e devem continuar tratados com rigor.

## Contexto de origem

Produto atual de referencia:

- dashboard web em React/Vite
- foco em mercado cripto, portfolio, alertas, relatorios e modulos analiticos
- integracoes reais para mercado, noticias, parte de on-chain e portfolio
- persistencia atual em Supabase opcional + localStorage
- varios modulos ja maduros em UX, mas com partes ainda parciais em analise
  complementar e execucao de alertas fora da sessao

## Objetivo do app mobile

Construir um app Flutter que entregue:

- leitura rapida de mercado em mobile
- experiencia forte de portfolio e watchlist
- alertas confiaveis com push notification
- comparativos e relatorios pensados para tela pequena
- base tecnica pronta para Android e iOS
- suporte futuro a backend dedicado para alertas e agregacao de dados

## Principios de migracao

- mobile-first, nao desktop comprimido
- dados reais como prioridade
- backend de agregacao onde a chamada direta a terceiros trouxer risco
- separar o que e MVP, v1 e backlog
- documentar claramente o que vem do app atual e o que muda no mobile

## Mapa dos documentos

- `AGENTS.md`
  - regras operacionais para agentes e colaboradores no futuro repo Flutter
- `CONTRIBUTING.md`
  - fluxo de contribuicao, qualidade e PRs
- `AI_PROJECT_STACK.md`
  - stack recomendada para o app Flutter e ferramentas do workflow
- `design.md`
  - diretrizes visuais e de UX em linguagem curta
- `design/DESIGN.md`
  - sistema visual detalhado do app mobile
- `specs/architecture/flutter_mobile_architecture.md`
  - arquitetura do app, modulos, camadas e BFF/backend recomendado
- `specs/frontend/flutter_mobile_product_spec.md`
  - telas, navegação, features e mapeamento web -> mobile
- `specs/integrations/flutter_mobile_integrations.md`
  - integracoes externas, contratos e politicas de fallback
- `specs/database/flutter_mobile_data_model.md`
  - modelo de dados remoto e cache local
- `specs/backend/flutter_mobile_backend_requirements.md`
  - requisitos do backend de suporte ao app
- `specs/security/flutter_mobile_security.md`
  - seguranca mobile, secrets, auth, push e hardening
- `specs/deployment/flutter_mobile_release.md`
  - build, flavors, CI/CD e publicacao
- `specs/monitoring/flutter_mobile_monitoring.md`
  - observabilidade, crash reporting e monitoramento

## Mapeamento rapido do produto atual para o app

- `Dashboard`
  - vai para Home mobile resumida
- `Trading Pro`
  - vira tela de ativo com grafico principal e indicadores essenciais
- `On-Chain`
  - vira aba/contexto avancado por ativo ou secao no relatorio
- `Modelos`
  - vira area de ferramentas com DCA e Stock-to-Flow
- `Portfolio`
  - vira area central de uso recorrente no app
- `Alertas`
  - vira modulo com foco em criacao, historico e push
- `Relatorio`
  - vira leitura taticamente resumida para mobile

## Decisoes importantes ja assumidas nesta documentacao

- Flutter sera a stack principal do app mobile
- Android e iOS devem compartilhar a maior parte do codigo
- notificacoes do navegador nao sao estrategia mobile; o app deve usar push
- integracoes sensiveis devem migrar para backend/BFF sempre que houver risco
  de limite, segredo exposto ou dependencia instavel

## Fora de escopo desta documentacao

- implementacao do app Flutter
- escolha final de design visual em Figma
- definicao de naming em stores
- definicao comercial de plano gratuito/pago

## Resultado esperado

Ao final desta documentacao, um futuro repo Flutter deve conseguir nascer com:

- README e guias operacionais claros
- arquitetura definida
- backlog de MVP objetivo
- fluxo de release pensado
- requisitos de backend e seguranca documentados
