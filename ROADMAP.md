# Roadmap do Cripto Dashboard

Este documento foi convertido para um roadmap de produto e execucao. Ele nao descreve o estado atual detalhado do sistema; para isso, consulte `README.md`.

## Objetivo geral

Transformar o dashboard atual, que ja possui uma boa base de interface e navegacao, em uma plataforma mais confiavel para analise cripto, trocando modulos demonstrativos por integracoes reais e adicionando diferenciais de produto nas etapas seguintes.

## Status de execucao

- Sprint 1: concluida
- Sprint 2: concluida
- Sprint 3: concluida na primeira fase de produto
- Sprint 4: em andamento

As secoes abaixo preservam o desenho original de execucao e servem como historico de planejamento. O que segue como backlog agora e a expansao da camada social, da parte educacional e de uma infraestrutura mais robusta para alertas fora da sessao do usuario.

## Sprint 4

### Nome
Producao, robustez e acabamento final

### Objetivo
Levar o projeto de um dashboard funcional para uma base mais pronta para operacao continua, com foco em alertas mais robustos, notificacoes nativas, melhoria de performance e transparência operacional.

### Entregas planejadas
- Notificacoes nativas do navegador via service worker
- Persistencia estruturada para historico e fila de alertas visando backend futuro
- Base de schema para execucao de alertas fora da sessao
- Otimizacao do bundle principal com code splitting manual
- Melhor sinalizacao de estados de execucao e permissao de notificacao
- Revisao final das areas ainda parciais de frontend e portfolio

### Melhorias propostas para esta sprint
- Separar execucao local de alertas da futura execucao backend
- Registrar alertas disparados em uma fila persistente
- Preparar uma tabela de jobs e historico no schema SQL
- Reduzir peso do chunk principal do Vite
- Tornar notificacoes do navegador uma acao explicita e reutilizavel

### Criterios de pronto
- Usuario pode ativar notificacoes nativas no navegador
- Alertas disparados podem gerar notificacoes fora da aba ativa enquanto a aplicacao estiver aberta
- Projeto passa a ter base de schema para workers ou edge functions futuras
- Build reduz o acoplamento do bundle principal em chunks manuais mais coerentes
- Portfolio deixa de recalcular preco com simulacao local
- Documentacao passa a refletir com precisao o que ainda e parcial e o que fica para a proxima fase

### Riscos
- Limitacoes do navegador para notificacoes sem backend push
- Diferencas de permissao entre browsers
- Necessidade posterior de credenciais server-side para execucao realmente autonoma

### Dependencias
- Estrutura de service worker
- Persistencia opcional via Supabase
- Revisao de configuracao de build no Vite

## Proxima fase recomendada

Depois da Sprint 4, o backlog de maior impacto fica concentrado em 4 frentes:

1. backend real para execucao de alertas fora da sessao, com scheduler e entrega persistente
2. email transacional e canal externo confiavel para alertas
3. integracao social direta para sentimento, separada da proxy editorial
4. remocao das simulacoes restantes em componentes auxiliares como `AdvancedCharts` e `AdvancedTechnicalIndicators`

## Principios do roadmap

- Priorizar aproveitamento da UI que ja existe
- Substituir dados simulados por dados reais antes de expandir features
- Centralizar integracoes em uma camada de servicos clara
- Tornar o produto mais confiavel antes de torna-lo mais complexo
- Separar claramente dado real, fallback e simulacao

## Melhorias nas sprints

### O que foi melhorado no desenho das sprints

As 3 sprints foram refinadas para ficarem mais executaveis. Antes, elas estavam corretas em prioridade, mas amplas demais. Agora cada sprint possui:

- objetivo claro
- foco tecnico
- entregas concretas
- criterios de pronto
- riscos e dependencias

Isso reduz retrabalho e evita comecar features novas sobre uma base de dados ainda inconsistente.

## Sprint 1

### Nome
Base de dados real nas telas existentes

### Objetivo
Substituir dados mockados ou simulados nas telas mais importantes por integracoes reais, sem refazer a UX do produto.

### Por que esta sprint vem primeiro
Hoje boa parte do valor percebido do produto ja esta na interface. O maior ganho de curto prazo e fazer as telas existentes passarem a refletir dados reais, em vez de expandir o escopo da aplicacao.

### Entregas
- Integrar feed de noticias real
- Integrar OHLCV real ao modulo de candlestick
- Integrar metricas on-chain reais
- Padronizar loading, erro, fallback e retry
- Consolidar uma camada unica de servicos para dados externos
- Identificar explicitamente quando um dado vier de fallback

### Melhorias propostas para esta sprint
- Definir contratos de dados tipados para cada fonte antes de alterar componentes
- Criar adaptadores por provedor, evitando acoplar componente a resposta bruta de API
- Padronizar um estado `source: real | fallback | simulated` para uso na UI
- Preparar cache e politicas de refresh desde o inicio
- Registrar limites e degradacao por rate limit no desenho tecnico

### Arquivos mais afetados
- `src/services/cryptoApi.ts`
- `src/components/CryptoNewsFeed.tsx`
- `src/components/advanced/ProfessionalCandlestickChart.tsx`
- `src/components/advanced/OnChainMetrics.tsx`

### Criterios de pronto
- Noticias deixam de ser mockadas
- Candlestick deixa de gerar candles localmente como caminho principal
- On-chain deixa de depender de dados aleatorios como caminho principal
- Componentes exibem erro e fallback de forma coerente
- Cada integracao externa tem funcao dedicada e tipada

