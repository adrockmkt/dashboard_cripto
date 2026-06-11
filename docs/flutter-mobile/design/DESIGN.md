# DESIGN.md - Sistema visual do Cripto Dashboard Mobile

## Objetivo

Documentar a direcao visual e de interacao do app Flutter de forma suficientemente
clara para design, desenvolvimento e agentes.

## Estrutura de navegacao

Bottom navigation recomendada:

1. Home
2. Markets
3. Alerts
4. Portfolio
5. More

Entradas secundarias:

- detalhe do ativo
- DCA
- Stock-to-Flow
- On-Chain
- Report
- Settings

## Home

A Home deve priorizar:

- sentimento do mercado
- dominancia BTC
- top movers
- watchlist/favoritos
- noticias principais
- resumo do portfolio

## Tela de ativo

Cada ativo deve ter:

- preco atual
- variacao 24h
- grafico principal
- indicadores essenciais
- niveis relevantes
- alertas relacionados
- noticias/contexto do ativo

## Portfolio

Elementos centrais:

- valor total
- P&L total
- distribuicao por ativo
- posicoes
- historico resumido

## Alertas

Fluxos:

- listar alertas
- criar alerta
- editar alerta
- ver historico de disparos
- configurar canais

## Tipografia

Sugestao:

- headings fortes e curtos
- numeros com alto destaque
- labels curtos e consistentes

## Densidade de informacao

- alta, mas com grupos claros
- cards compactos
- muito cuidado com scroll horizontal

## Cores

Direcao:

- fundo escuro principal ou neutro grafite
- azuis frios para primario
- verde para subida
- vermelho para queda
- amarelo/laranja para alerta e contexto de risco

## Graficos

Regras:

- um grafico dominante por tela
- linhas secundarias opcionais
- legenda simples
- tooltip legivel
- sem excesso de anotacoes simultaneas

## Estados

Todo componente importante deve prever:

- loading
- empty
- erro
- fallback
- stale data

## Acessibilidade

- texto e numero com contraste AA
- gestos complementados por acoes visiveis
- suporte a Dynamic Type quando viavel
- sem depender apenas de vermelho/verde para entendimento
