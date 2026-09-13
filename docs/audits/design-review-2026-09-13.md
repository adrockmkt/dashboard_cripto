# Revisão visual e de experiência — 13 de setembro de 2026

**Produto:** Cripto Dashboard público, sem login.  
**Evidências:** captura desktop da primeira visita e captura mobile da visão Trading Pro.  
**Limite:** esta revisão não substitui testes completos de teclado, leitor de tela
ou métricas de campo.

## Capturas aceitas

1. Desktop, primeira visita —
   `.playwright-cli/page-2026-09-13T22-14-44-717Z.png`
2. Mobile, Trading Pro —
   `.playwright-cli/page-2026-09-13T22-14-45-424Z.png`

## Diagnóstico

| Prioridade | Evidência | Achado | Impacto | Direção de correção |
| --- | --- | --- | --- | --- |
| Alta | 1 | O onboarding ocupa o centro e desfoca quase toda a primeira dobra; o contexto de mercado fica ilegível. | A primeira ação compete com a razão de existir do produto. | Converter a abertura em uma introdução compacta, opcional e contextual, sem bloquear a leitura do mercado. |
| Alta | 2 | O cabeçalho mobile comprime menu, busca, atualizar, notificações, idioma e tema em uma linha de ícones. | Ícones sem texto dificultam descoberta e a área de toque fica visualmente congestionada. | Manter menu, busca e notificação visíveis; mover idioma, tema e atualização para um painel de ações. |
| Alta | 2 | A tela Trading Pro começa pelo gráfico, mas seleção de ativo, fonte, estado do dado e atalhos ficam dispersos. | Usuário não sabe rapidamente o que está vendo nem como mudar o contexto. | Criar uma barra de contexto com ativo, intervalo, origem do dado e ações, antes do gráfico. |
| Média | 1 e 2 | O produto mistura cartões, bordas e controles de tamanhos diferentes; a hierarquia muda entre dashboard e trading. | A ferramenta parece composta de módulos independentes, não de uma plataforma única. | Definir escala única de espaçamento, títulos, cards, estados e densidade usando os componentes shadcn já instalados. |
| Média | 2 | A navegação inferior é clara, porém divide atenção com muitos controles no topo e ocupa espaço em uma tela de gráfico. | Reduz área útil e torna a troca de contexto menos evidente. | Preservar cinco destinos principais e introduzir uma ação “Mais” para os módulos secundários. |
| Média | 1 | O modal usa seis indicadores de etapa pouco explicativos e os CTAs não diferenciam bem pular de continuar. | O tour parece obrigatório mesmo sendo opcional. | Exibir “Etapa 1 de 4”, benefício direto e um link discreto para reabrir o tour posteriormente. |

## Decisões de design para a próxima implementação

1. Dashboard inicial: contexto de mercado e uma ação primária acima da dobra;
   notícias, métricas secundárias e relatórios abaixo.
2. Mobile: cabeçalho de três ações; painel inferior para preferências e ações
   auxiliares; navegação inferior com destino “Mais”.
3. Trading: barra de contexto e estado de fonte explícito; gráfico como conteúdo
   principal sem competir com múltiplos painéis simultâneos.
4. Sistema visual: tokens de espaçamento e tipografia, cards com papéis claros
   (resumo, ação, insight), e estados consistentes de real, fallback e simulado.

## Implementação e validação — 13 de setembro de 2026

Direção aprovada aplicada usando a logo original em `src/assets/adrock-logo.png`.
O produto passou a usar preto/grafite, laranja, vermelho, âmbar e prata como
tokens de interface; azul ficou restrito aos dados de gráficos quando necessário.

| Achado inicial | Estado | Evidência de correção |
| --- | --- | --- |
| Onboarding bloqueava a primeira dobra | Resolvido | `OnboardingTour` é um card não modal no canto e informa a etapa atual. |
| Controles mobile congestionados | Resolvido | Cabeçalho mantém menu, busca, atualizar e notificações; idioma e tema ficam no painel lateral. |
| Contexto do Trading disperso | Resolvido | Trading Pro exibe par, estado da fonte, intervalo e atualização acima do gráfico. |
| Shell visual inconsistente | Resolvido | Sidebar, bottom navigation, briefing, cards e gráfico consomem tokens Ad Rock. |
| Menu mobile sem nome de diálogo | Resolvido | O painel tem título e descrição invisíveis visualmente, mas anunciados por leitor de tela. |
| Destinos secundários sem “Mais” | P3 | A sidebar já dá acesso a todos; um agrupamento “Mais” pode ser avaliado em iteração posterior. |

As verificações unitárias cobrem identidade do destino ativo, logo da navegação,
briefing, contexto do Trading Pro, diálogo mobile e onboarding não bloqueante.