### Riscos
- Rate limit de APIs gratuitas
- Diferenca de formato entre provedores
- Custos ou autenticacao de fontes on-chain

### Dependencias
- Escolha dos provedores de noticia, OHLCV e on-chain
- Definicao de politica de fallback

## Sprint 2

### Nome
Confiabilidade analitica e alertas reais

### Objetivo
Transformar os modulos analiticos e de alerta de demonstracao em ferramentas com comportamento confiavel e rastreavel.

### Por que esta sprint vem depois
Nao vale fazer alertas reais ou simuladores mais serios em cima de uma base de dados ainda inconsistente. A Sprint 2 depende diretamente da qualidade dos dados organizados na Sprint 1.

### Entregas
- Tornar os alertas avancados baseados em condicoes reais
- Implementar webhook real
- Persistir regras de alerta de forma consistente
- Ligar DCA a historico real
- Melhorar S2F com separacao entre historico, modelo e projecao
- Conectar o fluxo de API keys a usos reais no app

### Melhorias propostas para esta sprint
- Separar claramente "motor de alerta" da interface de alerta
- Criar avaliadores de regra por dominio: preco, tecnico, on-chain, sentimento
- Salvar historico de disparos e motivo do disparo
- Introduzir validacao forte para regras e actions
- No DCA e no S2F, marcar visualmente o que e dado historico e o que e simulacao/projecao
- Definir testes para calculos financeiros e logica de alerta

### Arquivos mais afetados
- `src/components/advanced/AdvancedAlertsSystem.tsx`
- `src/hooks/useCustomAlerts.ts`
- `src/components/advanced/DCASimulator.tsx`
- `src/components/advanced/StockToFlowModel.tsx`
- `src/components/ApiKeyConfig.tsx`

### Criterios de pronto
- Alertas avancados deixam de depender de sorteio ou simulacao para disparo
- Webhook funcional e configuravel
- DCA passa a usar historico real como base principal
- S2F diferencia dado historico de projecao
- Chaves configuradas pelo usuario passam a influenciar integracoes reais quando necessario

### Riscos
- Ambiguidade nas regras de alerta
- Complexidade de testes para calculos e condicoes
- Necessidade futura de backend para automacao de alertas fora da sessao do usuario

### Dependencias
- Conclusao da camada de dados da Sprint 1
- Definicao de escopo do webhook e formato de payload

## Sprint 3

### Nome
Diferenciais de produto e profundidade analitica

### Objetivo
Adicionar recursos que aumentem o valor estrategico do produto apos a base de dados e os modulos centrais estarem confiaveis.

### Por que esta sprint fica por ultimo
Essa sprint aumenta profundidade e diferenciacao, mas depende da maturidade tecnica das duas anteriores para nao nascer sobre bases frageis.

### Entregas
- Comparativo entre tokens
- Ranking por ROI, market cap e volume ratio
- Camada de sentimento social, se houver fonte viavel
- Secao educacional ou glossario inicial
- Refinamento do relatorio diario com agregacao de dados reais

### Melhorias propostas para esta sprint
- Tratar comparativos como um subproduto com filtros, eixos e periodos
- Definir primeiro um MVP de comparativo para 2 ativos antes de suportar muitos
- Validar viabilidade tecnica e custo da camada social antes de comprometer o escopo
- Fazer a secao educacional nascer integrada ao produto, explicando metricas ja existentes
- Reaproveitar o relatorio diario como camada editorial dos dados da plataforma

### Arquivos mais afetados
- Novos componentes de comparativo
- `src/components/DailyReport.tsx`
- componentes e servicos de sentimento social
- futuros componentes educacionais

### Criterios de pronto
- Usuario consegue comparar ativos de forma objetiva
- Ranking passa a ser navegavel e util
- Relatorio diario deixa de depender so de composicao local simples
- Primeira camada educacional publicada

### Riscos
- Escopo crescer demais
- Baixa qualidade de dados sociais
- Complexidade de UX se tudo for introduzido ao mesmo tempo

### Dependencias
- Sprints 1 e 2 concluidas ou estabilizadas

## Ordem recomendada de implementacao dentro das sprints

### Sprint 1
1. Escolha dos provedores
2. Contratos tipados e servicos
3. Noticias reais
4. OHLCV real
5. On-chain real
6. Ajustes de fallback e estados de erro

### Sprint 2
1. Motor de alertas
2. Persistencia e historico de disparos
3. Webhook
4. DCA com historico real
5. S2F com separacao de historico e projecao
6. Integracao real de API keys

### Sprint 3
1. Comparativo entre tokens
2. Ranking e filtros
3. Relatorio diario refinado
4. Camada social
5. Camada educacional

## Definicao de sucesso por sprint

### Sprint 1
O produto parece menos demo e mais plataforma confiavel.

### Sprint 2
O produto passa a gerar sinais e analises que podem ser defendidos tecnicamente.

### Sprint 3
O produto ganha diferenciacao e profundidade competitiva.

## Proximo passo recomendado

Executar a Sprint 1 primeiro, com foco em:

- servicos de dados
- noticias reais
- candles reais
- on-chain real

Depois disso, seguir para a Sprint 2 e Sprint 3 sem reabrir fundamentos ja resolvidos.
